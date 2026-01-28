import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { DesktopSidebar } from "./DesktopSidebar";
import { DecorativeBlobs } from "./DecorativeBlobs";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-background relative">
      <DecorativeBlobs />
      <DesktopSidebar />
      
      {/* Main content */}
      <main className="md:pl-64 relative z-10">
        <div className="min-h-screen min-h-[100dvh] pb-[calc(60px+env(safe-area-inset-bottom))] md:pb-0">
          {children}
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
}
