import { Card, CardContent } from "@/components/ui/card";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { ProgressRing } from "./ProgressRing";
import { Baby, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileCardProps {
  className?: string;
}

export function ProfileCard({ className }: ProfileCardProps) {
  const { profile, gestationalAge } = usePregnancy();

  if (!profile || !gestationalAge) return null;

  // Calculate progress percentage (40 weeks = 100%)
  const progressPercent = Math.min((gestationalAge.totalDays / 280) * 100, 100);
  const weeksComplete = gestationalAge.weeks;
  const totalWeeks = 40;

  return (
    <Card className={cn("border-border/30 shadow-lg overflow-hidden", className)}>
      <CardContent className="p-5">
        <div className="flex items-center gap-5">
          {/* Circle Progress */}
          <ProgressRing progress={progressPercent} size={100} strokeWidth={8}>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{weeksComplete}</p>
              <p className="text-xs text-muted-foreground">weeks</p>
            </div>
          </ProgressRing>

          {/* Name & info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground text-lg truncate">
                {profile.name}
              </h3>
              <div className="h-5 w-5 rounded-full bg-gradient-to-br from-primary to-chart-1 flex items-center justify-center">
                <Sparkles className="h-2.5 w-2.5 text-primary-foreground" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {gestationalAge.trimesterName}
            </p>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Week</p>
                <p className="font-semibold text-foreground">{gestationalAge.weeks}</p>
              </div>
              <div className="h-8 w-px bg-border/50" />
              <div>
                <p className="text-xs text-muted-foreground">Day</p>
                <p className="font-semibold text-foreground">{gestationalAge.days}</p>
              </div>
              <div className="h-8 w-px bg-border/50" />
              <div>
                <p className="text-xs text-muted-foreground">Progress</p>
                <p className="font-semibold text-primary">{Math.round(progressPercent)}%</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
