import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "@/components/ThemeToggle";
import { Pill, Clock, MapPin, Truck } from "lucide-react";
import heroImage from '@assets/stock_images/pharmacy_building_by_f55d6a17.jpg';

function BoKPharmLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center leading-none ${className}`}>
      <span className="font-bold text-2xl tracking-tight">BoK</span>
      <span className="font-semibold text-xs -mt-1">Pharm</span>
    </div>
  );
}

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BoKPharmLogo />
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button onClick={handleLogin} data-testid="button-login">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <section className="relative rounded-lg overflow-hidden h-96 md:h-[500px] mb-12">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
          </div>
          <div className="relative h-full flex flex-col justify-center items-center text-center px-6 text-white">
            <div className="mb-4">
              <BoKPharmLogo className="text-white mb-4 text-4xl" />
              <Badge className="bg-primary text-primary-foreground border-0 mb-6">24 Hours Supply</Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Your Pharmacy by the Ocean
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl">
              Quality medications delivered to your doorstep, anytime, anywhere
            </p>
            <Button 
              size="lg" 
              onClick={handleLogin}
              className="bg-white text-primary hover:bg-white/90"
              data-testid="button-get-started"
            >
              Get Started
            </Button>
          </div>
        </section>

        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Why Choose BoK Pharm?</h2>
            <p className="text-muted-foreground text-lg">Your health, our priority</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>24/7 Service</CardTitle>
                <CardDescription>
                  Round-the-clock availability for all your medication needs
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Nearby Pharmacies</CardTitle>
                <CardDescription>
                  Find trusted pharmacies in your local area
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Fast Delivery</CardTitle>
                <CardDescription>
                  Get your medications delivered in as fast as 15 minutes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Pill className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Quality Assured</CardTitle>
                <CardDescription>
                  All medications from licensed and verified pharmacies
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="text-center py-16 bg-primary/5 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Sign in now to access quality medications from trusted pharmacies near you
          </p>
          <Button size="lg" onClick={handleLogin} data-testid="button-sign-in-cta">
            Sign In with Google
          </Button>
        </section>
      </main>

      <footer className="border-t mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 BoK Pharm. Quality healthcare delivered.</p>
        </div>
      </footer>
    </div>
  );
}
