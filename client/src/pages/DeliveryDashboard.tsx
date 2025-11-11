import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { MapPin, Package, Menu, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DeliveryDashboard() {
  const [availableOrders] = useState([
    {
      id: "ORD-001238",
      pharmacy: "HealthPlus Pharmacy",
      address: "23 Admiralty Way, Lekki",
      distance: "1.2 km",
      delivery: "15 Ogudu Road, Ojota",
      deliveryDistance: "3.5 km",
      earnings: 800,
      status: "available"
    },
    {
      id: "ORD-001239",
      pharmacy: "MedExpress",
      address: "15 Awolowo Road, Ikoyi",
      distance: "2.8 km",
      delivery: "8 Ozumba Mbadiwe, VI",
      deliveryDistance: "4.2 km",
      earnings: 1000,
      status: "available"
    }
  ]);

  const [activeDelivery] = useState({
    id: "ORD-001235",
    pharmacy: "MedExpress",
    customer: "Adebayo Johnson",
    address: "15 Ogudu Road, Ojota",
    phone: "+234 803 456 7890",
    earnings: 800
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-menu">
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-semibold text-lg">Delivery Partner</h1>
                <p className="text-sm text-muted-foreground">Available orders nearby</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Earnings</p>
                  <p className="text-2xl font-bold mt-1">₦4,200</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Deliveries</p>
                  <p className="text-2xl font-bold mt-1">7</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Distance</p>
                  <p className="text-2xl font-bold mt-1">24 km</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {activeDelivery && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="text-primary">Active Delivery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-semibold">{activeDelivery.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium">{activeDelivery.customer}</p>
                <p className="text-sm">{activeDelivery.address}</p>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" data-testid="button-mark-picked">
                  Mark as Picked Up
                </Button>
                <Button variant="outline" onClick={() => window.location.href = `tel:${activeDelivery.phone}`} data-testid="button-call-customer">
                  Call Customer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Available Orders (Within 5km)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 space-y-3 hover-elevate">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{order.id}</p>
                      <Badge>₦{order.earnings}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{order.pharmacy}</p>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex items-start gap-2">
                        <Package className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <div>
                          <p className="font-medium">Pickup</p>
                          <p className="text-muted-foreground">{order.address} ({order.distance})</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <div>
                          <p className="font-medium">Delivery</p>
                          <p className="text-muted-foreground">{order.delivery} ({order.deliveryDistance})</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Button className="w-full" data-testid="button-accept-delivery">
                  Accept Delivery
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
