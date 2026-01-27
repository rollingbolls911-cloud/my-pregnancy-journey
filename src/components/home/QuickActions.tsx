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
    color: "bg-primary/10 text-primary",
  },
  {
    icon: PenLine,
    label: "Journal",
    description: "Write entry",
    path: "/journal",
    color: "bg-accent text-accent-foreground",
  },
  {
    icon: Calendar,
    label: "Appointments",
    description: "View upcoming",
    path: "/appointments",
    color: "bg-chart-1/10 text-chart-1",
  },
  {
    icon: Heart,
    label: "Guidance",
    description: "Tips & care",
    path: "/guidance",
    color: "bg-chart-2/10 text-chart-2",
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3">
      {actions.map((action) => (
        <Link key={action.path} to={action.path}>
          <Card className="h-full transition-all hover:shadow-md active:scale-[0.98] touch-manipulation">
            <CardContent className="p-3 sm:p-4">
              <div
                className={cn(
                  "h-9 w-9 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center mb-2 sm:mb-3",
                  action.color
                )}
              >
                <action.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <h3 className="font-medium text-foreground text-sm sm:text-base">{action.label}</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground">{action.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
