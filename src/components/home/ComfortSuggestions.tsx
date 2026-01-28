import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPreferredComfortItems, ComfortItem } from "@/lib/comfort";
import { Sparkles, Settings2 } from "lucide-react";
import { Link } from "react-router-dom";
import { hapticFeedback } from "@/lib/haptics";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ComfortSuggestionsProps {
  className?: string;
}

export function ComfortSuggestions({ className }: ComfortSuggestionsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const comfortItems = getPreferredComfortItems();

  const isHapticsEnabled = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("bloom-haptics") !== "false";
    }
    return true;
  };

  const handleSelect = (item: ComfortItem) => {
    setSelectedId(item.id);
    if (isHapticsEnabled()) hapticFeedback("light");
    
    // Show encouraging message
    const messages = [
      `${item.emoji} Take your time`,
      `${item.emoji} That sounds lovely`,
      `${item.emoji} Good choice, you deserve it`,
      `${item.emoji} Caring for yourself matters`,
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    toast(randomMessage, { duration: 2000 });

    // Reset after a moment
    setTimeout(() => setSelectedId(null), 2000);
  };

  if (comfortItems.length === 0) {
    return (
      <Card className={cn("border-border/30", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              What helps you feel better?
            </h3>
            <Link to="/settings">
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                <Settings2 className="h-3.5 w-3.5 mr-1" />
                Set up
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            Add your comfort preferences in settings 💕
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-border/30", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Need some comfort?
          </h3>
          <Link to="/settings">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Settings2 className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {comfortItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              className={cn(
                "px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 touch-manipulation",
                "bg-accent/60 hover:bg-accent text-foreground",
                "border border-border/30 hover:border-primary/30",
                "active:scale-95",
                selectedId === item.id && "bg-primary/20 border-primary/50 scale-105"
              )}
            >
              <span className="mr-1.5">{item.emoji}</span>
              {item.label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
