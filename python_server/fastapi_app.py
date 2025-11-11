import os
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
from typing import Optional, List, Dict, Any
import firebase_admin
from firebase_admin import auth as firebase_auth
from models import (
    User, Pharmacy, Medication, Order, OrderItem, 
    Cart, CartItem, OrderStatus
)
from pydantic import BaseModel
from datetime import datetime

load_dotenv()
load_dotenv("../.env")

app = FastAPI(title="BoK Pharm API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables are required")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

FIREBASE_PROJECT_ID = os.getenv("VITE_FIREBASE_PROJECT_ID")
if not FIREBASE_PROJECT_ID:
    raise ValueError("VITE_FIREBASE_PROJECT_ID environment variable is required")

if not firebase_admin._apps:
    firebase_admin.initialize_app(options={'projectId': FIREBASE_PROJECT_ID})

async def get_current_user(authorization: Optional[str] = Header(None)) -> str:
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="No valid authorization token provided")
    
    try:
        id_token = authorization.split('Bearer ')[1]
        decoded_token = firebase_auth.verify_id_token(id_token)
        return decoded_token['uid']
    except Exception as e:
        print(f"Token verification error: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid authentication token")

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "BoK Pharm FastAPI Backend Running"}

@app.get("/medications", response_model=List[Dict[str, Any]])
async def get_medications():
    try:
        response = supabase.table("medication").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/medications/{medication_id}", response_model=Dict[str, Any])
async def get_medication(medication_id: str):
    try:
        response = supabase.table("medication").select("*").eq("id", medication_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Medication not found")
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/pharmacies", response_model=List[Dict[str, Any]])
async def get_pharmacies():
    try:
        response = supabase.table("pharmacy").select("*").eq("is_active", True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/pharmacies/{pharmacy_id}", response_model=Dict[str, Any])
async def get_pharmacy(pharmacy_id: str):
    try:
        response = supabase.table("pharmacy").select("*").eq("id", pharmacy_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Pharmacy not found")
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class AddToCartRequest(BaseModel):
    medication_id: str
    quantity: int = 1

@app.get("/cart")
async def get_cart(user_id: str = Depends(get_current_user)):
    try:
        cart_response = supabase.table("cart").select("*").eq("user_id", user_id).execute()
        
        if not cart_response.data:
            new_cart = {
                "user_id": user_id,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }
            cart_response = supabase.table("cart").insert(new_cart).execute()
        
        cart = cart_response.data[0]
        
        items_response = supabase.table("cart_item").select("*").eq("cart_id", cart["id"]).execute()
        
        return {
            "cart": cart,
            "items": items_response.data,
            "total": sum(item.get("total_price", 0) for item in items_response.data)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/cart/add")
async def add_to_cart(request: AddToCartRequest, user_id: str = Depends(get_current_user)):
    try:
        cart_response = supabase.table("cart").select("*").eq("user_id", user_id).execute()
        
        if not cart_response.data:
            new_cart = {
                "user_id": user_id,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }
            cart_response = supabase.table("cart").insert(new_cart).execute()
        
        cart = cart_response.data[0]
        
        med_response = supabase.table("medication").select("*").eq("id", request.medication_id).execute()
        if not med_response.data:
            raise HTTPException(status_code=404, detail="Medication not found")
        
        medication = med_response.data[0]
        
        existing_item = supabase.table("cart_item").select("*").eq("cart_id", cart["id"]).eq("medication_id", request.medication_id).execute()
        
        if existing_item.data:
            item = existing_item.data[0]
            new_quantity = item["quantity"] + request.quantity
            new_total = new_quantity * medication.get("price", 0)
            
            updated = supabase.table("cart_item").update({
                "quantity": new_quantity,
                "total_price": new_total
            }).eq("id", item["id"]).execute()
            
            return updated.data[0]
        else:
            new_item = {
                "cart_id": cart["id"],
                "medication_id": medication["id"],
                "medication_name": medication["name"],
                "dosage": medication.get("dosage"),
                "quantity": request.quantity,
                "unit_price": medication.get("price", 0),
                "total_price": request.quantity * medication.get("price", 0)
            }
            
            result = supabase.table("cart_item").insert(new_item).execute()
            return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/cart/items/{item_id}")
async def remove_from_cart(item_id: str, user_id: str = Depends(get_current_user)):
    try:
        item_response = supabase.table("cart_item").select("cart_id").eq("id", item_id).execute()
        if not item_response.data:
            raise HTTPException(status_code=404, detail="Cart item not found")
        
        cart_id = item_response.data[0]["cart_id"]
        cart_response = supabase.table("cart").select("user_id").eq("id", cart_id).execute()
        
        if not cart_response.data or cart_response.data[0]["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Unauthorized")
        
        supabase.table("cart_item").delete().eq("id", item_id).execute()
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class UpdateCartItemRequest(BaseModel):
    quantity: int

@app.patch("/cart/items/{item_id}")
async def update_cart_item(item_id: str, request: UpdateCartItemRequest, user_id: str = Depends(get_current_user)):
    try:
        item_response = supabase.table("cart_item").select("*").eq("id", item_id).execute()
        if not item_response.data:
            raise HTTPException(status_code=404, detail="Cart item not found")
        
        item = item_response.data[0]
        cart_id = item["cart_id"]
        
        cart_response = supabase.table("cart").select("user_id").eq("id", cart_id).execute()
        if not cart_response.data or cart_response.data[0]["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Unauthorized")
        
        new_total = request.quantity * item["unit_price"]
        
        updated = supabase.table("cart_item").update({
            "quantity": request.quantity,
            "total_price": new_total
        }).eq("id", item_id).execute()
        
        return updated.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/google-maps-api-key")
async def get_google_maps_key():
    return {"apiKey": GOOGLE_MAPS_API_KEY}

class SyncUserRequest(BaseModel):
    firebase_uid: str
    email: str
    name: str
    surname: str = ""
    mobile_number: str = ""
    date_of_birth: Optional[str] = None

@app.post("/auth/sync-user")
async def sync_user(request: SyncUserRequest):
    try:
        existing = supabase.table("user").select("*").eq("firebase_uid", request.firebase_uid).execute()
        
        if existing.data:
            return existing.data[0]
        else:
            dob = datetime.fromisoformat(request.date_of_birth) if request.date_of_birth else datetime.utcnow()
            
            new_user = {
                "firebase_uid": request.firebase_uid,
                "email": request.email,
                "name": request.name,
                "surname": request.surname,
                "mobile_number": request.mobile_number,
                "date_of_birth": dob.isoformat(),
                "role": "customer",
                "created_at": datetime.utcnow().isoformat()
            }
            
            response = supabase.table("user").insert(new_user).execute()
            return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/auth/user")
async def get_user(user_id: str = Depends(get_current_user)):
    try:
        response = supabase.table("user").select("*").eq("firebase_uid", user_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="User not found")
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5001))
    uvicorn.run(app, host="0.0.0.0", port=port)
