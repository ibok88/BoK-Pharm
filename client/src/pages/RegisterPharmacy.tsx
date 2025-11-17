import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { ArrowLeft } from "lucide-react";

export default function RegisterPharmacy() {
  const { user } = useFirebaseAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    latitude: null as number | null,
    longitude: null as number | null,
    email: "",
    phone: "",
    contact_person: "",
    opening_hours: "9:00 AM - 6:00 PM",
    license_number: "",
  });

  const handleAddressSelect = (address: string, place?: any) => {
    setFormData(prev => ({
      ...prev,
      address,
      city: place?.address_components?.find((c: any) => c.types.includes("locality"))?.long_name || "",
      state: place?.address_components?.find((c: any) => c.types.includes("administrative_area_level_1"))?.long_name || "",
      country: place?.address_components?.find((c: any) => c.types.includes("country"))?.long_name || "",
      latitude: place?.geometry?.location?.lat(),
      longitude: place?.geometry?.location?.lng(),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to register a pharmacy",
        variant: "destructive",
      });
      setLocation("/");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await user.getIdToken();
      await apiRequest("/api/pharmacies/register", "POST", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast({
        title: "Registration submitted!",
        description: "Your pharmacy registration has been submitted for review. We'll notify you once it's approved.",
      });
      
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Failed to register pharmacy",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-2xl px-4">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-4"
          data-testid="button-back"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Register Your Pharmacy</CardTitle>
            <CardDescription>
              Join BoK Pharm's network of trusted pharmacies. Fill out the form below and we'll review your application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Pharmacy Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Green Cross Pharmacy"
                  data-testid="input-pharmacy-name"
                />
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <AddressAutocomplete
                  value={formData.address}
                  onChange={handleAddressSelect}
                  placeholder="Enter pharmacy address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="City"
                    data-testid="input-city"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="State"
                    data-testid="input-state"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Pharmacy Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="pharmacy@example.com"
                  data-testid="input-email"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+234 XXX XXX XXXX"
                  data-testid="input-phone"
                />
              </div>

              <div>
                <Label htmlFor="contact_person">Contact Person Name</Label>
                <Input
                  id="contact_person"
                  value={formData.contact_person}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_person: e.target.value }))}
                  placeholder="e.g., John Doe"
                  data-testid="input-contact-person"
                />
              </div>

              <div>
                <Label htmlFor="license_number">Pharmacy License Number *</Label>
                <Input
                  id="license_number"
                  required
                  value={formData.license_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, license_number: e.target.value }))}
                  placeholder="e.g., PCN-XXXX-XXXX"
                  data-testid="input-license"
                />
              </div>

              <div>
                <Label htmlFor="opening_hours">Opening Hours</Label>
                <Input
                  id="opening_hours"
                  value={formData.opening_hours}
                  onChange={(e) => setFormData(prev => ({ ...prev, opening_hours: e.target.value }))}
                  placeholder="e.g., 9:00 AM - 6:00 PM"
                  data-testid="input-hours"
                />
              </div>

              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-semibold mb-2">What happens next?</h3>
                <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  <li>We'll review your application within 24-48 hours</li>
                  <li>You'll receive an email once approved</li>
                  <li>Access your pharmacy dashboard to manage inventory</li>
                  <li>Start receiving orders from customers nearby</li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
                data-testid="button-submit"
              >
                {isSubmitting ? "Submitting..." : "Submit Registration"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
