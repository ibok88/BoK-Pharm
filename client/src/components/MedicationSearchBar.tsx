import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";

interface Medication {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  strength: string;
  price: number;
}

interface MedicationSearchBarProps {
  onMedicationSelect: (medication: Medication) => void;
  deliveryAddress?: { lat: number; lng: number } | null;
  placeholder?: string;
  className?: string;
}

export default function MedicationSearchBar({
  onMedicationSelect,
  deliveryAddress,
  placeholder = "Search for medication",
  className = "",
}: MedicationSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const { data: suggestions = [] } = useQuery<Medication[]>({
    queryKey: ['/api/medications/search', searchQuery, deliveryAddress],
    enabled: searchQuery.length >= 2,
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('q', searchQuery);
      
      if (deliveryAddress?.lat && deliveryAddress?.lng) {
        params.append('lat', deliveryAddress.lat.toString());
        params.append('lng', deliveryAddress.lng.toString());
      }
      
      const response = await fetch(`/api/medications/search?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to search medications');
      }
      return response.json();
    },
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length >= 2);
  };

  const handleSuggestionClick = (medication: Medication) => {
    setSearchQuery(medication.name);
    setShowSuggestions(false);
    onMedicationSelect(medication);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
          className="pl-10"
          data-testid="input-medication-search"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-card border rounded-md shadow-lg max-h-60 overflow-y-auto"
          data-testid="medication-suggestions"
        >
          {suggestions.map((medication) => (
            <div
              key={medication.id}
              onClick={() => handleSuggestionClick(medication)}
              className="px-4 py-3 hover-elevate cursor-pointer border-b last:border-b-0"
              data-testid={`suggestion-${medication.id}`}
            >
              <div className="font-medium">{medication.name}</div>
              <div className="text-sm text-muted-foreground">
                {medication.strength} • {medication.manufacturer}
              </div>
              <div className="text-sm font-semibold text-primary mt-1">
                ₦{medication.price.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {showSuggestions && searchQuery.length >= 2 && suggestions.length === 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-card border rounded-md shadow-lg p-4"
        >
          <p className="text-sm text-muted-foreground text-center">
            {deliveryAddress
              ? "No medications available for delivery to your address"
              : "No medications found. Try a different search term."}
          </p>
        </div>
      )}
    </div>
  );
}
