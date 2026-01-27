import { Card, CardContent } from "@/components/ui/card";
import { ProgressRing } from "./ProgressRing";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { getWeekMilestone, formatGestationalAge } from "@/lib/pregnancy";
import { format } from "date-fns";
import { Sparkles } from "lucide-react";

export function TodayCard() {
  const { gestationalAge, daysRemaining, profile } = usePregnancy();

  if (!gestationalAge || !profile) return null;

  const milestone = getWeekMilestone(gestationalAge.weeks);

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <div className="bg-gradient-to-br from-primary/10 via-accent to-primary/5 p-1">
        <CardContent className="bg-card rounded-[calc(var(--radius)-4px)] p-6">
          <div className="flex flex-col items-center text-center">
            {/* Progress Ring */}
            <ProgressRing progress={gestationalAge.progress} size={180} strokeWidth={12}>
              <div className="text-center">
                <span className="text-4xl font-bold text-foreground">
                  {gestationalAge.weeks}
                </span>
                <span className="text-lg text-muted-foreground ml-1">weeks</span>
                <p className="text-sm text-muted-foreground mt-1">
                  + {gestationalAge.days} day{gestationalAge.days !== 1 ? "s" : ""}
                </p>
              </div>
            </ProgressRing>

            {/* Trimester badge */}
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              {gestationalAge.trimesterName}
            </div>

            {/* Milestone message */}
            <p className="mt-4 text-lg text-foreground font-medium">
              {milestone}
            </p>

            {/* Due date info */}
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="text-center">
                <p className="font-semibold text-foreground">{daysRemaining}</p>
                <p>days to go</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="font-semibold text-foreground">
                  {format(new Date(profile.dueDate), "MMM d")}
                </p>
                <p>due date</p>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
