import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()
load_dotenv("../.env")

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://rpjsrnptvphtabpyyxtf.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")

if not SUPABASE_KEY:
    print("Error: SUPABASE_SERVICE_KEY is required")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Read SQL file
with open('create_tables.sql', 'r') as f:
    sql_content = f.read()

print("Creating database schema in Supabase...")
print("Please manually run the SQL in your Supabase SQL Editor:")
print("\n" + "="*80)
print(sql_content)
print("="*80 + "\n")

print("""
INSTRUCTIONS:
1. Go to your Supabase project: https://supabase.com/dashboard/project/rpjsrnptvphtabpyyxtf
2. Navigate to the SQL Editor (left sidebar)
3. Copy the SQL above and paste it into the SQL Editor
4. Click "Run" to create all tables
5. Once complete, run: python seed_database.py

This will create all necessary tables for BoK Pharm (OTC pharmacy marketplace).
""")
