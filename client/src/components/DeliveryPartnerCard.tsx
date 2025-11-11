import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, Star } from "lucide-react";

interface DeliveryPartnerCardProps {
  name: string;
  phone: string;
  rating: number;
  photo?: string;
}

export default function DeliveryPartnerCard({
  name,
  phone,
  rating,
  photo
}: DeliveryPartnerCardProps) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Card data-testid="card-delivery-partner">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={photo} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold">Your Delivery Partner</h3>
            <p className="text-sm font-medium">{name}</p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              <span>{rating.toFixed(1)}</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.location.href = `tel:${phone}`}
            data-testid="button-call-partner"
          >
            <Phone className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
