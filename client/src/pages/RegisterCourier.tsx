import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function RegisterCourier() {
  const { user } = useFirebaseAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    vehicle_type: "",
    vehicle_plate_number: "",
    driver_license_number: "",
    coverage_zones: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to register as a courier",
        variant: "destructive",
      });
      setLocation("/");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await user.getIdToken();
      await apiRequest("/api/delivery-partners/register", "POST", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast({
        title: "Registration submitted!",
        description: "Your courier registration has been submitted for review. We'll notify you once it's approved.",
      });
      
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Failed to register as courier",
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
            <CardTitle>Register as a Delivery Partner</CardTitle>
            <CardDescription>
              Join our delivery network and start earning. Fill out the form below to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="e.g., John Doe"
                  data-testid="input-full-name"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
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
                <Label htmlFor="vehicle_type">Vehicle Type *</Label>
                <Select
                  value={formData.vehicle_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, vehicle_type: value }))}
                >
                  <SelectTrigger id="vehicle_type" data-testid="select-vehicle-type">
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="motorcycle">Motorcycle</SelectItem>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                    <SelectItem value="bicycle">Bicycle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="vehicle_plate_number">Vehicle Plate Number</Label>
                <Input
                  id="vehicle_plate_number"
                  value={formData.vehicle_plate_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicle_plate_number: e.target.value }))}
                  placeholder="e.g., ABC-123-XY"
                  data-testid="input-plate-number"
                />
              </div>

              <div>
                <Label htmlFor="driver_license_number">Driver's License Number *</Label>
                <Input
                  id="driver_license_number"
                  required
                  value={formData.driver_license_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, driver_license_number: e.target.value }))}
                  placeholder="e.g., ABC12345678"
                  data-testid="input-license"
                />
              </div>

              <div>
                <Label htmlFor="coverage_zones">Preferred Coverage Zones (Optional)</Label>
                <Input
                  id="coverage_zones"
                  value={formData.coverage_zones}
                  onChange={(e) => setFormData(prev => ({ ...prev, coverage_zones: e.target.value }))}
                  placeholder="e.g., Ikeja, Victoria Island"
                  data-testid="input-coverage"
                />
              </div>

              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-semibold mb-2">What happens next?</h3>
                <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  <li>We'll review your application within 24-48 hours</li>
                  <li>You'll receive an email once approved</li>
                  <li>Download our delivery app to start accepting orders</li>
                  <li>Earn competitive rates for each delivery</li>
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
