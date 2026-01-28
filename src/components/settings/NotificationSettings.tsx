import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Bell, Moon, Clock } from "lucide-react";
import { toast } from "sonner";
import { hapticFeedback } from "@/lib/haptics";
import {
  getNotificationPreferences,
  saveNotificationPreferences,
  requestNotificationPermission,
  startNotificationScheduler,
  stopNotificationScheduler,
  NotificationPreferences,
} from "@/lib/notifications";

export function NotificationSettings() {
  const [prefs, setPrefs] = useState<NotificationPreferences>(() => getNotificationPreferences());
  const [permissionGranted, setPermissionGranted] = useState<boolean>(
    typeof Notification !== "undefined" && Notification.permission === "granted"
  );

  const isHapticsEnabled = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("bloom-haptics") !== "false";
    }
    return true;
  };

  useEffect(() => {
    if (prefs.enabled && permissionGranted) {
      startNotificationScheduler();
    } else {
      stopNotificationScheduler();
    }
  }, [prefs.enabled, permissionGranted]);

  const handleEnableNotifications = async (enabled: boolean) => {
    if (isHapticsEnabled()) hapticFeedback("light");

    if (enabled) {
      const granted = await requestNotificationPermission();
      setPermissionGranted(granted);
      
      if (!granted) {
        toast.error("Please enable notifications in your browser settings");
        return;
      }
    }

    const newPrefs = { ...prefs, enabled };
    setPrefs(newPrefs);
    saveNotificationPreferences(newPrefs);
    
    if (enabled) {
      toast.success("Notifications enabled! You'll receive gentle reminders throughout the day.");
    } else {
      toast.success("Notifications disabled");
    }
  };

  const handleToggleSchedule = (scheduleId: string, enabled: boolean) => {
    if (isHapticsEnabled()) hapticFeedback("light");
    
    const newSchedules = prefs.schedules.map((s) =>
      s.id === scheduleId ? { ...s, enabled } : s
    );
    const newPrefs = { ...prefs, schedules: newSchedules };
    setPrefs(newPrefs);
    saveNotificationPreferences(newPrefs);
  };

  const handleToggleQuietHours = (enabled: boolean) => {
    if (isHapticsEnabled()) hapticFeedback("light");
    
    const newPrefs = { ...prefs, quietHoursEnabled: enabled };
    setPrefs(newPrefs);
    saveNotificationPreferences(newPrefs);
    
    toast.success(enabled ? "Quiet hours enabled" : "Quiet hours disabled");
  };

  const handleQuietHoursChange = (field: "quietHoursStart" | "quietHoursEnd", value: string) => {
    const newPrefs = { ...prefs, [field]: value };
    setPrefs(newPrefs);
    saveNotificationPreferences(newPrefs);
  };

  const sendTestNotification = () => {
    if (isHapticsEnabled()) hapticFeedback("medium");
    
    if (Notification.permission !== "granted") {
      toast.error("Please enable notifications first");
      return;
    }

    new Notification("Test from Bloom 🌸", {
      body: "Your notifications are working beautifully!",
      icon: "/favicon.ico",
    });
    
    toast.success("Test notification sent!");
  };

  const isSupported = typeof Notification !== "undefined";

  if (!isSupported) {
    return (
      <Card className="mb-3 sm:mb-4">
        <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-2 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            Notifications
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Notifications are not supported in this browser
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mb-3 sm:mb-4">
      <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-2 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          Notifications
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Gentle reminders throughout your day
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6 space-y-4">
        {/* Master toggle */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Label className="text-sm font-medium">Enable notifications</Label>
            <p className="text-xs text-muted-foreground">
              Receive caring reminders for water, rest, and check-ins
            </p>
          </div>
          <Switch
            checked={prefs.enabled}
            onCheckedChange={handleEnableNotifications}
          />
        </div>

        {prefs.enabled && (
          <>
            <Separator />

            {/* Individual schedules */}
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                Reminder Schedule
              </h4>
              
              {prefs.schedules.map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between gap-3 py-1">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                        {schedule.time}
                      </span>
                      <span className="text-sm truncate">{schedule.title}</span>
                    </div>
                  </div>
                  <Switch
                    checked={schedule.enabled}
                    onCheckedChange={(enabled) => handleToggleSchedule(schedule.id, enabled)}
                  />
                </div>
              ))}
            </div>

            <Separator />

            {/* Quiet hours */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    <Moon className="h-3.5 w-3.5" />
                    Quiet Hours
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    No notifications during sleep time
                  </p>
                </div>
                <Switch
                  checked={prefs.quietHoursEnabled}
                  onCheckedChange={handleToggleQuietHours}
                />
              </div>

              {prefs.quietHoursEnabled && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">From</span>
                  <input
                    type="time"
                    value={prefs.quietHoursStart}
                    onChange={(e) => handleQuietHoursChange("quietHoursStart", e.target.value)}
                    className="bg-muted border border-border rounded px-2 py-1 text-sm"
                  />
                  <span className="text-muted-foreground">to</span>
                  <input
                    type="time"
                    value={prefs.quietHoursEnd}
                    onChange={(e) => handleQuietHoursChange("quietHoursEnd", e.target.value)}
                    className="bg-muted border border-border rounded px-2 py-1 text-sm"
                  />
                </div>
              )}
            </div>

            <Separator />

            {/* Test button */}
            <Button
              variant="outline"
              size="sm"
              onClick={sendTestNotification}
              className="w-full"
            >
              <Bell className="h-4 w-4 mr-2" />
              Send Test Notification
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
