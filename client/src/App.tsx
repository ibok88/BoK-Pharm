import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import OrderTracking from "@/pages/OrderTracking";
import OrderHistory from "@/pages/OrderHistory";
import PharmacyDashboard from "@/pages/PharmacyDashboard";
import DeliveryDashboard from "@/pages/DeliveryDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import InventoryOnboarding from "@/pages/InventoryOnboarding";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/order/:id" component={OrderTracking} />
          <Route path="/orders" component={OrderHistory} />
          <Route path="/pharmacy" component={PharmacyDashboard} />
          <Route path="/pharmacy/inventory" component={InventoryOnboarding} />
          <Route path="/delivery" component={DeliveryDashboard} />
          <Route path="/admin" component={AdminDashboard} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
