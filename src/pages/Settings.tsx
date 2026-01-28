import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { useAuth } from "@/contexts/AuthContext";
import { exportAllData, clearAllData } from "@/lib/storage";
import { format } from "date-fns";
import {
  User,
  Calendar,
  Download,
  Trash2,
  Shield,
  AlertCircle,
  Flower2,
  Moon,
  Sun,
  Monitor,
  Vibrate,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { isHapticsSupported } from "@/lib/haptics";

export default function Settings() {
  const { profile, resetProfile } = usePregnancy();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [hapticsEnabled, setHapticsEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("bloom-haptics") !== "false";
    }
    return true;
  });

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bloom-backup-${format(new Date(), "yyyy-MM-dd")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully!");
  };

  const handleClearData = () => {
    clearAllData();
    resetProfile();
    toast.success("All data cleared");
  };

  const handleHapticsToggle = (enabled: boolean) => {
    setHapticsEnabled(enabled);
    localStorage.setItem("bloom-haptics", String(enabled));
    if (enabled && isHapticsSupported()) {
      navigator.vibrate(10);
    }
    toast.success(enabled ? "Haptic feedback enabled" : "Haptic feedback disabled");
  };

  return (
    <AppLayout>
      <div className="px-3 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Manage your app preferences</p>
        </div>

        {/* Profile */}
        {profile && (
          <Card className="mb-3 sm:mb-4">
            <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-2 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-muted-foreground text-sm">Name</Label>
                <span className="font-medium text-foreground text-sm sm:text-base">{profile.name}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label className="text-muted-foreground text-sm">Due Date</Label>
                <span className="font-medium text-foreground text-sm sm:text-base">
                  {format(new Date(profile.dueDate), "MMM d, yyyy")}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label className="text-muted-foreground text-sm">Started Tracking</Label>
                <span className="font-medium text-foreground text-sm sm:text-base">
                  {format(new Date(profile.createdAt), "MMM d, yyyy")}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account */}
        {user && (
          <Card className="mb-3 sm:mb-4">
            <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-2 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                Account
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Signed in as {user.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="w-full h-10 sm:h-11 text-sm touch-manipulation"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Appearance */}
        <Card className="mb-3 sm:mb-4">
          <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-2 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
              Appearance
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Choose your preferred color theme
            </CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="flex gap-1.5 sm:gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("light")}
                className="flex-1 h-9 sm:h-10 text-xs sm:text-sm touch-manipulation"
              >
                <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("dark")}
                className="flex-1 h-9 sm:h-10 text-xs sm:text-sm touch-manipulation"
              >
                <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                Dark
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("system")}
                className="flex-1 h-9 sm:h-10 text-xs sm:text-sm touch-manipulation"
              >
                <Monitor className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                Auto
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Haptics */}
        {isHapticsSupported() && (
          <Card className="mb-3 sm:mb-4">
            <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-2 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Vibrate className="h-4 w-4 sm:h-5 sm:w-5" />
                Haptic Feedback
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Vibration on actions (mobile only)
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <Label className="text-sm">Enable vibrations</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Subtle feedback on saves and actions
                  </p>
                </div>
                <Switch 
                  checked={hapticsEnabled} 
                  onCheckedChange={handleHapticsToggle}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Privacy */}
        <Card className="mb-3 sm:mb-4">
          <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-2 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
              Privacy
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Your data is stored locally on your device
            </CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6 space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Local Storage Only</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  All data stays on your device
                </p>
              </div>
              <Switch checked disabled />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="mb-3 sm:mb-4">
          <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-2 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Download className="h-4 w-4 sm:h-5 sm:w-5" />
              Data Export
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Download your data as a backup file
            </CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <Button onClick={handleExport} variant="outline" className="w-full h-10 sm:h-11 text-sm touch-manipulation">
              <Download className="h-4 w-4 mr-2" />
              Export All Data (JSON)
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="mb-3 sm:mb-4 border-destructive/30">
          <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-2 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-destructive">
              <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Irreversible actions - please be careful
            </CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full h-10 sm:h-11 text-sm touch-manipulation">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="mx-4 max-w-[calc(100vw-2rem)] sm:max-w-lg">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-base sm:text-lg">Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="text-xs sm:text-sm">
                    This will permanently delete all your data including your profile,
                    daily logs, journal entries, and appointments. This action cannot
                    be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                  <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearData}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Yes, delete everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-2 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Flower2 className="h-4 w-4 sm:h-5 sm:w-5" />
              About Bloom
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6 space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Bloom is a private pregnancy tracker designed to help you monitor
              your journey with care and confidence.
            </p>

            <div className="p-3 sm:p-4 rounded-lg bg-chart-5/10 border border-chart-5/30">
              <div className="flex gap-2 sm:gap-3">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-chart-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground text-xs sm:text-sm mb-1">
                    Medical Disclaimer
                  </h4>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    This app is for informational purposes only and is not a
                    substitute for professional medical advice, diagnosis, or
                    treatment. Always seek the advice of your physician or other
                    qualified health provider with any questions you may have
                    regarding a medical condition.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[10px] sm:text-xs text-center text-muted-foreground pt-2">
              Made with 💕 for expecting parents
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
