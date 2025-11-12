import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import PharmacyCard from "@/components/PharmacyCard";
import MedicationCard from "@/components/MedicationCard";
import BottomNav from "@/components/BottomNav";
import ThemeToggle from "@/components/ThemeToggle";
import { ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@assets/stock_images/modern_pharmacy_inte_1e432251.jpg";
import medicationImage1 from "@assets/generated_images/Medication_product_bottle_39d472bc.png";
import medicationImage2 from "@assets/generated_images/Medication_blister_pack_8ebe3161.png";

function BoKPharmLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center leading-none ${className}`}>
      <span className="font-bold text-2xl tracking-tight">BoK</span>
      <span className="font-semibold text-xs -mt-1">Pharm</span>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [cartCount, setCartCount] = useState(0);
  const { toast } = useToast();

  const handleAddToCart = async (id: string, quantity: number) => {
    const medication = popularMedications.find(m => m.id === id);
    if (!medication) return;

    try {
      setCartCount(prev => prev + quantity);
      toast({
        title: "Added to cart",
        description: `${medication.name} (${quantity}x) added to cart`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const popularMedications = [
    {
      id: "1",
      name: "Paracetamol",
      strength: "500mg",
      manufacturer: "Emzor Pharmaceuticals",
      price: 1200,
      originalPrice: 1500,
      image: medicationImage1,
    },
    {
      id: "2",
      name: "Amoxicillin",
      strength: "250mg",
      manufacturer: "GSK Nigeria",
      price: 2500,
      image: medicationImage2,
    },
    {
      id: "3",
      name: "Ibuprofen",
      strength: "400mg",
      manufacturer: "May & Baker",
      price: 1800,
      image: medicationImage1,
    },
    {
      id: "4",
      name: "Vitamin C",
      strength: "1000mg",
      manufacturer: "HealthGuard",
      price: 3200,
      originalPrice: 4000,
      image: medicationImage2,
    },
  ];

  const nearbyPharmacies = [
    {
      name: "HealthPlus Pharmacy",
      distance: "1.2 km",
      rating: 4.8,
      deliveryTime: "15-20 min",
      phone: "+234 803 456 7890",
      availability: "in-stock" as const,
      address: "23 Admiralty Way, Lekki Phase 1",
    },
    {
      name: "MedExpress",
      distance: "2.5 km",
      rating: 4.5,
      deliveryTime: "25-30 min",
      phone: "+234 810 234 5678",
      availability: "call-to-confirm" as const,
      address: "15 Awolowo Road, Ikoyi",
    },
    {
      name: "Care Pharmacy",
      distance: "3.8 km",
      rating: 4.2,
      deliveryTime: "35-40 min",
      phone: "+234 901 876 5432",
      availability: "in-stock" as const,
      address: "8 Herbert Macaulay Street, Yaba",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              data-testid="button-menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2">
              <BoKPharmLogo />
            </div>

            <div className="flex-1 max-w-2xl hidden md:block">
              <SearchBar />
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                data-testid="button-cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          <div className="mt-3 md:hidden">
            <SearchBar />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        <section className="relative rounded-lg overflow-hidden h-64 md:h-80 bg-white dark:bg-background">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/85 to-white/70 dark:from-black/70 dark:to-black/40" />
          </div>
          <div className="relative h-full flex flex-col justify-center px-6 md:px-12">
            <div className="mb-4">
              <Badge className="bg-primary text-primary-foreground border-0">
                24 Hours Supply
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground dark:text-white">
              Your Pharmacies brought to you...
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground dark:text-white/90 mb-4">
              Quality medications delivered 24/7
            </p>
            <div className="max-w-md">
              <SearchBar placeholder="Search for medications..." />
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Popular Medications</h2>
            <Button
              variant="ghost"
              size="sm"
              data-testid="button-view-all-medications"
            >
              View All
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {popularMedications.map((med) => (
              <MedicationCard key={med.id} {...med} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Nearby Pharmacies</h2>
            <Button
              variant="ghost"
              size="sm"
              data-testid="button-view-all-pharmacies"
            >
              View All
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {nearbyPharmacies.map((pharmacy) => (
              <PharmacyCard key={pharmacy.name} {...pharmacy} />
            ))}
          </div>
        </section>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
