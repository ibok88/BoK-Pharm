import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()
load_dotenv("../.env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables are required")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

OTC_MEDICATIONS = [
    {
        "name": "Paracetamol",
        "strength": "500mg",
        "manufacturer": "Emzor Pharmaceuticals",
        "category": "Pain Relief",
        "description": "Paracetamol is used to treat mild to moderate pain and to reduce fever",
        "form_factor": "Tablet",
        "requires_prescription": False,
        "is_otc": True
    },
    {
        "name": "Ibuprofen",
        "strength": "400mg",
        "manufacturer": "May & Baker",
        "category": "Pain Relief",
        "description": "Ibuprofen is used to reduce fever and treat pain or inflammation",
        "form_factor": "Tablet",
        "requires_prescription": False,
        "is_otc": True
    },
    {
        "name": "Vitamin C",
        "strength": "1000mg",
        "manufacturer": "HealthGuard",
        "category": "Supplements",
        "description": "Vitamin C supplement for immune system support",
        "form_factor": "Tablet",
        "requires_prescription": False,
        "is_otc": True
    },
    {
        "name": "Aspirin",
        "strength": "300mg",
        "manufacturer": "Bayer",
        "category": "Pain Relief",
        "description": "Aspirin is used for pain relief and to reduce inflammation",
        "form_factor": "Tablet",
        "requires_prescription": False,
        "is_otc": True
    },
    {
        "name": "Loratadine",
        "strength": "10mg",
        "manufacturer": "GlaxoSmithKline",
        "category": "Antihistamine",
        "description": "Loratadine is an antihistamine used to relieve allergy symptoms",
        "form_factor": "Tablet",
        "requires_prescription": False,
        "is_otc": True
    },
    {
        "name": "Omeprazole",
        "strength": "20mg",
        "manufacturer": "AstraZeneca",
        "category": "Gastrointestinal",
        "description": "Omeprazole is used to treat symptoms of gastroesophageal reflux disease",
        "form_factor": "Capsule",
        "requires_prescription": False,
        "is_otc": True
    },
    {
        "name": "Cetirizine",
        "strength": "10mg",
        "manufacturer": "UCB Pharma",
        "category": "Antihistamine",
        "description": "Cetirizine is an antihistamine that reduces allergy symptoms",
        "form_factor": "Tablet",
        "requires_prescription": False,
        "is_otc": True
    },
    {
        "name": "Multivitamin",
        "strength": "Daily",
        "manufacturer": "Centrum",
        "category": "Supplements",
        "description": "Complete multivitamin for daily nutritional support",
        "form_factor": "Tablet",
        "requires_prescription": False,
        "is_otc": True
    }
]

def seed_medications():
    print("Starting medication seeding...")
    
    existing = supabase.table("medications").select("name").execute()
    existing_names = {med["name"] for med in existing.data}
    
    new_medications = [med for med in OTC_MEDICATIONS if med["name"] not in existing_names]
    
    if new_medications:
        print(f"Inserting {len(new_medications)} new medications...")
        response = supabase.table("medications").insert(new_medications).execute()
        print(f"Successfully inserted {len(response.data)} medications")
    else:
        print("All medications already exist in the database")
    
    print("Medication seeding completed!")

if __name__ == "__main__":
    seed_medications()
