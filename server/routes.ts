import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertMedicationSchema, insertInventorySchema, insertPharmacySchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware - from blueprint:javascript_log_in_with_replit
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  // Pharmacy assignment route - create default pharmacy and assign user
  app.post('/api/auth/setup-pharmacy', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (user.pharmacyId) {
        return res.status(400).json({ message: "User already associated with a pharmacy" });
      }
      
      // Ensure default pharmacy exists and assign user to it
      const pharmacy = await storage.ensureDefaultPharmacy();
      const updatedUser = await storage.assignUserToPharmacy(userId, pharmacy.id);
      
      res.json({ user: updatedUser, pharmacy });
    } catch (error) {
      console.error("Error setting up pharmacy:", error);
      res.status(500).json({ message: "Failed to setup pharmacy" });
    }
  });
  
  // Manual pharmacy assignment route
  app.post('/api/auth/assign-pharmacy', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { pharmacyId } = req.body;
      
      if (!pharmacyId) {
        return res.status(400).json({ message: "Pharmacy ID is required" });
      }
      
      const user = await storage.assignUserToPharmacy(userId, pharmacyId);
      res.json(user);
    } catch (error) {
      console.error("Error assigning pharmacy:", error);
      res.status(500).json({ message: "Failed to assign pharmacy" });
    }
  });

  // Medication routes
  app.get('/api/medications', async (req, res) => {
    try {
      const medications = await storage.getMedications();
      res.json(medications);
    } catch (error) {
      console.error("Error fetching medications:", error);
      res.status(500).json({ message: "Failed to fetch medications" });
    }
  });

  app.post('/api/medications', isAuthenticated, async (req, res) => {
    try {
      const result = insertMedicationSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: fromZodError(result.error).message 
        });
      }
      
      const medication = await storage.createMedication(result.data);
      res.status(201).json(medication);
    } catch (error) {
      console.error("Error creating medication:", error);
      res.status(500).json({ message: "Failed to create medication" });
    }
  });

  // Inventory routes
  app.get('/api/inventory', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || !user.pharmacyId) {
        // Return empty array with a flag indicating setup is needed
        return res.json({ items: [], needsSetup: true });
      }
      
      const inventory = await storage.getInventory(user.pharmacyId);
      res.json({ items: inventory, needsSetup: false });
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  app.post('/api/inventory', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || !user.pharmacyId) {
        return res.status(400).json({ 
          message: "Please set up your pharmacy first",
          needsSetup: true
        });
      }
      
      const result = insertInventorySchema.safeParse({
        ...req.body,
        pharmacyId: user.pharmacyId,
      });
      
      if (!result.success) {
        return res.status(400).json({ 
          message: fromZodError(result.error).message 
        });
      }
      
      const item = await storage.createInventoryItem(result.data);
      res.status(201).json(item);
    } catch (error) {
      console.error("Error creating inventory item:", error);
      res.status(500).json({ message: "Failed to create inventory item" });
    }
  });

  app.delete('/api/inventory/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || !user.pharmacyId) {
        return res.status(400).json({ message: "User not associated with a pharmacy" });
      }
      
      const item = await storage.getInventoryItem(req.params.id);
      if (!item || item.pharmacyId !== user.pharmacyId) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      
      await storage.deleteInventoryItem(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      res.status(500).json({ message: "Failed to delete inventory item" });
    }
  });

  // Pharmacy routes
  app.get('/api/pharmacies', async (req, res) => {
    try {
      const pharmacies = await storage.getPharmacies();
      res.json(pharmacies);
    } catch (error) {
      console.error("Error fetching pharmacies:", error);
      res.status(500).json({ message: "Failed to fetch pharmacies" });
    }
  });
  
  app.post('/api/pharmacies', isAuthenticated, async (req, res) => {
    try {
      const result = insertPharmacySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: fromZodError(result.error).message 
        });
      }
      
      const pharmacy = await storage.createPharmacy(result.data);
      res.status(201).json(pharmacy);
    } catch (error) {
      console.error("Error creating pharmacy:", error);
      res.status(500).json({ message: "Failed to create pharmacy" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
