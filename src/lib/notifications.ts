import { toast } from "sonner";

export interface NotificationSchedule {
  id: string;
  time: string; // HH:MM format
  title: string;
  body: string;
  enabled: boolean;
}

export interface NotificationPreferences {
  enabled: boolean;
  schedules: NotificationSchedule[];
  quietHoursEnabled: boolean;
  quietHoursStart: string; // HH:MM
  quietHoursEnd: string; // HH:MM
}

export const defaultNotificationSchedules: NotificationSchedule[] = [
  {
    id: "morning-water",
    time: "09:00",
    title: "Water + fruit time 💧🍎",
    body: "Good morning, Ayuni! Time for your water and a piece of fruit.",
    enabled: true,
  },
  {
    id: "afternoon-rest",
    time: "14:00",
    title: "Quick rest + small sip 🌸",
    body: "Take a gentle break. Rest your feet and have some water.",
    enabled: true,
  },
  {
    id: "evening-checkin",
    time: "20:30",
    title: "Daily check-in 📝",
    body: "How are you feeling today? Take a moment to log your mood and energy.",
    enabled: true,
  },
  {
    id: "night-journal",
    time: "21:30",
    title: "1-minute memory 💕",
    body: "What was one sweet moment from today? Jot it down in your journal.",
    enabled: true,
  },
];

const STORAGE_KEY = "bloom-notifications";

export function getNotificationPreferences(): NotificationPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load notification preferences:", e);
  }
  return {
    enabled: false,
    schedules: defaultNotificationSchedules,
    quietHoursEnabled: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
  };
}

export function saveNotificationPreferences(prefs: NotificationPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.error("Failed to save notification preferences:", e);
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    toast.error("Notifications are not supported in this browser");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission === "denied") {
    toast.error("Notification permission was denied. Please enable it in your browser settings.");
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
}

export function isInQuietHours(prefs: NotificationPreferences): boolean {
  if (!prefs.quietHoursEnabled) return false;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const [startHour, startMin] = prefs.quietHoursStart.split(":").map(Number);
  const [endHour, endMin] = prefs.quietHoursEnd.split(":").map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  // Handle overnight quiet hours (e.g., 22:00 to 08:00)
  if (startMinutes > endMinutes) {
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }
  
  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
}

export function showNotification(title: string, body: string): void {
  if (Notification.permission !== "granted") return;
  
  const prefs = getNotificationPreferences();
  if (isInQuietHours(prefs)) return;

  new Notification(title, {
    body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    tag: `bloom-${Date.now()}`,
  });
}

// Check if a scheduled notification should fire
function shouldFireNotification(schedule: NotificationSchedule): boolean {
  const now = new Date();
  const [hour, minute] = schedule.time.split(":").map(Number);
  
  return now.getHours() === hour && now.getMinutes() === minute;
}

let notificationInterval: number | null = null;

export function startNotificationScheduler(): void {
  if (notificationInterval) return;

  // Check every minute
  notificationInterval = window.setInterval(() => {
    const prefs = getNotificationPreferences();
    
    if (!prefs.enabled) return;
    if (Notification.permission !== "granted") return;
    if (isInQuietHours(prefs)) return;

    prefs.schedules.forEach((schedule) => {
      if (schedule.enabled && shouldFireNotification(schedule)) {
        showNotification(schedule.title, schedule.body);
      }
    });
  }, 60000); // Check every minute

  // Also check immediately
  const prefs = getNotificationPreferences();
  if (prefs.enabled && Notification.permission === "granted" && !isInQuietHours(prefs)) {
    prefs.schedules.forEach((schedule) => {
      if (schedule.enabled && shouldFireNotification(schedule)) {
        showNotification(schedule.title, schedule.body);
      }
    });
  }
}

export function stopNotificationScheduler(): void {
  if (notificationInterval) {
    clearInterval(notificationInterval);
    notificationInterval = null;
  }
}
