import { Home, Search, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "search", label: "Search", icon: Search },
  { id: "orders", label: "Orders", icon: Clock },
  { id: "profile", label: "Profile", icon: User },
];

export default function BottomNav({ activeTab = "home", onTabChange }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background md:hidden" data-testid="bottom-nav">
      <nav className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                onTabChange?.(item.id);
                console.log('Tab changed:', item.id);
              }}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
              data-testid={`tab-${item.id}`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
