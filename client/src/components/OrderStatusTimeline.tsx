import { Check, Clock, Package, Truck, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type OrderStatus = "pending" | "confirmed" | "preparing" | "out-for-delivery" | "delivered";

interface OrderStatusTimelineProps {
  currentStatus: OrderStatus;
}

const statusSteps = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: Check },
  { key: "preparing", label: "Preparing", icon: Package },
  { key: "out-for-delivery", label: "Out for Delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
] as const;

export default function OrderStatusTimeline({ currentStatus }: OrderStatusTimelineProps) {
  const currentIndex = statusSteps.findIndex(step => step.key === currentStatus);

  return (
    <div className="w-full" data-testid="order-status-timeline">
      <div className="flex items-center justify-between relative">
        {statusSteps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center flex-1 relative">
              {index > 0 && (
                <div 
                  className={cn(
                    "absolute top-6 right-1/2 h-0.5 w-full -z-10",
                    index <= currentIndex ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors mb-2",
                  isActive
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-background border-muted text-muted-foreground",
                  isCurrent && "animate-pulse"
                )}
                data-testid={`status-${step.key}`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <p className={cn(
                "text-xs text-center font-medium max-w-20",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
