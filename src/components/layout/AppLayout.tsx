import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { DesktopSidebar } from "./DesktopSidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-background">
      <DesktopSidebar />
      
      {/* Main content */}
      <main className="md:pl-64">
        <div className="min-h-screen min-h-[100dvh] pb-[calc(60px+env(safe-area-inset-bottom))] md:pb-0">
          {children}
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
}
