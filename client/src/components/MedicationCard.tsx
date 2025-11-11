import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

interface MedicationCardProps {
  id: string;
  name: string;
  strength: string;
  manufacturer: string;
  price: number;
  originalPrice?: number;
  image?: string;
  onAddToCart?: (id: string, quantity: number) => void;
}

export default function MedicationCard({
  id,
  name,
  strength,
  manufacturer,
  price,
  originalPrice,
  image,
  onAddToCart
}: MedicationCardProps) {
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    onAddToCart?.(id, quantity);
    console.log(`Added ${quantity} of ${name} to cart`);
  };

  return (
    <Card className="hover-elevate" data-testid={`card-medication-${id}`}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {image && (
            <div className="w-20 h-20 rounded-md bg-muted flex-shrink-0 overflow-hidden">
              <img src={image} alt={name} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <div>
              <h3 className="font-semibold truncate">{name}</h3>
              <p className="text-sm text-muted-foreground">{strength}</p>
              <p className="text-xs text-muted-foreground">{manufacturer}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">₦{price.toLocaleString()}</span>
              {originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ₦{originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-auto">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  data-testid="button-decrease-quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-3 text-sm font-medium" data-testid="text-quantity">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQuantity(quantity + 1)}
                  data-testid="button-increase-quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                onClick={handleAdd} 
                className="flex-1"
                size="sm"
                data-testid="button-add-to-cart"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
