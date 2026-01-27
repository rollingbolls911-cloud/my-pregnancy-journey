import { useState, useMemo, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
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
  addDays,
  subDays,
  isSameDay,
  isToday,
  differenceInDays,
} from "date-fns";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDailyLogs } from "@/lib/storage";
import { getWeekMilestone } from "@/lib/pregnancy";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { hapticFeedback } from "@/lib/haptics";

export default function CalendarPage() {
  const { gestationalAge, profile } = usePregnancy();
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 0 })
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<"left" | "right" | null>(null);

  const dailyLogs = getDailyLogs();

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

  const goToToday = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }));
    setSelectedDate(new Date());
    if (isHapticsEnabled()) hapticFeedback("light");
  };

  // Swipe gesture for week navigation
  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: goToNextWeek,
    onSwipeRight: goToPreviousWeek,
  });

  // Day swipe for selected date
  const daySwipeHandlers = useSwipeGesture({
    onSwipeLeft: () => {
      if (selectedDate) {
        const nextDay = addDays(selectedDate, 1);
        setSelectedDate(nextDay);
        // If next day is in next week, navigate
        if (nextDay > endOfWeek(currentWeekStart, { weekStartsOn: 0 })) {
          goToNextWeek();
        }
        if (isHapticsEnabled()) hapticFeedback("light");
      }
    },
    onSwipeRight: () => {
      if (selectedDate) {
        const prevDay = subDays(selectedDate, 1);
        setSelectedDate(prevDay);
        // If prev day is in previous week, navigate
        if (prevDay < currentWeekStart) {
          goToPreviousWeek();
        }
        if (isHapticsEnabled()) hapticFeedback("light");
      }
    },
  });

  const getLogForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return dailyLogs.find((log) => log.date === dateStr);
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

  if (!gestationalAge || !profile) {
    return (
      <AppLayout>
        <div className="p-4 text-center">
          <p className="text-muted-foreground">Please complete your profile setup first.</p>
        </div>
      </AppLayout>
    );
  }

  const currentWeekGA = getGestationalAgeForDate(weekDays[0]);
  const milestone = currentWeekGA ? getWeekMilestone(currentWeekGA.weeks) : "";

  return (
    <AppLayout>
      <div className="px-3 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Track your pregnancy journey</p>
        </div>

        {/* Week Navigation */}
        <Card className="mb-3 sm:mb-4">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPreviousWeek}
                className="h-9 w-9 sm:h-10 sm:w-10 touch-manipulation"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>

              <div className="text-center flex-1 px-2">
                <p className="font-semibold text-foreground text-sm sm:text-base">
                  {format(currentWeekStart, "MMM d")} -{" "}
                  {format(endOfWeek(currentWeekStart, { weekStartsOn: 0 }), "MMM d, yyyy")}
                </p>
                {currentWeekGA && (
                  <p className="text-xs sm:text-sm text-primary font-medium">
                    Week {currentWeekGA.weeks}
                  </p>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={goToNextWeek}
                className="h-9 w-9 sm:h-10 sm:w-10 touch-manipulation"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="w-full h-9 sm:h-10 text-sm touch-manipulation"
            >
              Go to Today
            </Button>
          </CardContent>
        </Card>

        {/* Week Milestone */}
        {milestone && (
          <Card className="mb-3 sm:mb-4 bg-gradient-to-r from-primary/10 to-accent">
            <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <p className="text-foreground font-medium text-sm sm:text-base">{milestone}</p>
            </CardContent>
          </Card>
        )}

        {/* Week Grid Header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
            <div
              key={idx}
              className="text-center text-[10px] sm:text-xs font-medium text-muted-foreground py-1 sm:py-2"
            >
              <span className="hidden sm:inline">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][idx]}</span>
              <span className="sm:hidden">{day}</span>
            </div>
          ))}
        </div>

        {/* Swipeable Week Grid */}
        <div
          {...swipeHandlers}
          className={cn(
            "grid grid-cols-7 gap-1 sm:gap-2 transition-all duration-150",
            isTransitioning && transitionDirection === "left" && "translate-x-[-20px] opacity-50",
            isTransitioning && transitionDirection === "right" && "translate-x-[20px] opacity-50"
          )}
        >
          {weekDays.map((day) => {
            const log = getLogForDate(day);
            const dayGA = getGestationalAgeForDate(day);
            const isCurrentDay = isToday(day);
            const isPast = day < new Date() && !isCurrentDay;
            const isFuture = day > new Date();
            const dueDate = new Date(profile.dueDate);
            const isDueDate = isSameDay(day, dueDate);
            const isSelected = selectedDate && isSameDay(day, selectedDate);

            return (
              <Card
                key={day.toISOString()}
                onClick={() => {
                  setSelectedDate(day);
                  if (isHapticsEnabled()) hapticFeedback("light");
                }}
                className={cn(
                  "transition-all cursor-pointer active:scale-95 touch-manipulation",
                  isCurrentDay && "ring-2 ring-primary",
                  isDueDate && "ring-2 ring-chart-1 bg-chart-1/10",
                  log && "bg-primary/5",
                  isSelected && !isCurrentDay && !isDueDate && "ring-2 ring-secondary"
                )}
              >
                <CardContent className="p-1.5 sm:p-2 text-center">
                  <p
                    className={cn(
                      "text-base sm:text-lg font-semibold",
                      isCurrentDay && "text-primary",
                      isFuture && !isDueDate && "text-muted-foreground",
                      isDueDate && "text-chart-1"
                    )}
                  >
                    {format(day, "d")}
                  </p>
                  {dayGA && dayGA.weeks > 0 && (
                    <p className="text-[9px] sm:text-xs text-muted-foreground">
                      W{dayGA.weeks}D{dayGA.days}
                    </p>
                  )}
                  {log && (
                    <div className="mt-0.5 sm:mt-1 flex justify-center gap-0.5">
                      {log.mood && (
                        <span className="text-[10px] sm:text-xs">
                          {log.mood.value >= 4 ? "😊" : log.mood.value >= 3 ? "😐" : "😔"}
                        </span>
                      )}
                    </div>
                  )}
                  {isDueDate && (
                    <p className="text-[9px] sm:text-xs font-medium text-chart-1">EDD</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Selected Day Details */}
        {selectedDate && (
          <Card 
            className="mt-3 sm:mt-4 animate-fade-in"
            {...daySwipeHandlers}
          >
            <CardContent className="p-3 sm:p-4">
              <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                {format(selectedDate, "EEEE, MMMM d")}
              </h3>
              {(() => {
                const log = getLogForDate(selectedDate);
                const dayGA = getGestationalAgeForDate(selectedDate);
                
                return (
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                    {dayGA && (
                      <p className="text-muted-foreground">
                        Week {dayGA.weeks}, Day {dayGA.days}
                      </p>
                    )}
                    {log ? (
                      <div className="space-y-1">
                        {log.mood && (
                          <p>
                            Mood: {log.mood.label}
                          </p>
                        )}
                        {log.energy && (
                          <p>
                            Energy: {log.energy.label}
                          </p>
                        )}
                        {log.symptoms && log.symptoms.length > 0 && (
                          <p>
                            Symptoms: {log.symptoms.length} logged
                          </p>
                        )}
                        {log.notes && (
                          <p className="text-muted-foreground italic">
                            "{log.notes}"
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        No log for this day
                      </p>
                    )}
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
                      Swipe left/right to change day
                    </p>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}

        {/* Legend */}
        <div className="mt-4 sm:mt-6 flex flex-wrap gap-3 sm:gap-4 justify-center text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="h-3 w-3 sm:h-4 sm:w-4 rounded ring-2 ring-primary" />
            <span className="text-muted-foreground">Today</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="h-3 w-3 sm:h-4 sm:w-4 rounded bg-primary/5" />
            <span className="text-muted-foreground">Logged</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="h-3 w-3 sm:h-4 sm:w-4 rounded ring-2 ring-chart-1 bg-chart-1/10" />
            <span className="text-muted-foreground">Due Date</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
