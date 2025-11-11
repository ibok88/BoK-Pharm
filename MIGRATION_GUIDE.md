# BoK Pharm - Migration to Firebase Auth + Supabase + Python Backend

## ✅ What's Been Completed

### 1. **Home Page Updates**
- ✅ Changed hero text to "Your Pharmacy by the Ocean"
- ✅ Updated background to white with well-lit pharmacy image
- ✅ Maintained BoK Pharm branding (Uber Eats style stacked logo)

### 2. **OTC-Only Medication Validation**
- ✅ Added `isOTC` field to medication schema
- ✅ Enforced OTC-only validation in schema with Zod
- ✅ All seeded medications are verified OTC medications

### 3. **Firebase Authentication**
- ✅ Set up Firebase Auth with your credentials
- ✅ Configured Google Sign-In provider
- ✅ Configured Facebook Sign-In provider
- ✅ Created `useFirebaseAuth` hook for React
- ✅ Updated Landing page with social login buttons

### 4. **Python Backend (Flask)**
- ✅ Created Flask server on port 5001
- ✅ All API routes implemented:
  - `/api/health` - Health check
  - `/api/medications` - Get/Create OTC medications
  - `/api/pharmacies` - Get/Create pharmacies
  - `/api/inventory` - Manage inventory (CRUD)
  - `/api/auth/user` - Get current user
  - `/api/auth/sync-user` - Sync Firebase user to Supabase
  - `/api/auth/setup-pharmacy` - Set up pharmacy for user

### 5. **Supabase Integration**
- ✅ Configured Supabase client in Python
- ✅ Created database schema (SQL ready to run)
- ✅ Seed script ready with 8 OTC medications

### 6. **Architecture**
- ✅ Node.js proxy server (port 5000) forwards `/api` to Python backend
- ✅ Vite serves React frontend
- ✅ Python Flask backend handles all business logic
- ✅ Firebase handles authentication
- ✅ Supabase stores all data

## 🔧 Setup Required

### Step 1: Create Supabase Tables

1. Go to your Supabase project: https://supabase.com/dashboard/project/rpjsrnptvphtabpyyxtf
2. Click "SQL Editor" in the left sidebar
3. Copy and run this SQL:

\`\`\`sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email VARCHAR UNIQUE,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  role TEXT NOT NULL DEFAULT 'customer',
  pharmacy_id VARCHAR,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Pharmacies table
CREATE TABLE IF NOT EXISTS pharmacies (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  hours TEXT NOT NULL DEFAULT '24/7',
  rating DECIMAL(2, 1) DEFAULT 4.5,
  is_open_24_hours BOOLEAN NOT NULL DEFAULT true,
  delivery_time TEXT DEFAULT '15-20 min',
  distance TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  onboarding_status TEXT NOT NULL DEFAULT 'pending'
);

-- Medications table (OTC only)
CREATE TABLE IF NOT EXISTS medications (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  strength TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  category TEXT,
  description TEXT,
  form_factor TEXT,
  requires_prescription BOOLEAN NOT NULL DEFAULT false,
  is_otc BOOLEAN NOT NULL DEFAULT true
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  pharmacy_id VARCHAR NOT NULL,
  medication_id VARCHAR NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  in_stock BOOLEAN NOT NULL DEFAULT true,
  expiry_date TIMESTAMP,
  batch_number TEXT,
  last_updated TIMESTAMP NOT NULL DEFAULT now(),
  FOREIGN KEY (pharmacy_id) REFERENCES pharmacies(id),
  FOREIGN KEY (medication_id) REFERENCES medications(id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR NOT NULL,
  pharmacy_id VARCHAR NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total DECIMAL(10, 2) NOT NULL,
  delivery_address TEXT NOT NULL,
  payment_method TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (pharmacy_id) REFERENCES pharmacies(id)
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_id VARCHAR NOT NULL,
  medication_id VARCHAR NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (medication_id) REFERENCES medications(id)
);

-- Add foreign key for users.pharmacy_id
ALTER TABLE users
ADD CONSTRAINT fk_users_pharmacy
FOREIGN KEY (pharmacy_id) REFERENCES pharmacies(id);
\`\`\`

4. Click "Run" to create all tables

### Step 2: Seed the Database

Run this command in the Shell:
\`\`\`bash
cd python_server && python seed_database.py
\`\`\`

This will add 8 OTC medications to your database.

### Step 3: Configure Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create one)
3. Enable **Google Sign-In**:
   - Go to Authentication → Sign-in method
   - Click "Google" → Enable
   - Save
4. Enable **Facebook Sign-In**:
   - Go to Authentication → Sign-in method
   - Click "Facebook" → Enable
   - Follow instructions to get Facebook App ID and Secret
   - Save
5. Add Authorized Domains:
   - In Authentication → Settings → Authorized domains
   - Add your Repl's domain (e.g., `your-repl-name.replit.app`)

## 🚀 How to Use

### For Customers:
1. Visit the landing page
2. Click "Continue with Google" or "Continue with Facebook"
3. Sign in with your account
4. Browse medications and pharmacies
5. Place orders

### For Pharmacy Owners:
1. Sign in with Google/Facebook
2. Navigate to `/pharmacy/inventory`
3. Click "Set Up Pharmacy" (first time only)
4. Add inventory items:
   - Select medication from catalog
   - Set quantity and price
   - Add expiry date and batch number
5. Manage your inventory

## 📁 New File Structure

\`\`\`
.
├── python_server/          # Python Flask backend
│   ├── app.py             # Main Flask application
│   ├── seed_database.py   # Database seeding script
│   ├── create_tables.sql  # SQL schema
│   └── init_database.py   # Database initialization helper
├── client/                # React frontend
│   ├── src/
│   │   ├── lib/
│   │   │   ├── firebase.ts        # Firebase config
│   │   │   └── queryClient.ts     # Updated for Firebase auth
│   │   ├── hooks/
│   │   │   └── useFirebaseAuth.ts # Firebase auth hook
│   │   └── pages/
│   │       ├── Landing.tsx        # Updated with social login
│   │       ├── Home.tsx           # Updated hero section
│   │       └── InventoryOnboarding.tsx  # Pharmacy inventory management
├── server/                # Node.js proxy server
│   └── index.ts          # Proxies /api to Python backend
└── shared/
    └── schema.ts         # Updated with OTC validation
\`\`\`

## 🔐 Environment Variables

All secrets are configured in Replit Secrets:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_PROJECT_ID`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`

## 🧪 Testing the Application

1. The workflow "Start application" runs both:
   - Python backend (port 5001)
   - Node.js proxy + Vite frontend (port 5000)

2. Test authentication:
   - Visit the landing page
   - Click "Continue with Google"
   - Should redirect to Google sign-in
   - After sign-in, should land on Home page

3. Test pharmacy inventory:
   - Navigate to `/pharmacy/inventory`
   - Click "Set Up Pharmacy"
   - Try adding an inventory item

## 📝 Notes

- **OTC Only**: All medications must be over-the-counter (OTC). Prescription medications cannot be added.
- **Firebase Auth**: Users are synced to Supabase when they first sign in.
- **Pharmacy Setup**: Required before adding inventory items.
- **Development Mode**: Python Flask runs in debug mode (disable for production).

## 🎯 Next Steps

1. Run the SQL in Supabase to create tables
2. Seed the database with medications
3. Test the complete flow: Sign in → Set up pharmacy → Add inventory
4. Customize pharmacy details (name, address, hours)
5. Add more OTC medications as needed
