import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedProgressRing } from "./AnimatedProgressRing";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { getWeekMilestone } from "@/lib/pregnancy";
import { getWeeklyAffirmation } from "@/lib/greetings";
import { format } from "date-fns";
import { Sparkles, Heart } from "lucide-react";
import { shouldCelebrate, celebrateMilestone, celebrate } from "@/lib/celebrations";
import { hapticFeedback } from "@/lib/haptics";
import { toast } from "sonner";

export function TodayCard() {
  const { gestationalAge, daysRemaining, profile } = usePregnancy();
  const [hasCheckedMilestone, setHasCheckedMilestone] = useState(false);
  const previousWeek = useRef<number | undefined>(undefined);

  const isHapticsEnabled = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("bloom-haptics") !== "false";
    }
    return true;
  };

  // Check for milestone celebrations
  useEffect(() => {
    if (!gestationalAge || hasCheckedMilestone) return;

    // Get previous week from localStorage
    const storedWeek = localStorage.getItem("bloom-last-week");
    const lastWeek = storedWeek ? parseInt(storedWeek, 10) : undefined;
    previousWeek.current = lastWeek;

    const celebration = shouldCelebrate(
      gestationalAge.weeks,
      gestationalAge.days,
      lastWeek
    );

    if (celebration.celebrate) {
      // Small delay for better UX
      setTimeout(() => {
        if (celebration.level === "large") {
          celebrateMilestone();
          if (isHapticsEnabled()) hapticFeedback("heavy");
        } else {
          celebrate(celebration.level);
          if (isHapticsEnabled()) hapticFeedback("success");
        }

        if (celebration.message) {
          toast.success(celebration.message, {
            duration: 5000,
          });
        }
      }, 500);
    }

    // Store current week
    localStorage.setItem("bloom-last-week", String(gestationalAge.weeks));
    setHasCheckedMilestone(true);
  }, [gestationalAge, hasCheckedMilestone]);

  if (!gestationalAge || !profile) return null;

  const milestone = getWeekMilestone(gestationalAge.weeks);
  const affirmation = getWeeklyAffirmation(gestationalAge.weeks);

  return (
    <Card className="overflow-hidden border-border/30 shadow-xl">
      <div className="bg-gradient-to-br from-primary/15 via-accent/60 to-chart-1/10 p-1.5">
        <CardContent className="bg-card/90 backdrop-blur-xl rounded-[calc(var(--radius)-6px)] p-5 sm:p-7">
          <div className="flex flex-col items-center text-center">
            {/* Animated Progress Ring - responsive sizing */}
            <AnimatedProgressRing 
              progress={gestationalAge.progress} 
              size={typeof window !== 'undefined' && window.innerWidth < 375 ? 140 : 160} 
              strokeWidth={10}
              animationDuration={1200}
            >
              <div className="text-center">
                <span className="text-3xl sm:text-4xl font-bold text-foreground">
                  {gestationalAge.weeks}
                </span>
                <span className="text-base sm:text-lg text-muted-foreground ml-1">weeks</span>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                  + {gestationalAge.days} day{gestationalAge.days !== 1 ? "s" : ""}
                </p>
              </div>
            </AnimatedProgressRing>

            {/* Trimester badge */}
            <div className="mt-4 sm:mt-5 inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-primary/15 to-accent/40 text-primary text-xs sm:text-sm font-semibold shadow-sm animate-fade-in">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {gestationalAge.trimesterName}
            </div>

            {/* Weekly affirmation */}
            <div className="mt-3 sm:mt-4 flex items-center gap-2 text-sm text-primary/80">
              <Heart className="h-3.5 w-3.5" />
              <span className="italic">{affirmation}</span>
            </div>

            {/* Milestone message */}
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-foreground font-medium animate-fade-in px-2 leading-relaxed">
              {milestone}
            </p>

            {/* Due date info */}
            <div className="mt-4 sm:mt-5 flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground bg-accent/40 rounded-2xl px-5 py-3">
              <div className="text-center">
                <p className="font-bold text-foreground text-base sm:text-lg">{daysRemaining}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">days to go</p>
              </div>
              <div className="h-8 sm:h-10 w-px bg-border/50" />
              <div className="text-center">
                <p className="font-bold text-foreground text-base sm:text-lg">
                  {format(new Date(profile.dueDate), "MMM d")}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">due date</p>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}