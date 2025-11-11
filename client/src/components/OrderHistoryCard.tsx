import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Package } from "lucide-react";

interface OrderHistoryCardProps {
  orderId: string;
  date: string;
  pharmacy: string;
  items: number;
  total: number;
  status: "pending" | "confirmed" | "preparing" | "out-for-delivery" | "delivered" | "cancelled";
  onViewDetails?: () => void;
  onReorder?: () => void;
}

export default function OrderHistoryCard({
  orderId,
  date,
  pharmacy,
  items,
  total,
  status,
  onViewDetails,
  onReorder
}: OrderHistoryCardProps) {
  const statusConfig = {
    pending: { label: "Pending", variant: "secondary" as const },
    confirmed: { label: "Confirmed", variant: "default" as const },
    preparing: { label: "Preparing", variant: "default" as const },
    "out-for-delivery": { label: "Out for Delivery", variant: "default" as const },
    delivered: { label: "Delivered", variant: "default" as const },
    cancelled: { label: "Cancelled", variant: "destructive" as const }
  };

  return (
    <Card className="hover-elevate" data-testid={`card-order-${orderId}`}>
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold">Order #{orderId}</p>
                <Badge variant={statusConfig[status].variant}>
                  {statusConfig[status].label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{pharmacy}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              <span>{items} item{items !== 1 ? 's' : ''}</span>
            </div>
            <div className="font-semibold text-foreground">₦{total.toLocaleString()}</div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                onViewDetails?.();
                console.log('View details clicked:', orderId);
              }}
              data-testid="button-view-details"
            >
              View Details
            </Button>
            {status === "delivered" && (
              <Button
                variant="default"
                size="sm"
                className="flex-1"
                onClick={() => {
                  onReorder?.();
                  console.log('Reorder clicked:', orderId);
                }}
                data-testid="button-reorder"
              >
                Reorder
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
