import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { PregnancyProvider } from "./contexts/PregnancyContext";
import { getNotificationPreferences, startNotificationScheduler } from "./lib/notifications";
import Welcome from "./pages/Welcome";
import Index from "./pages/Index";
import Tasks from "./pages/Tasks";
import Tracker from "./pages/Tracker";
import Guidance from "./pages/Guidance";
import Journal from "./pages/Journal";
import Photos from "./pages/Photos";
import Appointments from "./pages/Appointments";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Start notification scheduler on app load if enabled
  useEffect(() => {
    const prefs = getNotificationPreferences();
    if (prefs.enabled && typeof Notification !== "undefined" && Notification.permission === "granted") {
      startNotificationScheduler();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <PregnancyProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/home" element={<Index />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/tracker" element={<Tracker />} />
                <Route path="/guidance" element={<Guidance />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/photos" element={<Photos />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/settings" element={<Settings />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </PregnancyProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
