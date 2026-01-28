import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { defaultComfortItems, getComfortPreferences, saveComfortPreferences, ComfortItem } from "@/lib/comfort";
import { cn } from "@/lib/utils";
import { Sparkles, Check } from "lucide-react";
import { toast } from "sonner";
import { hapticFeedback } from "@/lib/haptics";

export function ComfortPreferencesSettings() {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => getComfortPreferences());
  const [hasChanges, setHasChanges] = useState(false);

  const isHapticsEnabled = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("bloom-haptics") !== "false";
    }
    return true;
  };

  const toggleItem = (id: string) => {
    if (isHapticsEnabled()) hapticFeedback("light");
    setSelectedIds((prev) => {
      const newIds = prev.includes(id) 
        ? prev.filter((i) => i !== id)
        : [...prev, id];
      setHasChanges(true);
      return newIds;
    });
  };

  const handleSave = () => {
    saveComfortPreferences(selectedIds);
    setHasChanges(false);
    if (isHapticsEnabled()) hapticFeedback("success");
    toast.success("Preferences saved 💕");
  };

  const groupedItems = {
    physical: defaultComfortItems.filter((i) => i.category === "physical"),
    activity: defaultComfortItems.filter((i) => i.category === "activity"),
    spiritual: defaultComfortItems.filter((i) => i.category === "spiritual"),
    emotional: defaultComfortItems.filter((i) => i.category === "emotional"),
  };

  const categoryLabels = {
    physical: "Physical comfort",
    activity: "Activities",
    spiritual: "Spiritual",
    emotional: "Emotional support",
  };

  return (
    <Card>
      <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-2 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
          Comfort Preferences
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          What helps you feel better? We'll suggest these when you need them.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6 space-y-4">
        {(Object.keys(groupedItems) as Array<keyof typeof groupedItems>).map((category) => (
          <div key={category}>
            <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              {categoryLabels[category]}
            </h4>
            <div className="flex flex-wrap gap-2">
              {groupedItems[category].map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 touch-manipulation",
                    "border active:scale-95",
                    selectedIds.includes(item.id)
                      ? "bg-primary/15 border-primary/50 text-foreground"
                      : "bg-muted/30 border-border/30 text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  <span className="mr-1.5">{item.emoji}</span>
                  {item.label}
                  {selectedIds.includes(item.id) && (
                    <Check className="inline ml-1.5 h-3 w-3 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
        
        {hasChanges && (
          <Button onClick={handleSave} className="w-full mt-4">
            Save Preferences
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
