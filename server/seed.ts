import { db } from "./db";
import { medications, pharmacies } from "@shared/schema";

const commonMedications = [
  {
    name: "Paracetamol",
    strength: "500mg",
    manufacturer: "Emzor Pharmaceuticals",
    category: "Pain Relief",
    formFactor: "Tablet",
    requiresPrescription: false,
  },
  {
    name: "Ibuprofen",
    strength: "400mg",
    manufacturer: "May & Baker",
    category: "Pain Relief",
    formFactor: "Tablet",
    requiresPrescription: false,
  },
  {
    name: "Amoxicillin",
    strength: "250mg",
    manufacturer: "GSK Nigeria",
    category: "Antibiotic",
    formFactor: "Capsule",
    requiresPrescription: true,
  },
  {
    name: "Vitamin C",
    strength: "1000mg",
    manufacturer: "HealthGuard",
    category: "Supplement",
    formFactor: "Tablet",
    requiresPrescription: false,
  },
  {
    name: "Cetirizine",
    strength: "10mg",
    manufacturer: "Pharma Plus",
    category: "Allergy",
    formFactor: "Tablet",
    requiresPrescription: false,
  },
  {
    name: "Omeprazole",
    strength: "20mg",
    manufacturer: "MedCare",
    category: "Digestive",
    formFactor: "Capsule",
    requiresPrescription: false,
  },
  {
    name: "Metformin",
    strength: "500mg",
    manufacturer: "Diabetes Solutions",
    category: "Diabetes",
    formFactor: "Tablet",
    requiresPrescription: true,
  },
  {
    name: "Aspirin",
    strength: "75mg",
    manufacturer: "CardioHealth",
    category: "Cardiovascular",
    formFactor: "Tablet",
    requiresPrescription: false,
  },
];

const samplePharmacies = [
  {
    name: "Ocean View Pharmacy",
    address: "123 Beach Road, Coastal City",
    phone: "+1-555-0100",
    hours: "24/7",
    isOpen24Hours: true,
    deliveryTime: "15-20 min",
    distance: "0.5 km",
    latitude: "37.7749",
    longitude: "-122.4194",
    deliveryFee: "5.00",
    onboardingStatus: "active",
    rating: "4.8",
  },
  {
    name: "HealthPlus Pharmacy",
    address: "456 Main Street, Downtown",
    phone: "+1-555-0200",
    hours: "24/7",
    isOpen24Hours: true,
    deliveryTime: "20-25 min",
    distance: "1.2 km",
    latitude: "37.7849",
    longitude: "-122.4294",
    deliveryFee: "3.00",
    onboardingStatus: "active",
    rating: "4.6",
  },
];

async function seed() {
  try {
    console.log("Seeding database...");

    // Check if medications already exist
    const existingMeds = await db.select().from(medications);
    if (existingMeds.length === 0) {
      console.log("Adding common medications...");
      await db.insert(medications).values(commonMedications);
      console.log(`Added ${commonMedications.length} medications`);
    } else {
      console.log("Medications already exist, skipping...");
    }

    // Check if pharmacies already exist
    const existingPharmacies = await db.select().from(pharmacies);
    if (existingPharmacies.length === 0) {
      console.log("Adding sample pharmacies...");
      await db.insert(pharmacies).values(samplePharmacies);
      console.log(`Added ${samplePharmacies.length} pharmacies`);
    } else {
      console.log("Pharmacies already exist, skipping...");
    }

    console.log("Seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
