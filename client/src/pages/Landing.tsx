import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import MedicationSearchBar from "@/components/MedicationSearchBar";
import { Menu, ShoppingCart, MapPin, Clock, Truck, Heart, User } from "lucide-react";
import { SiFacebook } from "react-icons/si";
import { FcGoogle } from "react-icons/fc";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useToast } from "@/hooks/use-toast";

function BoKPharmLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center leading-none ${className}`}>
      <span className="font-bold text-xl tracking-tight">BoK</span>
      <span className="font-semibold text-[10px] -mt-0.5">Pharm</span>
    </div>
  );
}

interface Medication {
  id: string;
  name: string;
  category: string;
  brand?: string;
  generic?: string;
  dosage?: string;
  price: number;
  description?: string;
}

export default function Landing() {
  const { signInWithGoogle, signInWithFacebook, signInWithEmail, signUpWithEmail } = useFirebaseAuth();
  const { toast } = useToast();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);

  const handleAddressSelect = (address: string, place?: any) => {
    setDeliveryAddress(address);
    if (place?.geometry?.location) {
      setDeliveryLocation({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
      toast({
        title: "Delivery address set",
        description: address,
      });
    }
  };

  const handleMedicationSelect = (medication: Medication) => {
    setSelectedMedication(medication);
    setCartCount(prev => prev + 1);
    toast({
      title: "Added to cart",
      description: medication.name,
    });
  };

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
      setShowAuthDialog(false);
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithFacebook();
      setShowAuthDialog(false);
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Failed to sign in with Facebook",
        variant: "destructive",
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setIsSigningIn(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
        toast({
          title: "Account created",
          description: "Welcome to BoK Pharm!",
        });
      } else {
        await signInWithEmail(email, password);
        toast({
          title: "Signed in",
          description: "Welcome back!",
        });
      }
      setShowAuthDialog(false);
      setEmail("");
      setPassword("");
    } catch (error: any) {
      toast({
        title: isSignUp ? "Sign up failed" : "Sign in failed",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Uber Eats Style Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center gap-4 px-4">
          {/* Burger Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="button-menu">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>Navigate BoK Pharm</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <Button variant="ghost" className="justify-start" data-testid="button-menu-home">
                  <MapPin className="mr-2 h-4 w-4" />
                  Home
                </Button>
                <Button variant="ghost" className="justify-start" data-testid="button-menu-orders">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Orders
                </Button>
                <Button variant="ghost" className="justify-start" data-testid="button-menu-favorites">
                  <Heart className="mr-2 h-4 w-4" />
                  Favorites
                </Button>
                <Button variant="ghost" className="justify-start" data-testid="button-menu-account">
                  <User className="mr-2 h-4 w-4" />
                  Account
                </Button>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <BoKPharmLogo />

          {/* Address Search - Center */}
          <div className="flex-1 max-w-xl mx-4">
            <AddressAutocomplete
              value={deliveryAddress}
              onChange={handleAddressSelect}
              placeholder="Enter delivery address"
              className="w-full"
            />
          </div>

          {/* Login & Sign Up Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setIsSignUp(false);
                setShowAuthDialog(true);
              }}
              data-testid="button-login"
            >
              Login
            </Button>
            <Button
              onClick={() => {
                setIsSignUp(true);
                setShowAuthDialog(true);
              }}
              data-testid="button-signup"
            >
              Sign up
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative" data-testid="button-cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center" data-testid="text-cart-count">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - Medication Search */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-20">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Order medications delivered to your door
              </h1>
              <p className="text-lg text-muted-foreground">
                Search for over-the-counter medications from nearby pharmacies
              </p>
            </div>

            {/* Medication Search */}
            <div className="max-w-2xl mx-auto">
              <MedicationSearchBar
                onMedicationSelect={handleMedicationSelect}
                deliveryAddress={deliveryLocation}
                placeholder="Search for medications (e.g., Paracetamol, Ibuprofen)"
              />
              {!deliveryAddress && (
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Enter your delivery address above to see nearby pharmacy availability
                </p>
              )}
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground">Get your medications in 30-60 minutes</p>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Nearby Pharmacies</h3>
                <p className="text-sm text-muted-foreground">Order from trusted local pharmacies</p>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Track Your Order</h3>
                <p className="text-sm text-muted-foreground">Real-time updates on your delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-auth">
          <DialogHeader>
            <DialogTitle>{isSignUp ? "Sign up" : "Login"}</DialogTitle>
            <DialogDescription>
              {isSignUp ? "Create a new account to get started" : "Welcome back! Please login to continue"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                data-testid="input-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                data-testid="input-password"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSigningIn}
              data-testid="button-submit-auth"
            >
              {isSigningIn ? "Please wait..." : isSignUp ? "Sign up" : "Login"}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              data-testid="button-google-signin"
            >
              <FcGoogle className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleFacebookSignIn}
              disabled={isSigningIn}
              data-testid="button-facebook-signin"
            >
              <SiFacebook className="mr-2 h-4 w-4 text-blue-600" />
              Facebook
            </Button>
          </div>

          <div className="text-center text-sm">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-primary hover:underline"
                  data-testid="button-switch-to-login"
                >
                  Login
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-primary hover:underline"
                  data-testid="button-switch-to-signup"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
