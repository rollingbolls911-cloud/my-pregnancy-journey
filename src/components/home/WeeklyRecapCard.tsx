import { Card, CardContent } from "@/components/ui/card";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { getDailyLogs, getUpcomingAppointments, getAppointments } from "@/lib/storage";
import { getMemoriesForWeek } from "@/lib/memories";
import { 
  CalendarCheck, 
  Heart, 
  ClipboardCheck, 
  Sparkles,
  ChevronRight 
} from "lucide-react";
import { Link } from "react-router-dom";
import { format, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";

export function WeeklyRecapCard() {
  const { gestationalAge, profile } = usePregnancy();
  
  if (!gestationalAge || !profile) return null;

  const week = gestationalAge.weeks;
  
  // Calculate the date range for this gestational week
  const lmpDate = new Date(profile.lmpDate);
  const weekStartDate = new Date(lmpDate);
  weekStartDate.setDate(weekStartDate.getDate() + (week * 7));
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setDate(weekEndDate.getDate() + 6);

  // Get memories for this week
  const memories = getMemoriesForWeek(week);
  
  // Get check-ins for this week
  const allLogs = getDailyLogs();
  const weekLogs = allLogs.filter(log => {
    const logDate = new Date(log.date);
    return isWithinInterval(logDate, { start: weekStartDate, end: weekEndDate });
  });

  // Get appointments for this week
  const allAppointments = getAppointments();
  const weekAppointments = allAppointments.filter(apt => {
    const aptDate = new Date(apt.datetime);
    return isWithinInterval(aptDate, { start: weekStartDate, end: weekEndDate });
  });

  // Only show if there's something to recap
  const hasContent = memories.length > 0 || weekLogs.length > 0 || weekAppointments.length > 0;
  
  if (!hasContent) return null;

  const stats = [
    {
      icon: ClipboardCheck,
      count: weekLogs.length,
      label: weekLogs.length === 1 ? "check-in" : "check-ins",
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      icon: Heart,
      count: memories.length,
      label: memories.length === 1 ? "memory" : "memories",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: CalendarCheck,
      count: weekAppointments.length,
      label: weekAppointments.length === 1 ? "appointment" : "appointments",
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
  ].filter(stat => stat.count > 0);

  return (
    <Card className="border-border/30 bg-gradient-to-br from-accent/30 to-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Week {week} Recap
          </h3>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{stat.count}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Show snippet of latest memory */}
        {memories.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/30">
            <p className="text-xs text-muted-foreground mb-1">Latest memory:</p>
            <p className="text-sm text-foreground italic line-clamp-2">
              "{memories[0].content}"
            </p>
          </div>
        )}

        <Link 
          to="/journal" 
          className="mt-3 flex items-center justify-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
        >
          View all memories
          <ChevronRight className="h-3 w-3" />
        </Link>
      </CardContent>
    </Card>
  );
}
