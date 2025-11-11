import { useState } from "react";
import StatsCard from "@/components/StatsCard";
import ThemeToggle from "@/components/ThemeToggle";
import { ShoppingBag, DollarSign, Package, AlertTriangle, Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PharmacyDashboard() {
  const [orders] = useState([
    { id: "ORD-001235", customer: "Adebayo Johnson", items: 2, total: 4900, status: "pending" },
    { id: "ORD-001236", customer: "Ngozi Eze", items: 1, total: 3200, status: "confirmed" },
    { id: "ORD-001237", customer: "Ibrahim Musa", items: 3, total: 6500, status: "preparing" }
  ]);

  const [lowStockItems] = useState([
    { name: "Paracetamol 500mg", stock: 12, reorderLevel: 50 },
    { name: "Amoxicillin 250mg", stock: 8, reorderLevel: 30 },
    { name: "Ibuprofen 400mg", stock: 15, reorderLevel: 40 }
  ]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-menu">
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-semibold text-lg">HealthPlus Pharmacy</h1>
                <p className="text-sm text-muted-foreground hidden md:block">
                  Manage your pharmacy operations
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" data-testid="button-notifications">
                <Bell className="h-5 w-5" />
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Today's Orders"
            value={24}
            icon={ShoppingBag}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Revenue"
            value="₦125,450"
            icon={DollarSign}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Pending Orders"
            value={5}
            icon={Package}
          />
          <StatsCard
            title="Inventory Alerts"
            value={3}
            icon={AlertTriangle}
          />
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList>
            <TabsTrigger value="orders" data-testid="tab-orders">Orders</TabsTrigger>
            <TabsTrigger value="inventory" data-testid="tab-inventory">Inventory</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Incoming Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover-elevate">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">{order.id}</p>
                          <Badge variant={order.status === "pending" ? "secondary" : "default"}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">{order.items} items</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold mb-2">₦{order.total.toLocaleString()}</p>
                        <div className="flex gap-2">
                          {order.status === "pending" && (
                            <>
                              <Button size="sm" data-testid="button-accept-order">Accept</Button>
                              <Button size="sm" variant="outline" data-testid="button-reject-order">Reject</Button>
                            </>
                          )}
                          {order.status === "confirmed" && (
                            <Button size="sm" data-testid="button-prepare-order">Start Preparing</Button>
                          )}
                          {order.status === "preparing" && (
                            <Button size="sm" data-testid="button-ready-order">Mark Ready</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Low Stock Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lowStockItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Current: {item.stock} | Reorder at: {item.reorderLevel}
                        </p>
                      </div>
                      <Button size="sm" data-testid="button-reorder-stock">Reorder</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
