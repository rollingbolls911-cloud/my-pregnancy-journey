import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDailyDua, getRandomDua, Dua } from "@/lib/duas";
import { BookOpen, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { hapticFeedback } from "@/lib/haptics";
import { cn } from "@/lib/utils";

export function DailyDuaCard() {
  const [currentDua, setCurrentDua] = useState<Dua>(getDailyDua());
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isHapticsEnabled = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("bloom-haptics") !== "false";
    }
    return true;
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (isHapticsEnabled()) hapticFeedback("light");
    
    // Small animation delay
    setTimeout(() => {
      setCurrentDua(getRandomDua());
      setIsRefreshing(false);
    }, 300);
  };

  const categoryColors: Record<Dua["category"], string> = {
    protection: "from-chart-2/20 to-chart-2/5",
    ease: "from-chart-1/20 to-chart-1/5",
    gratitude: "from-primary/20 to-primary/5",
    baby: "from-chart-1/20 to-primary/5",
    strength: "from-chart-3/20 to-chart-3/5",
    peace: "from-accent to-primary/5",
  };

  const categoryLabels: Record<Dua["category"], string> = {
    protection: "Protection",
    ease: "Ease & Relief",
    gratitude: "Gratitude",
    baby: "For Baby",
    strength: "Strength",
    peace: "Peace",
  };

  return (
    <Card className="border-border/30 overflow-hidden">
      <div className={cn(
        "bg-gradient-to-br p-0.5 transition-all duration-300",
        categoryColors[currentDua.category]
      )}>
        <CardContent className="bg-card/95 backdrop-blur-sm rounded-[calc(var(--radius)-2px)] p-0">
          {/* Header - always visible */}
          <button
            onClick={() => {
              setIsExpanded(!isExpanded);
              if (isHapticsEnabled()) hapticFeedback("light");
            }}
            className="w-full p-4 flex items-center gap-3 text-left"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-chart-1/20 flex items-center justify-center">
              <span className="text-lg">🤲</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <BookOpen className="h-3.5 w-3.5 text-primary" />
                <p className="text-sm font-medium text-foreground">Daily Dua</p>
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {currentDua.translation.slice(0, 40)}...
              </p>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          {/* Expanded content */}
          <div className={cn(
            "overflow-hidden transition-all duration-300",
            isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          )}>
            <div className="px-4 pb-4 space-y-4">
              {/* Category badge */}
              <div className="flex items-center justify-between">
                <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  {categoryLabels[currentDua.category]}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8 transition-transform",
                    isRefreshing && "animate-spin"
                  )}
                  onClick={handleRefresh}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              {/* Arabic text */}
              {currentDua.arabic && (
                <div className="text-right">
                  <p className="text-xl leading-loose text-foreground font-arabic" dir="rtl">
                    {currentDua.arabic}
                  </p>
                </div>
              )}

              {/* Transliteration */}
              {currentDua.transliteration && (
                <p className="text-sm text-primary/80 italic">
                  {currentDua.transliteration}
                </p>
              )}

              {/* Translation */}
              <p className="text-sm text-foreground leading-relaxed">
                "{currentDua.translation}"
              </p>

              {/* Source */}
              <p className="text-xs text-muted-foreground text-right">
                — {currentDua.source}
              </p>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
