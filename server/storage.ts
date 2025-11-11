import { 
  users, 
  medications, 
  inventory,
  pharmacies,
  type User, 
  type UpsertUser,
  type Medication,
  type InsertMedication,
  type Inventory,
  type InsertInventory,
  type Pharmacy,
  type InsertPharmacy
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Helper function to convert InsertInventory to database format
function normalizeInventoryData(data: InsertInventory): any {
  return {
    ...data,
    price: typeof data.price === 'number' ? data.price.toString() : data.price,
    originalPrice: data.originalPrice 
      ? (typeof data.originalPrice === 'number' ? data.originalPrice.toString() : data.originalPrice)
      : undefined,
    expiryDate: data.expiryDate instanceof Date ? data.expiryDate : (data.expiryDate ? new Date(data.expiryDate) : undefined),
  };
}

export interface IStorage {
  // User operations - from blueprint:javascript_log_in_with_replit
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  assignUserToPharmacy(userId: string, pharmacyId: string): Promise<User>;
  
  // Medication operations
  getMedications(): Promise<Medication[]>;
  getMedication(id: string): Promise<Medication | undefined>;
  createMedication(medication: InsertMedication): Promise<Medication>;
  
  // Inventory operations
  getInventory(pharmacyId: string): Promise<Inventory[]>;
  getInventoryItem(id: string): Promise<Inventory | undefined>;
  createInventoryItem(item: InsertInventory): Promise<Inventory>;
  updateInventoryItem(id: string, item: Partial<InsertInventory>): Promise<Inventory>;
  deleteInventoryItem(id: string): Promise<void>;
  
  // Pharmacy operations
  getPharmacies(): Promise<Pharmacy[]>;
  getPharmacy(id: string): Promise<Pharmacy | undefined>;
  createPharmacy(pharmacy: InsertPharmacy): Promise<Pharmacy>;
  getDefaultPharmacy(): Promise<Pharmacy | undefined>;
  ensureDefaultPharmacy(): Promise<Pharmacy>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
  
  async assignUserToPharmacy(userId: string, pharmacyId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ pharmacyId, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
  
  // Medication operations
  async getMedications(): Promise<Medication[]> {
    return await db.select().from(medications);
  }
  
  async getMedication(id: string): Promise<Medication | undefined> {
    const [medication] = await db.select().from(medications).where(eq(medications.id, id));
    return medication || undefined;
  }
  
  async createMedication(medicationData: InsertMedication): Promise<Medication> {
    const [medication] = await db
      .insert(medications)
      .values(medicationData)
      .returning();
    return medication;
  }
  
  // Inventory operations
  async getInventory(pharmacyId: string): Promise<Inventory[]> {
    return await db.select().from(inventory).where(eq(inventory.pharmacyId, pharmacyId));
  }
  
  async getInventoryItem(id: string): Promise<Inventory | undefined> {
    const [item] = await db.select().from(inventory).where(eq(inventory.id, id));
    return item || undefined;
  }
  
  async createInventoryItem(itemData: InsertInventory): Promise<Inventory> {
    const normalizedData = normalizeInventoryData(itemData);
    const [item] = await db
      .insert(inventory)
      .values(normalizedData)
      .returning();
    return item;
  }
  
  async updateInventoryItem(id: string, itemData: Partial<InsertInventory>): Promise<Inventory> {
    const normalizedData = normalizeInventoryData(itemData as InsertInventory);
    const [item] = await db
      .update(inventory)
      .set({
        ...normalizedData,
        lastUpdated: new Date(),
      })
      .where(eq(inventory.id, id))
      .returning();
    return item;
  }
  
  async deleteInventoryItem(id: string): Promise<void> {
    await db.delete(inventory).where(eq(inventory.id, id));
  }
  
  // Pharmacy operations
  async getPharmacies(): Promise<Pharmacy[]> {
    return await db.select().from(pharmacies);
  }
  
  async getPharmacy(id: string): Promise<Pharmacy | undefined> {
    const [pharmacy] = await db.select().from(pharmacies).where(eq(pharmacies.id, id));
    return pharmacy || undefined;
  }
  
  async createPharmacy(pharmacyData: InsertPharmacy): Promise<Pharmacy> {
    const [pharmacy] = await db
      .insert(pharmacies)
      .values(pharmacyData)
      .returning();
    return pharmacy;
  }
  
  async getDefaultPharmacy(): Promise<Pharmacy | undefined> {
    const [pharmacy] = await db.select().from(pharmacies).limit(1);
    return pharmacy || undefined;
  }
  
  async ensureDefaultPharmacy(): Promise<Pharmacy> {
    const existing = await this.getDefaultPharmacy();
    if (existing) return existing;
    
    // Create default pharmacy for testing
    return await this.createPharmacy({
      name: "BoK Pharm - Demo Pharmacy",
      address: "123 Ocean View Drive, Coastal City",
      phone: "+1-555-BOKPHARM",
      hours: "24/7",
      isOpen24Hours: true,
      deliveryTime: "15-20 min",
      distance: "0 km",
      latitude: "0",
      longitude: "0",
      deliveryFee: "5.00",
      onboardingStatus: "active",
      rating: "4.9",
    });
  }
}

export const storage = new DatabaseStorage();
