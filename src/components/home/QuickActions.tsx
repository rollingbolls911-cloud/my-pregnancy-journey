import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, PenLine, Calendar, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  {
    icon: Activity,
    label: "Check-in",
    description: "Log today",
    path: "/tracker",
    color: "bg-primary/15 text-primary",
    iconBg: "from-primary/20 to-primary/5",
  },
  {
    icon: PenLine,
    label: "Journal",
    description: "Write entry",
    path: "/journal",
    color: "bg-accent text-accent-foreground",
    iconBg: "from-accent to-accent/50",
  },
  {
    icon: Calendar,
    label: "Appointments",
    description: "View upcoming",
    path: "/appointments",
    color: "bg-chart-1/15 text-chart-1",
    iconBg: "from-chart-1/20 to-chart-1/5",
  },
  {
    icon: Heart,
    label: "Guidance",
    description: "Tips & care",
    path: "/guidance",
    color: "bg-chart-2/15 text-chart-2",
    iconBg: "from-chart-2/20 to-chart-2/5",
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {actions.map((action) => (
        <Link key={action.path} to={action.path}>
          <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] touch-manipulation border-border/30">
            <CardContent className="p-4 sm:p-5">
              <div
                className={cn(
                  "h-10 w-10 sm:h-12 sm:w-12 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 bg-gradient-to-br shadow-sm",
                  action.iconBg
                )}
              >
                <action.icon className={cn("h-5 w-5 sm:h-6 sm:w-6", action.color.split(" ")[1])} strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-foreground text-sm sm:text-base">{action.label}</h3>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">{action.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
