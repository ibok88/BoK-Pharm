-- Cart tables for BoK Pharm

CREATE TABLE IF NOT EXISTS carts (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  cart_id VARCHAR NOT NULL,
  medication_id VARCHAR NOT NULL,
  medication_name TEXT NOT NULL,
  dosage TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
  total_price DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
  FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  FOREIGN KEY (medication_id) REFERENCES medications(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_medication_id ON cart_items(medication_id);
