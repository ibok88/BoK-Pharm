import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, details?: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  className?: string;
}

export function AddressAutocomplete({ value, onChange, placeholder = "Enter delivery address", className }: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  
  const { data: apiKeyData } = useQuery({
    queryKey: ["/api/google-maps-api-key"],
  });

  useEffect(() => {
    if (!apiKeyData?.apiKey || !inputRef.current || autocompleteRef.current) return;

    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initAutocomplete();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKeyData.apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => initAutocomplete();
      document.head.appendChild(script);
    };

    const initAutocomplete = () => {
      if (!inputRef.current) return;

      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        types: ["address"],
        fields: ["formatted_address", "geometry", "address_components", "name"],
      });

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        if (place && place.formatted_address) {
          onChange(place.formatted_address, place);
        }
      });
    };

    loadGoogleMaps();

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [apiKeyData, onChange]);

  return (
    <Input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
      data-testid="input-address-autocomplete"
    />
  );
}
