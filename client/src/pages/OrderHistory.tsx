import { useState } from "react";
import OrderHistoryCard from "@/components/OrderHistoryCard";
import BottomNav from "@/components/BottomNav";
import ThemeToggle from "@/components/ThemeToggle";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function OrderHistory() {
  const [activeTab, setActiveTab] = useState("orders");

  const allOrders = [
    {
      orderId: "ORD-001235",
      date: "Nov 11, 2025",
      pharmacy: "MedExpress",
      items: 2,
      total: 4900,
      status: "out-for-delivery" as const
    },
    {
      orderId: "ORD-001234",
      date: "Nov 10, 2025",
      pharmacy: "HealthPlus Pharmacy",
      items: 3,
      total: 5400,
      status: "delivered" as const
    },
    {
      orderId: "ORD-001233",
      date: "Nov 8, 2025",
      pharmacy: "Care Pharmacy",
      items: 1,
      total: 3200,
      status: "delivered" as const
    },
    {
      orderId: "ORD-001232",
      date: "Nov 5, 2025",
      pharmacy: "HealthPlus Pharmacy",
      items: 4,
      total: 7800,
      status: "cancelled" as const
    }
  ];

  const activeOrders = allOrders.filter(o => 
    ["pending", "confirmed", "preparing", "out-for-delivery"].includes(o.status)
  );
  
  const completedOrders = allOrders.filter(o => 
    o.status === "delivered"
  );

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
                <h1 className="font-semibold text-lg">Order History</h1>
                <p className="text-sm text-muted-foreground">View all your orders</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="all" data-testid="tab-all-orders">
              All ({allOrders.length})
            </TabsTrigger>
            <TabsTrigger value="active" data-testid="tab-active-orders">
              Active ({activeOrders.length})
            </TabsTrigger>
            <TabsTrigger value="completed" data-testid="tab-completed-orders">
              Completed ({completedOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {allOrders.map((order) => (
              <OrderHistoryCard key={order.orderId} {...order} />
            ))}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {activeOrders.length > 0 ? (
              activeOrders.map((order) => (
                <OrderHistoryCard key={order.orderId} {...order} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No active orders</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedOrders.map((order) => (
              <OrderHistoryCard key={order.orderId} {...order} />
            ))}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
