import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Star } from "lucide-react";

interface PharmacyCardProps {
  name: string;
  distance: string;
  rating: number;
  deliveryTime: string;
  phone: string;
  availability: "in-stock" | "call-to-confirm" | "out-of-stock";
  address?: string;
  onClick?: () => void;
}

export default function PharmacyCard({
  name,
  distance,
  rating,
  deliveryTime,
  phone,
  availability,
  address,
  onClick
}: PharmacyCardProps) {
  const availabilityConfig = {
    "in-stock": { label: "In Stock", variant: "default" as const },
    "call-to-confirm": { label: "Call to Confirm", variant: "secondary" as const },
    "out-of-stock": { label: "Out of Stock", variant: "destructive" as const }
  };

  return (
    <Card className="hover-elevate cursor-pointer" onClick={onClick} data-testid={`card-pharmacy-${name}`}>
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{name}</h3>
              {address && (
                <p className="text-sm text-muted-foreground truncate">{address}</p>
              )}
            </div>
            <Badge variant={availabilityConfig[availability].variant}>
              {availabilityConfig[availability].label}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{distance}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span>{rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{deliveryTime}</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `tel:${phone}`;
            }}
            data-testid="button-call"
          >
            <Phone className="h-4 w-4 mr-2" />
            {phone}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
