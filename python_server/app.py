import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv
from typing import Optional, Dict, Any
from functools import wraps
import json
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth

load_dotenv()
load_dotenv("../.env")

app = Flask(__name__)
CORS(app, supports_credentials=True)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables are required")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Initialize Firebase Admin SDK
FIREBASE_PROJECT_ID = os.getenv("VITE_FIREBASE_PROJECT_ID")
if not FIREBASE_PROJECT_ID:
    raise ValueError("VITE_FIREBASE_PROJECT_ID environment variable is required")

# Initialize Firebase Admin with minimal config (uses environment for credentials)
if not firebase_admin._apps:
    firebase_admin.initialize_app(options={
        'projectId': FIREBASE_PROJECT_ID
    })

def verify_firebase_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "No valid authorization token provided"}), 401
        
        try:
            id_token = auth_header.split('Bearer ')[1]
            decoded_token = firebase_auth.verify_id_token(id_token)
            request.firebase_user = decoded_token
            request.user_id = decoded_token['uid']
            return f(*args, **kwargs)
        except Exception as e:
            print(f"Token verification error: {str(e)}")
            return jsonify({"error": "Invalid authentication token"}), 401
    
    return decorated_function

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "message": "BoK Pharm Python Backend Running"}), 200

@app.route("/medications", methods=["GET"])
def get_medications():
    try:
        response = supabase.table("medications").select("*").eq("is_otc", True).execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/medications", methods=["POST"])
def create_medication():
    try:
        data = request.get_json()
        
        if not data.get("is_otc", True):
            return jsonify({"error": "Only over-the-counter (OTC) medications are allowed"}), 400
        
        data["is_otc"] = True
        data["requires_prescription"] = False
        
        response = supabase.table("medications").insert(data).execute()
        return jsonify(response.data[0]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/pharmacies", methods=["GET"])
def get_pharmacies():
    try:
        response = supabase.table("pharmacies").select("*").execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/pharmacies", methods=["POST"])
def create_pharmacy():
    try:
        data = request.get_json()
        response = supabase.table("pharmacies").insert(data).execute()
        return jsonify(response.data[0]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/inventory", methods=["GET"])
@verify_firebase_token
def get_inventory():
    try:
        user_id = request.user_id
        
        user_response = supabase.table("users").select("pharmacy_id").eq("id", user_id).execute()
        
        if not user_response.data or not user_response.data[0].get("pharmacy_id"):
            return jsonify({"items": [], "needsSetup": True}), 200
        
        pharmacy_id = user_response.data[0]["pharmacy_id"]
        
        response = supabase.table("inventory").select("*").eq("pharmacy_id", pharmacy_id).execute()
        
        return jsonify({"items": response.data, "needsSetup": False}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/inventory", methods=["POST"])
@verify_firebase_token
def create_inventory():
    try:
        user_id = request.user_id
        
        user_response = supabase.table("users").select("pharmacy_id").eq("id", user_id).execute()
        
        if not user_response.data or not user_response.data[0].get("pharmacy_id"):
            return jsonify({"error": "Please set up your pharmacy first"}), 400
        
        pharmacy_id = user_response.data[0]["pharmacy_id"]
        
        data = request.get_json()
        data["pharmacy_id"] = pharmacy_id
        
        response = supabase.table("inventory").insert(data).execute()
        return jsonify(response.data[0]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/inventory/<inventory_id>", methods=["DELETE"])
@verify_firebase_token
def delete_inventory(inventory_id):
    try:
        user_id = request.user_id
        
        # Verify user owns this inventory item
        inventory_response = supabase.table("inventory").select("pharmacy_id").eq("id", inventory_id).execute()
        
        if not inventory_response.data:
            return jsonify({"error": "Inventory item not found"}), 404
        
        inventory_pharmacy_id = inventory_response.data[0]["pharmacy_id"]
        
        user_response = supabase.table("users").select("pharmacy_id").eq("id", user_id).execute()
        
        if not user_response.data or user_response.data[0].get("pharmacy_id") != inventory_pharmacy_id:
            return jsonify({"error": "Unauthorized"}), 403
        
        response = supabase.table("inventory").delete().eq("id", inventory_id).execute()
        
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/auth/user", methods=["GET"])
@verify_firebase_token
def get_user():
    try:
        user_id = request.user_id
        
        response = supabase.table("users").select("*").eq("id", user_id).execute()
        
        if not response.data:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify(response.data[0]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/auth/setup-pharmacy", methods=["POST"])
@verify_firebase_token
def setup_pharmacy():
    try:
        user_id = request.user_id
        
        user_response = supabase.table("users").select("*").eq("id", user_id).execute()
        
        if not user_response.data:
            return jsonify({"error": "User not found"}), 404
        
        user = user_response.data[0]
        
        if user.get("pharmacy_id"):
            return jsonify({"message": "Pharmacy already set up", "pharmacy_id": user["pharmacy_id"]}), 200
        
        pharmacy_data = {
            "name": f"{user.get('first_name', 'My')} Pharmacy",
            "address": "TBD",
            "phone": "TBD",
            "hours": "24/7",
            "is_open_24_hours": True,
            "onboarding_status": "active"
        }
        
        pharmacy_response = supabase.table("pharmacies").insert(pharmacy_data).execute()
        pharmacy_id = pharmacy_response.data[0]["id"]
        
        supabase.table("users").update({
            "pharmacy_id": pharmacy_id,
            "role": "pharmacy_owner"
        }).eq("id", user_id).execute()
        
        return jsonify({"success": True, "pharmacy_id": pharmacy_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/auth/sync-user", methods=["POST"])
def sync_user():
    try:
        data = request.get_json()
        
        firebase_uid = data.get("firebase_uid")
        email = data.get("email")
        first_name = data.get("first_name")
        last_name = data.get("last_name")
        profile_image_url = data.get("profile_image_url")
        
        if not firebase_uid or not email:
            return jsonify({"error": "firebase_uid and email are required"}), 400
        
        existing_user = supabase.table("users").select("*").eq("id", firebase_uid).execute()
        
        if existing_user.data:
            user = existing_user.data[0]
            return jsonify(user), 200
        else:
            new_user = {
                "id": firebase_uid,
                "email": email,
                "first_name": first_name,
                "last_name": last_name,
                "profile_image_url": profile_image_url,
                "role": "customer"
            }
            
            response = supabase.table("users").insert(new_user).execute()
            return jsonify(response.data[0]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=True)
