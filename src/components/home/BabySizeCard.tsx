import { Card, CardContent } from "@/components/ui/card";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { getBabySizeByWeek } from "@/lib/pregnancy";
import { Ruler, Scale } from "lucide-react";

export function BabySizeCard() {
  const { gestationalAge } = usePregnancy();

  if (!gestationalAge) return null;

  const babySize = getBabySizeByWeek(gestationalAge.weeks);

  return (
    <Card className="border-border/30 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-br from-chart-2/15 via-accent/40 to-primary/10 p-1">
        <CardContent className="bg-card/90 backdrop-blur-xl rounded-[calc(var(--radius)-4px)] p-5">
          <div className="flex items-center gap-4">
            {/* Large emoji visual */}
            <div className="relative flex-shrink-0">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-gradient-to-br from-chart-2/20 via-accent/30 to-primary/15 flex items-center justify-center shadow-md">
                <span className="text-4xl sm:text-5xl" role="img" aria-label={babySize.name}>
                  {babySize.emoji}
                </span>
              </div>
              {/* Week badge */}
              <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-md">
                {gestationalAge.weeks}
              </div>
            </div>

            {/* Info section */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-1">Baby is the size of a</p>
              <h3 className="font-bold text-foreground text-lg sm:text-xl truncate">
                {babySize.name}
              </h3>

              {/* Size details */}
              <div className="mt-3 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Ruler className="h-3.5 w-3.5 text-chart-2" />
                  <span className="font-medium text-foreground">{babySize.length}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Scale className="h-3.5 w-3.5 text-chart-1" />
                  <span className="font-medium text-foreground">{babySize.weight}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
