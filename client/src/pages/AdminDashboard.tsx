import { useState } from "react";
import StatsCard from "@/components/StatsCard";
import ThemeToggle from "@/components/ThemeToggle";
import { ShoppingBag, Users, DollarSign, AlertTriangle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  const [transactions] = useState([
    {
      id: "TXN-001235",
      orderId: "ORD-001235",
      customer: "Adebayo Johnson",
      pharmacy: "HealthPlus Pharmacy",
      amount: 4900,
      status: "completed",
      date: "Nov 11, 2025"
    },
    {
      id: "TXN-001236",
      orderId: "ORD-001236",
      customer: "Ngozi Eze",
      pharmacy: "MedExpress",
      amount: 3200,
      status: "pending",
      date: "Nov 11, 2025"
    },
    {
      id: "TXN-001237",
      orderId: "ORD-001237",
      customer: "Ibrahim Musa",
      pharmacy: "Care Pharmacy",
      amount: 6500,
      status: "completed",
      date: "Nov 11, 2025"
    }
  ]);

  const [disputes] = useState([
    {
      id: "DIS-001",
      orderId: "ORD-001230",
      customer: "Chioma Nwosu",
      issue: "Wrong medication delivered",
      status: "open"
    },
    {
      id: "DIS-002",
      orderId: "ORD-001228",
      customer: "Tunde Bakare",
      issue: "Late delivery",
      status: "resolved"
    }
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
                <h1 className="font-semibold text-lg">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground hidden md:block">
                  Monitor and manage the platform
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Orders"
            value={1247}
            icon={ShoppingBag}
            trend={{ value: 15, isPositive: true }}
          />
          <StatsCard
            title="Total Revenue"
            value="₦2.4M"
            icon={DollarSign}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Active Users"
            value={856}
            icon={Users}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Active Disputes"
            value={3}
            icon={AlertTriangle}
          />
        </div>

        <Tabs defaultValue="transactions" className="w-full">
          <TabsList>
            <TabsTrigger value="transactions" data-testid="tab-transactions">
              Transactions
            </TabsTrigger>
            <TabsTrigger value="disputes" data-testid="tab-disputes">
              Disputes ({disputes.filter(d => d.status === "open").length})
            </TabsTrigger>
            <TabsTrigger value="users" data-testid="tab-users">
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Transactions</CardTitle>
                  <Input
                    placeholder="Search transactions..."
                    className="max-w-xs"
                    data-testid="input-search-transactions"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map((txn) => (
                    <div key={txn.id} className="flex items-center justify-between p-4 border rounded-lg hover-elevate">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">{txn.id}</p>
                          <Badge variant={txn.status === "completed" ? "default" : "secondary"}>
                            {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{txn.customer} • {txn.pharmacy}</p>
                        <p className="text-xs text-muted-foreground">{txn.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₦{txn.amount.toLocaleString()}</p>
                        <Button size="sm" variant="ghost" data-testid="button-view-transaction">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="disputes" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Disputes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {disputes.map((dispute) => (
                    <div key={dispute.id} className="flex items-center justify-between p-4 border rounded-lg hover-elevate">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">{dispute.id}</p>
                          <Badge variant={dispute.status === "open" ? "destructive" : "default"}>
                            {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{dispute.customer} • Order {dispute.orderId}</p>
                        <p className="text-sm">{dispute.issue}</p>
                      </div>
                      {dispute.status === "open" && (
                        <Button size="sm" data-testid="button-resolve-dispute">
                          Resolve
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">User management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
