import { NavLink } from "react-router-dom";
import { Home, Calendar, Activity, BookHeart, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/calendar", icon: Calendar, label: "Calendar" },
  { path: "/tracker", icon: Activity, label: "Tracker" },
  { path: "/guidance", icon: Heart, label: "Guidance" },
  { path: "/journal", icon: BookHeart, label: "Journal" },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md md:hidden safe-area-bottom">
      <div className="flex items-center justify-around py-1.5 px-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-0.5 px-2 py-1.5 text-[10px] transition-all rounded-lg min-w-[56px] touch-manipulation",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:bg-muted/50"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-transform",
                    isActive && "scale-110"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={cn("leading-tight", isActive && "font-medium")}>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
