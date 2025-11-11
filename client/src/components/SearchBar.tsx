import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onLocationClick?: () => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ 
  onSearch, 
  onLocationClick,
  placeholder = "Search for medications...",
  className = ""
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
    console.log('Search triggered:', query);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-4 h-12 text-base"
            data-testid="input-search"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => {
            onLocationClick?.();
            console.log('Location clicked');
          }}
          className="h-12 w-12"
          data-testid="button-location"
        >
          <MapPin className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
}
