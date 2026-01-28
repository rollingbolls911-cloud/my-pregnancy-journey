import { NavLink } from "react-router-dom";
import {
  Home,
  Calendar,
  Activity,
  Heart,
  BookHeart,
  Camera,
  CalendarCheck,
  Settings,
  Flower2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePregnancy } from "@/contexts/PregnancyContext";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/calendar", icon: Calendar, label: "Calendar" },
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
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-border bg-card">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Flower2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="font-semibold text-foreground">Bloom</h1>
          <p className="text-xs text-muted-foreground">Pregnancy Tracker</p>
        </div>
      </div>

      {/* User greeting */}
      {profile && (
        <div className="px-6 py-4 border-b border-border">
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <p className="font-medium text-foreground">{profile.name}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Your data stays private 🔒
        </p>
      </div>
    </aside>
  );
}
