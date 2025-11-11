import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: text("role").notNull().default("customer"),
  pharmacyId: varchar("pharmacy_id").references(() => pharmacies.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const pharmacies = pgTable("pharmacies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  hours: text("hours").notNull().default("24/7"),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("4.5"),
  isOpen24Hours: boolean("is_open_24_hours").notNull().default(true),
  deliveryTime: text("delivery_time").default("15-20 min"),
  distance: text("distance"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  deliveryFee: decimal("delivery_fee", { precision: 10, scale: 2 }).default("0"),
  onboardingStatus: text("onboarding_status").notNull().default("pending"),
});

export const insertPharmacySchema = createInsertSchema(pharmacies).omit({
  id: true,
});

export type InsertPharmacy = z.infer<typeof insertPharmacySchema>;
export type Pharmacy = typeof pharmacies.$inferSelect;

export const medications = pgTable("medications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  strength: text("strength").notNull(),
  manufacturer: text("manufacturer").notNull(),
  category: text("category"),
  description: text("description"),
  formFactor: text("form_factor"),
  requiresPrescription: boolean("requires_prescription").notNull().default(false),
  isOTC: boolean("is_otc").notNull().default(true),
});

export const insertMedicationSchema = createInsertSchema(medications).omit({
  id: true,
}).refine((data) => data.isOTC === true, {
  message: "Only over-the-counter (OTC) medications are allowed. Prescription medications cannot be added.",
  path: ["isOTC"],
});

export type InsertMedication = z.infer<typeof insertMedicationSchema>;
export type Medication = typeof medications.$inferSelect;

export const inventory = pgTable("inventory", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pharmacyId: varchar("pharmacy_id").notNull().references(() => pharmacies.id),
  medicationId: varchar("medication_id").notNull().references(() => medications.id),
  quantity: integer("quantity").notNull().default(0),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  inStock: boolean("in_stock").notNull().default(true),
  expiryDate: timestamp("expiry_date"),
  batchNumber: text("batch_number"),
  lastUpdated: timestamp("last_updated").notNull().default(sql`now()`),
});

export const insertInventorySchema = createInsertSchema(inventory).omit({
  id: true,
  lastUpdated: true,
}).extend({
  price: z.coerce.number().or(z.string()),
  originalPrice: z.coerce.number().or(z.string()).optional(),
  expiryDate: z.string().optional().or(z.date().optional()),
});

export type InsertInventory = z.infer<typeof insertInventorySchema>;
export type Inventory = typeof inventory.$inferSelect;

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  pharmacyId: varchar("pharmacy_id").notNull().references(() => pharmacies.id),
  status: text("status").notNull().default("pending"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  paymentMethod: text("payment_method"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id),
  medicationId: varchar("medication_id").notNull().references(() => medications.id),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
