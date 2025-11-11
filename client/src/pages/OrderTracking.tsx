import { useState } from "react";
import OrderStatusTimeline from "@/components/OrderStatusTimeline";
import DeliveryPartnerCard from "@/components/DeliveryPartnerCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import ThemeToggle from "@/components/ThemeToggle";
import { ArrowLeft, MapPin, Package } from "lucide-react";
import deliveryPartnerPhoto from '@assets/generated_images/Delivery_partner_portrait_0a43ad1a.png';
import medicationImage1 from '@assets/generated_images/Medication_product_bottle_39d472bc.png';

export default function OrderTracking() {
  const [activeTab, setActiveTab] = useState("orders");

  const orderItems = [
    { name: "Paracetamol 500mg", quantity: 2, price: 2400, image: medicationImage1 },
    { name: "Amoxicillin 250mg", quantity: 1, price: 2500, image: medicationImage1 }
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-semibold">Order #ORD-001235</h1>
                <p className="text-sm text-muted-foreground">Track your order</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderStatusTimeline currentStatus="out-for-delivery" />
          </CardContent>
        </Card>

        <DeliveryPartnerCard
          name="Chukwudi Okafor"
          phone="+234 812 345 6789"
          rating={4.9}
          photo={deliveryPartnerPhoto}
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Delivery Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">Home</p>
            <p className="text-sm text-muted-foreground">
              15 Ogudu Road, Ojota<br />
              Lagos, Nigeria
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderItems.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-md bg-muted overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">₦{item.price.toLocaleString()}</p>
              </div>
            ))}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span>₦4,900</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pharmacy Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">MedExpress</p>
            <p className="text-sm text-muted-foreground">15 Awolowo Road, Ikoyi</p>
            <Button variant="outline" size="sm" className="mt-3" data-testid="button-call-pharmacy">
              Call Pharmacy
            </Button>
          </CardContent>
        </Card>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
