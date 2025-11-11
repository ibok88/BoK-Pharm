-- BoK Pharm Database Schema for Supabase

-- User table (singular)
CREATE TABLE IF NOT EXISTS user (
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

-- Pharmacy table (singular)
CREATE TABLE IF NOT EXISTS pharmacy (
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

-- Medication table (OTC only, singular)
CREATE TABLE IF NOT EXISTS medication (
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
  FOREIGN KEY (pharmacy_id) REFERENCES pharmacy(id),
  FOREIGN KEY (medication_id) REFERENCES medication(id)
);

-- Order table (singular)
CREATE TABLE IF NOT EXISTS order (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR NOT NULL,
  pharmacy_id VARCHAR NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total DECIMAL(10, 2) NOT NULL,
  delivery_address TEXT NOT NULL,
  payment_method TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (pharmacy_id) REFERENCES pharmacy(id)
);

-- Order item table (singular)
CREATE TABLE IF NOT EXISTS order_item (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_id VARCHAR NOT NULL,
  medication_id VARCHAR NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES order(id),
  FOREIGN KEY (medication_id) REFERENCES medication(id)
);

-- Add foreign key for user.pharmacy_id (after pharmacy table is created)
ALTER TABLE user
ADD CONSTRAINT fk_user_pharmacy
FOREIGN KEY (pharmacy_id) REFERENCES pharmacy(id);
