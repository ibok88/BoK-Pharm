import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ThemeToggle from "@/components/ThemeToggle";
import { Pill, Clock, MapPin, Truck } from "lucide-react";
import { SiFacebook } from "react-icons/si";
import { FcGoogle } from "react-icons/fc";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@assets/stock_images/modern_well-lit_phar_d45252ec.jpg";

function BoKPharmLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center leading-none ${className}`}>
      <span className="font-bold text-2xl tracking-tight">BoK</span>
      <span className="font-semibold text-xs -mt-1">Pharm</span>
    </div>
  );
}

export default function Landing() {
  const { signInWithGoogle, signInWithFacebook, signInWithEmail, signUpWithEmail } = useFirebaseAuth();
  const { toast } = useToast();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
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
    } catch (error: any) {
      toast({
        title: isSignUp ? "Sign up failed" : "Sign in failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsSigningIn(false);
    }
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
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <section className="relative rounded-lg overflow-hidden h-96 md:h-[500px] mb-12 bg-white dark:bg-background">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/85 to-white/70 dark:from-black/70 dark:to-black/40" />
          </div>
          <div className="relative h-full flex flex-col justify-center items-center text-center px-6">
            <div className="mb-4">
              <Badge className="bg-primary text-primary-foreground border-0 mb-6">
                24 Hours Supply
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground dark:text-white">
              Your Pharmacies right next to you ...
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground dark:text-white/90 mb-8 max-w-2xl">
              Quality medications delivered to your doorstep, anytime, anywhere
            </p>
            <div className="w-full max-w-sm">
              {!showEmailForm ? (
                <div className="flex flex-col gap-3">
                  <Button
                    size="lg"
                    onClick={handleGoogleSignIn}
                    disabled={isSigningIn}
                    className="w-full bg-white dark:bg-card text-foreground border hover-elevate"
                    data-testid="button-google-signin"
                  >
                    <FcGoogle className="mr-2 h-5 w-5" />
                    Continue with Google
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleFacebookSignIn}
                    disabled={isSigningIn}
                    className="w-full bg-[#1877F2] text-white hover:bg-[#1877F2]/90"
                    data-testid="button-facebook-signin"
                  >
                    <SiFacebook className="mr-2 h-5 w-5" />
                    Continue with Facebook
                  </Button>
                  <div className="relative my-4">
                    <Separator />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-sm text-muted-foreground">
                      or
                    </span>
                  </div>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setShowEmailForm(true)}
                    className="w-full"
                    data-testid="button-show-email-form"
                  >
                    Sign in with Email
                  </Button>
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>{isSignUp ? "Create Account" : "Sign In"}</CardTitle>
                    <CardDescription>
                      {isSignUp
                        ? "Enter your details to create an account"
                        : "Enter your credentials to access your account"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleEmailAuth} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isSigningIn}
                          required
                          data-testid="input-email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isSigningIn}
                          required
                          data-testid="input-password"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSigningIn}
                        data-testid="button-email-submit"
                      >
                        {isSigningIn ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
                      </Button>
                      <div className="text-center space-y-2">
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => setIsSignUp(!isSignUp)}
                          className="text-sm"
                          data-testid="button-toggle-signup"
                        >
                          {isSignUp
                            ? "Already have an account? Sign in"
                            : "Don't have an account? Sign up"}
                        </Button>
                        <div>
                          <Button
                            type="button"
                            variant="link"
                            onClick={() => setShowEmailForm(false)}
                            className="text-sm"
                            data-testid="button-back-to-sso"
                          >
                            Back to social sign-in
                          </Button>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Why Choose BoK Pharm?</h2>
            <p className="text-muted-foreground text-lg">
              Your health, our priority
            </p>
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
                  Quick and reliable delivery right to your door
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Pill className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>OTC Medications</CardTitle>
                <CardDescription>
                  Wide selection of over-the-counter medications
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="text-center py-12 bg-muted rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground text-lg mb-6">
            Join thousands of customers who trust BoK Pharm for their medication
            needs
          </p>
          <div className="flex flex-col gap-3 w-full max-w-sm mx-auto">
            <Button
              size="lg"
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="w-full bg-white dark:bg-card text-foreground border hover-elevate"
              data-testid="button-google-signin-cta"
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Sign up with Google
            </Button>
            <Button
              size="lg"
              onClick={handleFacebookSignIn}
              disabled={isSigningIn}
              className="w-full bg-[#1877F2] text-white hover:bg-[#1877F2]/90"
              data-testid="button-facebook-signin-cta"
            >
              <SiFacebook className="mr-2 h-5 w-5" />
              Sign up with Facebook
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
