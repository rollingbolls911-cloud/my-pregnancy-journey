import { NavLink } from "react-router-dom";
import {
  Home,
  Activity,
  Heart,
  BookHeart,
  Camera,
  CalendarCheck,
  Settings,
  Flower2,
  ListTodo,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePregnancy } from "@/contexts/PregnancyContext";

const navItems = [
  { path: "/home", icon: Home, label: "Home" },
  { path: "/tasks", icon: ListTodo, label: "Tasks" },
  { path: "/tracker", icon: Activity, label: "Tracker" },
  { path: "/guidance", icon: Heart, label: "Guidance" },
  { path: "/journal", icon: BookHeart, label: "Journal" },
  { path: "/photos", icon: Camera, label: "Photos" },
  { path: "/appointments", icon: CalendarCheck, label: "Appointments" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export function DesktopSidebar() {
  const { profile } = usePregnancy();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-border/30 bg-card/70 backdrop-blur-2xl shadow-xl">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border/30">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-primary shadow-md">
          <Flower2 className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-semibold text-foreground">Bloom</h1>
          <p className="text-xs text-muted-foreground">Pregnancy Tracker</p>
        </div>
      </div>

      {/* User greeting */}
      {profile && (
        <div className="px-6 py-4 border-b border-border/30">
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <p className="font-semibold text-foreground">{profile.name}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all duration-200",
                isActive
                  ? "bg-primary/15 text-primary font-semibold shadow-sm"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" strokeWidth={1.5} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border/30">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-accent/50 rounded-xl py-2 px-3">
          <span>🔒</span>
          <span>Your data stays private</span>
        </div>
      </div>
    </aside>
  );
}
