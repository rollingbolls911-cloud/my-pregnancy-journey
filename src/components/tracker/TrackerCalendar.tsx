import { useState, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePregnancy } from "@/contexts/PregnancyContext";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addWeeks,
  subWeeks,
  isSameDay,
  isToday,
  differenceInDays,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDailyLogs } from "@/lib/storage";
import { getMemoryDates } from "@/lib/memories";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { hapticFeedback } from "@/lib/haptics";

interface TrackerCalendarProps {
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date | null;
}

export function TrackerCalendar({ onDateSelect, selectedDate }: TrackerCalendarProps) {
  const { profile } = usePregnancy();
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 0 })
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<"left" | "right" | null>(null);

  const dailyLogs = getDailyLogs();
  const memoryDates = getMemoryDates();

  const isHapticsEnabled = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("bloom-haptics") !== "false";
    }
    return true;
  };

  const weekDays = useMemo(() => {
    return eachDayOfInterval({
      start: currentWeekStart,
      end: endOfWeek(currentWeekStart, { weekStartsOn: 0 }),
    });
  }, [currentWeekStart]);

  const goToPreviousWeek = useCallback(() => {
    setTransitionDirection("right");
    setIsTransitioning(true);
    if (isHapticsEnabled()) hapticFeedback("light");
    
    setTimeout(() => {
      setCurrentWeekStart(subWeeks(currentWeekStart, 1));
      setIsTransitioning(false);
      setTransitionDirection(null);
    }, 150);
  }, [currentWeekStart]);

  const goToNextWeek = useCallback(() => {
    setTransitionDirection("left");
    setIsTransitioning(true);
    if (isHapticsEnabled()) hapticFeedback("light");
    
    setTimeout(() => {
      setCurrentWeekStart(addWeeks(currentWeekStart, 1));
      setIsTransitioning(false);
      setTransitionDirection(null);
    }, 150);
  }, [currentWeekStart]);

  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: goToNextWeek,
    onSwipeRight: goToPreviousWeek,
  });

  const getLogForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return dailyLogs.find((log) => log.date === dateStr);
  };

  const hasMemoryForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return memoryDates.has(dateStr);
  };

  const getGestationalAgeForDate = (date: Date) => {
    if (!profile?.lmpDate) return null;
    const lmpDate = new Date(profile.lmpDate);
    const totalDays = differenceInDays(date, lmpDate);
    if (totalDays < 0) return null;
    return {
      weeks: Math.floor(totalDays / 7),
      days: totalDays % 7,
    };
  };

  const currentWeekGA = getGestationalAgeForDate(weekDays[0]);

  return (
    <Card className="mb-3 sm:mb-4">
      <CardContent className="p-3 sm:p-4">
        {/* Week header */}
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPreviousWeek}
            className="h-8 w-8 touch-manipulation"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-center flex-1">
            <p className="font-medium text-foreground text-sm">
              {format(currentWeekStart, "MMM d")} - {format(endOfWeek(currentWeekStart, { weekStartsOn: 0 }), "MMM d")}
            </p>
            {currentWeekGA && (
              <p className="text-xs text-primary">Week {currentWeekGA.weeks}</p>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextWeek}
            className="h-8 w-8 touch-manipulation"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
            <div key={idx} className="text-center text-[10px] font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Week grid */}
        <div
          {...swipeHandlers}
          className={cn(
            "grid grid-cols-7 gap-1 transition-all duration-150",
            isTransitioning && transitionDirection === "left" && "translate-x-[-10px] opacity-50",
            isTransitioning && transitionDirection === "right" && "translate-x-[10px] opacity-50"
          )}
        >
          {weekDays.map((day) => {
            const log = getLogForDate(day);
            const hasMemory = hasMemoryForDate(day);
            const isCurrentDay = isToday(day);
            const dueDate = profile ? new Date(profile.dueDate) : null;
            const isDueDate = dueDate && isSameDay(day, dueDate);
            const isSelected = selectedDate && isSameDay(day, selectedDate);

            return (
              <button
                key={day.toISOString()}
                onClick={() => {
                  onDateSelect?.(day);
                  if (isHapticsEnabled()) hapticFeedback("light");
                }}
                className={cn(
                  "aspect-square rounded-lg flex flex-col items-center justify-center transition-all touch-manipulation active:scale-95",
                  isCurrentDay && "ring-2 ring-primary bg-primary/10",
                  isDueDate && "ring-2 ring-chart-1 bg-chart-1/10",
                  (log || hasMemory) && !isCurrentDay && !isDueDate && "bg-primary/5",
                  isSelected && !isCurrentDay && !isDueDate && "ring-2 ring-secondary"
                )}
              >
                <span
                  className={cn(
                    "text-sm font-medium",
                    isCurrentDay && "text-primary",
                    isDueDate && "text-chart-1"
                  )}
                >
                  {format(day, "d")}
                </span>
                {/* Indicator dots - log (primary) and memory (pink/heart color) */}
                <div className="flex items-center gap-0.5 mt-0.5">
                  {log && (
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                  {hasMemory && (
                    <div className="h-1.5 w-1.5 rounded-full bg-chart-1" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-3 flex gap-4 justify-center text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Check-in</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-chart-1" />
            <span>Memory</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded ring-1 ring-primary" />
            <span>Today</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
