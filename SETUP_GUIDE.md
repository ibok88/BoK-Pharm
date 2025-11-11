# BoK Pharm - Complete Setup Guide

## ✅ Backend Migration Complete

The application has been successfully migrated to:
- **FastAPI** (Python backend on port 5001)
- **Firebase Authentication** (Google & Facebook SSO)
- **Supabase PostgreSQL** (database)
- **Google Maps Places API** (address autocomplete)

## 🚀 Current Status

### ✅ Completed Components

1. **FastAPI Backend** - Running on port 5001
   - Health check: `/api/health`
   - Medications: `/api/medications` (GET, GET by ID)
   - Pharmacies: `/api/pharmacies` (GET, GET by ID)
   - Cart: `/api/cart` (GET, POST, PATCH, DELETE)
   - Auth: `/api/auth/user`, `/api/auth/sync-user`
   - Google Maps API Key: `/api/google-maps-api-key`

2. **Firebase Authentication**
   - Google Sign-In configured
   - Facebook Sign-In configured
   - Token verification on all protected endpoints

3. **Google Places API**
   - Address autocomplete component created
   - Geocoding support for lat/lng coordinates
   - API key securely stored in environment

4. **Cart Functionality**
   - Add items to cart
   - Update cart item quantity
   - Remove items from cart
   - Calculate totals automatically

### 📋 Database Setup Required

Your Supabase database needs the following tables (based on your SQLModel schema):

#### 1. User Table
```sql
CREATE TABLE IF NOT EXISTS "user" (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  firebase_uid VARCHAR NOT NULL UNIQUE,
  name VARCHAR NOT NULL,
  surname VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  mobile_number VARCHAR NOT NULL,
  date_of_birth TIMESTAMP NOT NULL,
  role VARCHAR NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_firebase_uid ON "user"(firebase_uid);
CREATE INDEX idx_user_email ON "user"(email);
```

#### 2. Pharmacy Table
```sql
CREATE TABLE IF NOT EXISTS pharmacy (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name VARCHAR NOT NULL,
  address VARCHAR NOT NULL,
  city VARCHAR,
  state VARCHAR,
  country VARCHAR,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  email VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  opening_hours VARCHAR,
  logo_url VARCHAR,
  license_number VARCHAR NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_pharmacy_active ON pharmacy(is_active);
CREATE INDEX idx_pharmacy_city ON pharmacy(city);
```

#### 3. Medication Table
```sql
CREATE TABLE IF NOT EXISTS medication (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name VARCHAR NOT NULL,
  description TEXT,
  dosage VARCHAR,
  manufacturer VARCHAR,
  category VARCHAR,
  is_otc BOOLEAN NOT NULL DEFAULT true,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
  image_url VARCHAR,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_medication_category ON medication(category);
CREATE INDEX idx_medication_is_otc ON medication(is_otc);
```

#### 4. Order Table
```sql
CREATE TABLE IF NOT EXISTS "order" (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR NOT NULL,
  pharmacy_id VARCHAR NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'created',
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
  delivery_address VARCHAR NOT NULL,
  delivery_city VARCHAR,
  delivery_state VARCHAR,
  delivery_latitude DECIMAL(10, 8),
  delivery_longitude DECIMAL(11, 8),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_order_user_id ON "order"(user_id);
CREATE INDEX idx_order_pharmacy_id ON "order"(pharmacy_id);
CREATE INDEX idx_order_status ON "order"(status);
```

#### 5. Order Item Table
```sql
CREATE TABLE IF NOT EXISTS order_item (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_id VARCHAR NOT NULL,
  medication_id VARCHAR NOT NULL,
  medication_name VARCHAR NOT NULL,
  dosage VARCHAR,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
  total_price DECIMAL(10, 2) NOT NULL DEFAULT 0.0
);

CREATE INDEX idx_order_item_order_id ON order_item(order_id);
CREATE INDEX idx_order_item_medication_id ON order_item(medication_id);
```

#### 6. Cart Tables (for shopping cart functionality)
```sql
CREATE TABLE IF NOT EXISTS cart (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cart_item (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  cart_id VARCHAR NOT NULL,
  medication_id VARCHAR NOT NULL,
  medication_name VARCHAR NOT NULL,
  dosage VARCHAR,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
  total_price DECIMAL(10, 2) NOT NULL DEFAULT 0.0
);

CREATE INDEX idx_cart_user_id ON cart(user_id);
CREATE INDEX idx_cart_item_cart_id ON cart_item(cart_id);
CREATE INDEX idx_cart_item_medication_id ON cart_item(medication_id);
```

### 🧪 Adding Sample Data

#### Add Sample Pharmacies
```sql
INSERT INTO pharmacy (name, address, city, state, country, email, phone, license_number, is_active, is_verified) VALUES
('Ocean Pharmacy', '123 Beach Ave', 'Los Angeles', 'CA', 'USA', 'ocean@pharmacy.com', '+1-555-0100', 'LIC-001', true, true),
('City Pharmacy', '456 Main St', 'New York', 'NY', 'USA', 'city@pharmacy.com', '+1-555-0200', 'LIC-002', true, true),
('Green Pharmacy', '789 Park Blvd', 'Miami', 'FL', 'USA', 'green@pharmacy.com', '+1-555-0300', 'LIC-003', true, true);
```

#### Add Sample Medications (OTC only)
```sql
INSERT INTO medication (name, description, dosage, manufacturer, category, is_otc, price) VALUES
('Tylenol', 'Pain reliever and fever reducer', '500mg', 'Johnson & Johnson', 'Pain Relief', true, 12.99),
('Advil', 'Ibuprofen pain relief', '200mg', 'Pfizer', 'Pain Relief', true, 14.99),
('Claritin', 'Allergy relief', '10mg', 'Bayer', 'Allergy', true, 18.99),
('Tums', 'Antacid for heartburn relief', '750mg', 'GlaxoSmithKline', 'Digestive Health', true, 8.99),
('Benadryl', 'Allergy and cold relief', '25mg', 'Johnson & Johnson', 'Allergy', true, 11.99),
('Zyrtec', 'Allergy relief', '10mg', 'McNeil', 'Allergy', true, 19.99),
('Mucinex', 'Expectorant for chest congestion', '600mg', 'Reckitt Benckiser', 'Cold & Flu', true, 16.99),
('NyQuil', 'Nighttime cold and flu relief', '650mg', 'Procter & Gamble', 'Cold & Flu', true, 13.99);
```

## 🔧 Environment Configuration

All required environment variables are configured in Replit Secrets:
- ✅ `VITE_FIREBASE_API_KEY`
- ✅ `VITE_FIREBASE_APP_ID`
- ✅ `VITE_FIREBASE_PROJECT_ID`
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_SERVICE_KEY`
- ✅ `GOOGLE_MAPS_API_KEY`

## 🧪 Testing the Backend

### 1. Test Health Endpoint
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"ok","message":"BoK Pharm FastAPI Backend Running"}
```

### 2. Test Medications Endpoint
```bash
curl http://localhost:5000/api/medications
```

Should return array of medications from your Supabase database.

### 3. Test Pharmacies Endpoint
```bash
curl http://localhost:5000/api/pharmacies
```

Should return array of active pharmacies.

### 4. Test Google Maps API Key
```bash
curl http://localhost:5000/api/google-maps-api-key
```

Should return the API key for frontend use.

## 🔐 Firebase Configuration

### Required Firebase Settings

1. **Enable Google Sign-In**:
   - Go to Firebase Console → Authentication → Sign-in method
   - Enable "Google" provider
   - Save

2. **Enable Facebook Sign-In**:
   - Go to Firebase Console → Authentication → Sign-in method
   - Enable "Facebook" provider
   - Add your Facebook App ID and App Secret
   - Save

3. **Add Authorized Domains**:
   - Go to Firebase Console → Authentication → Settings → Authorized domains
   - Add your Replit domain (e.g., `your-repl.replit.app`)
   - Save

## 📱 Frontend Features

### Address Autocomplete
The `AddressAutocomplete` component provides Google Places-powered address suggestions:

```tsx
import { AddressAutocomplete } from "@/components/AddressAutocomplete";

function MyComponent() {
  const [address, setAddress] = useState("");
  
  return (
    <AddressAutocomplete
      value={address}
      onChange={(addr, details) => {
        setAddress(addr);
        // details contains lat, lng, address_components, etc.
      }}
      placeholder="Enter delivery address"
    />
  );
}
```

### Cart API Endpoints

**Get Cart**
```
GET /api/cart
Headers: Authorization: Bearer <firebase-token>
Response: { cart: {...}, items: [...], total: 0 }
```

**Add to Cart**
```
POST /api/cart/add
Headers: Authorization: Bearer <firebase-token>
Body: { medication_id: "...", quantity: 1 }
```

**Update Cart Item**
```
PATCH /api/cart/items/{item_id}
Headers: Authorization: Bearer <firebase-token>
Body: { quantity: 2 }
```

**Remove from Cart**
```
DELETE /api/cart/items/{item_id}
Headers: Authorization: Bearer <firebase-token>
```

## 🎯 Next Steps

1. **Setup Supabase Tables** - Run the SQL commands above in your Supabase SQL Editor
2. **Add Sample Data** - Insert sample pharmacies and medications for testing
3. **Test Authentication** - Try signing in with Google/Facebook
4. **Test Cart** - Add medications to cart, update quantities, remove items
5. **Test Address Autocomplete** - Enter delivery address and see suggestions

## 📝 Architecture Overview

```
Frontend (React + Vite) - Port 5000
    ↓
Node.js Proxy Server - Port 5000
    ↓ (/api/* → Port 5001)
FastAPI Backend - Port 5001
    ↓
Supabase PostgreSQL Database
```

**Authentication Flow:**
1. User signs in with Google/Facebook via Firebase
2. Frontend receives Firebase ID token
3. Token sent in `Authorization: Bearer <token>` header
4. FastAPI verifies token using Firebase Admin SDK
5. User data synced to Supabase database

**Cart Flow:**
1. User browses medications
2. Clicks "Add to Cart"
3. Frontend calls `/api/cart/add` with Firebase token
4. Backend creates/updates cart in Supabase
5. User can update quantities or remove items
6. Cart total calculated automatically

## 🔍 Troubleshooting

### Backend not starting
- Check logs: `refresh_all_logs` tool
- Verify Python dependencies installed
- Ensure Supabase credentials are correct

### Authentication errors
- Verify Firebase domain is authorized
- Check Firebase token is being sent in headers
- Ensure Firebase Admin SDK initialized correctly

### Database errors
- Verify Supabase URL and service key are correct
- Check tables exist in Supabase
- Ensure table names match (singular: user, pharmacy, medication, order, order_item)

### Cart not working
- Verify user is authenticated
- Check cart tables exist in Supabase
- Ensure medications exist in database to add to cart

## 📞 Support

For issues:
1. Check the logs using `refresh_all_logs`
2. Test backend endpoints directly with curl
3. Verify database tables and data exist in Supabase
4. Check Firebase console for authentication errors
