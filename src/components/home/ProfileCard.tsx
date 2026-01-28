import { Card, CardContent } from "@/components/ui/card";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { Progress } from "@/components/ui/progress";
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
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/40 to-chart-1/20 flex items-center justify-center shadow-md overflow-hidden">
              <Baby className="h-8 w-8 text-primary" strokeWidth={1.5} />
            </div>
            {/* Status indicator */}
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-primary to-chart-1 border-2 border-card flex items-center justify-center">
              <Sparkles className="h-2.5 w-2.5 text-primary-foreground" />
            </div>
          </div>

          {/* Name & info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-lg truncate">
              {profile.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {gestationalAge.trimesterName}
            </p>
          </div>
        </div>

        {/* Progress section */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Pregnancy Progress</span>
            <span className="text-sm font-semibold text-primary">
              {weeksComplete} / {totalWeeks} weeks
            </span>
          </div>
          
          {/* Custom styled progress bar */}
          <div className="relative">
            <div className="h-3 w-full rounded-full bg-accent/60 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-primary via-chart-1 to-chart-2 transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            
            {/* Progress markers */}
            <div className="flex justify-between mt-2 px-0.5">
              <span className="text-[10px] text-muted-foreground">1st</span>
              <span className="text-[10px] text-muted-foreground">2nd</span>
              <span className="text-[10px] text-muted-foreground">3rd</span>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-4 flex items-center justify-between bg-accent/40 rounded-xl p-3">
          <div className="text-center flex-1">
            <p className="text-xs text-muted-foreground">Week</p>
            <p className="font-bold text-foreground">{gestationalAge.weeks}</p>
          </div>
          <div className="h-8 w-px bg-border/50" />
          <div className="text-center flex-1">
            <p className="text-xs text-muted-foreground">Day</p>
            <p className="font-bold text-foreground">{gestationalAge.days}</p>
          </div>
          <div className="h-8 w-px bg-border/50" />
          <div className="text-center flex-1">
            <p className="text-xs text-muted-foreground">Progress</p>
            <p className="font-bold text-primary">{Math.round(progressPercent)}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
