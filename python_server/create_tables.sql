-- BoK Pharm Database Schema for Supabase

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

-- Add foreign key for users.pharmacy_id (after pharmacies table is created)
ALTER TABLE users
ADD CONSTRAINT fk_users_pharmacy
FOREIGN KEY (pharmacy_id) REFERENCES pharmacies(id);
