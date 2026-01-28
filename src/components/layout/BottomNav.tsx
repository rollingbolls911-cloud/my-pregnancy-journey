import { NavLink } from "react-router-dom";
import { Home, Activity, BookHeart, Camera, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/home", icon: Home, label: "Home" },
  { path: "/tasks", icon: ListTodo, label: "Tasks" },
  { path: "/tracker", icon: Activity, label: "Tracker" },
  { path: "/photos", icon: Camera, label: "Photos" },
  { path: "/journal", icon: BookHeart, label: "Journal" },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/30 bg-card/70 backdrop-blur-2xl md:hidden safe-area-bottom shadow-lg">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 px-3 py-2 text-[10px] transition-all rounded-2xl min-w-[60px] touch-manipulation",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground active:bg-accent/50"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-all duration-200",
                    isActive && "scale-110"
                  )}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
                <span className={cn("leading-tight", isActive && "font-semibold")}>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
