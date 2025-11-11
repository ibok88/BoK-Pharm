#!/bin/bash
cd "$(dirname "$0")"

# Load environment variables
export SUPABASE_URL="${SUPABASE_URL}"
export SUPABASE_SERVICE_KEY="${SUPABASE_SERVICE_KEY}"
export PORT=5001

# Seed the database first
echo "Seeding database..."
python seed_database.py

# Start the Flask server
echo "Starting Python backend on port 5001..."
python app.py
