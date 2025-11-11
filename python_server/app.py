import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv
from typing import Optional, Dict, Any
import json

load_dotenv()
load_dotenv("../.env")

app = Flask(__name__)
CORS(app, supports_credentials=True)

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://rpjsrnptvphtabpyyxtf.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwanNybnB0dnBodGFicHl5eHRmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTk2NTc5NywiZXhwIjoyMDc3NTQxNzk3fQ.yjy2FVK-cqU1WgXMJOx0T_kt_NnVrixNtXDOujGUodU")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "message": "BoK Pharm Python Backend Running"}), 200

@app.route("/api/medications", methods=["GET"])
def get_medications():
    try:
        response = supabase.table("medications").select("*").eq("is_otc", True).execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/medications", methods=["POST"])
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

@app.route("/api/pharmacies", methods=["GET"])
def get_pharmacies():
    try:
        response = supabase.table("pharmacies").select("*").execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/pharmacies", methods=["POST"])
def create_pharmacy():
    try:
        data = request.get_json()
        response = supabase.table("pharmacies").insert(data).execute()
        return jsonify(response.data[0]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/inventory", methods=["GET"])
def get_inventory():
    try:
        user_id = request.headers.get("X-User-ID")
        
        if not user_id:
            return jsonify({"items": [], "needsSetup": True}), 200
        
        user_response = supabase.table("users").select("pharmacy_id").eq("id", user_id).execute()
        
        if not user_response.data or not user_response.data[0].get("pharmacy_id"):
            return jsonify({"items": [], "needsSetup": True}), 200
        
        pharmacy_id = user_response.data[0]["pharmacy_id"]
        
        response = supabase.table("inventory").select("*").eq("pharmacy_id", pharmacy_id).execute()
        
        return jsonify({"items": response.data, "needsSetup": False}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/inventory", methods=["POST"])
def create_inventory():
    try:
        user_id = request.headers.get("X-User-ID")
        
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401
        
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

@app.route("/api/inventory/<inventory_id>", methods=["DELETE"])
def delete_inventory(inventory_id):
    try:
        user_id = request.headers.get("X-User-ID")
        
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401
        
        response = supabase.table("inventory").delete().eq("id", inventory_id).execute()
        
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/auth/user", methods=["GET"])
def get_user():
    try:
        user_id = request.headers.get("X-User-ID")
        
        if not user_id:
            return jsonify({"error": "Not authenticated"}), 401
        
        response = supabase.table("users").select("*").eq("id", user_id).execute()
        
        if not response.data:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify(response.data[0]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/auth/setup-pharmacy", methods=["POST"])
def setup_pharmacy():
    try:
        user_id = request.headers.get("X-User-ID")
        
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401
        
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

@app.route("/api/auth/sync-user", methods=["POST"])
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
