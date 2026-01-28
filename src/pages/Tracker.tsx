import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedSection } from "@/components/ui/animated-section";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { SYMPTOMS } from "@/lib/pregnancy";
import { defaultMoodOptions, defaultEnergyOptions } from "@/lib/comfort";
import {
  saveDailyLog,
  getDailyLogByDate,
  DailyLog,
} from "@/lib/storage";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Sparkles, SkipForward } from "lucide-react";
import { toast } from "sonner";
import { hapticFeedback } from "@/lib/haptics";
import { celebrate } from "@/lib/celebrations";
import { useNavigate } from "react-router-dom";

export default function Tracker() {
  const { gestationalAge, profile } = usePregnancy();
  const navigate = useNavigate();
  const today = format(new Date(), "yyyy-MM-dd");

  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<number | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<
    Array<{ symptomId: string; severity: number }>
  >([]);
  const [notes, setNotes] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isHapticsEnabled = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("bloom-haptics") !== "false";
    }
    return true;
  };

  // Load existing log for today
  useEffect(() => {
    const existingLog = getDailyLogByDate(today);
    if (existingLog) {
      setSelectedMood(existingLog.mood?.value || null);
      setSelectedEnergy(existingLog.energy?.value || null);
      setSelectedSymptoms(existingLog.symptoms || []);
      setNotes(existingLog.notes || "");
    }
    setIsLoaded(true);
  }, [today]);

  const toggleSymptom = (symptomId: string) => {
    if (isHapticsEnabled()) hapticFeedback("light");
    
    const existing = selectedSymptoms.find((s) => s.symptomId === symptomId);
    if (existing) {
      if (existing.severity >= 3) {
        setSelectedSymptoms(selectedSymptoms.filter((s) => s.symptomId !== symptomId));
      } else {
        setSelectedSymptoms(
          selectedSymptoms.map((s) =>
            s.symptomId === symptomId ? { ...s, severity: s.severity + 1 } : s
          )
        );
      }
    } else {
      setSelectedSymptoms([...selectedSymptoms, { symptomId, severity: 1 }]);
    }
  };

  const getSymptomSeverity = (symptomId: string): number => {
    return selectedSymptoms.find((s) => s.symptomId === symptomId)?.severity || 0;
  };

  const handleMoodSelect = (value: number) => {
    setSelectedMood(value);
    if (isHapticsEnabled()) hapticFeedback("light");
  };

  const handleEnergySelect = (value: number) => {
    setSelectedEnergy(value);
    if (isHapticsEnabled()) hapticFeedback("light");
  };

  const handleSave = (partial: boolean = false) => {
    setIsSaving(true);
    
    const moodData = selectedMood
      ? defaultMoodOptions.find((m) => m.value === selectedMood)
      : undefined;
    const energyData = selectedEnergy
      ? defaultEnergyOptions.find((e) => e.value === selectedEnergy)
      : undefined;

    const log: DailyLog = {
      id: `log_${today}`,
      date: today,
      mood: moodData ? { value: moodData.value, label: moodData.label } : undefined,
      energy: energyData
        ? { value: energyData.value, label: energyData.label }
        : undefined,
      symptoms: selectedSymptoms,
      notes: notes || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveDailyLog(log);
    
    // Haptic and celebration feedback
    if (isHapticsEnabled()) hapticFeedback("success");
    celebrate("small");
    
    const messages = partial 
      ? ["Saved what you have 💕", "That's enough for now ✨", "Partial save done 🌸"]
      : ["You're all checked in 💕", "Beautifully done ✨", "Logged with love 🌸"];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    toast.success(randomMessage, {
      description: "You did enough today.",
    });
    
    setIsSaving(false);
    navigate("/home");
  };

  const handleSkip = () => {
    if (isHapticsEnabled()) hapticFeedback("light");
    toast("It's okay to skip today 💕", { duration: 2000 });
    navigate("/home");
  };

  if (!gestationalAge) {
    return (
      <AppLayout>
        <div className="p-4 text-center">
          <p className="text-muted-foreground">Please complete your profile setup first.</p>
        </div>
      </AppLayout>
    );
  }

  if (!isLoaded) {
    return (
      <AppLayout>
        <div className="p-4 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-3 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8 max-w-2xl mx-auto">
        {/* Header with Skip option */}
        <AnimatedSection delay={0}>
          <div className="mb-4 sm:mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">How are you, {profile?.name}?</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                {format(new Date(), "EEEE, MMMM d")}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground"
            >
              <SkipForward className="h-4 w-4 mr-1" />
              Skip
            </Button>
          </div>
        </AnimatedSection>

        {/* Mood */}
        <AnimatedSection delay={100}>
          <Card className="mb-3 sm:mb-4">
            <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-base sm:text-lg">How are you feeling?</CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="flex justify-between gap-1.5 sm:gap-2">
                {defaultMoodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => handleMoodSelect(mood.value)}
                    className={cn(
                      "flex-1 flex flex-col items-center gap-0.5 sm:gap-1 p-2 sm:p-3 rounded-lg transition-all active:scale-95 touch-manipulation",
                      selectedMood === mood.value
                        ? "bg-primary/10 ring-2 ring-primary"
                        : "bg-muted/50 active:bg-muted"
                    )}
                  >
                    <span className="text-xl sm:text-2xl">{mood.emoji}</span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground">{mood.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Energy */}
        <AnimatedSection delay={200}>
          <Card className="mb-3 sm:mb-4">
            <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-base sm:text-lg">Energy level</CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="flex gap-1.5 sm:gap-2">
                {defaultEnergyOptions.map((energy) => (
                  <button
                    key={energy.value}
                    onClick={() => handleEnergySelect(energy.value)}
                    className={cn(
                      "flex-1 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all active:scale-95 touch-manipulation",
                      selectedEnergy === energy.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-muted-foreground active:bg-muted"
                    )}
                  >
                    {energy.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Symptoms */}
        <AnimatedSection delay={300}>
          <Card className="mb-3 sm:mb-4">
            <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-base sm:text-lg">Any symptoms today?</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">Tap to add, tap again to increase severity</p>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                {SYMPTOMS.map((symptom) => {
                  const severity = getSymptomSeverity(symptom.id);
                  return (
                    <button
                      key={symptom.id}
                      onClick={() => toggleSymptom(symptom.id)}
                      className={cn(
                        "flex items-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 rounded-lg text-left transition-all active:scale-95 touch-manipulation",
                        severity > 0
                          ? severity === 1
                            ? "bg-chart-1/20 ring-1 ring-chart-1"
                            : severity === 2
                            ? "bg-chart-4/30 ring-1 ring-chart-4"
                            : "bg-destructive/20 ring-1 ring-destructive"
                          : "bg-muted/50 active:bg-muted"
                      )}
                    >
                      <span className="text-base sm:text-lg">{symptom.icon}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs sm:text-sm font-medium text-foreground">{symptom.label}</span>
                        {severity > 0 && (
                          <div className="flex gap-0.5 mt-0.5 sm:mt-1">
                            {[1, 2, 3].map((level) => (
                              <div
                                key={level}
                                className={cn(
                                  "h-1 sm:h-1.5 w-3 sm:w-4 rounded-full",
                                  level <= severity
                                    ? severity === 1
                                      ? "bg-chart-1"
                                      : severity === 2
                                      ? "bg-chart-4"
                                      : "bg-destructive"
                                    : "bg-muted"
                                )}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Notes */}
        <AnimatedSection delay={400}>
          <Card className="mb-4 sm:mb-6">
            <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-base sm:text-lg">Notes (optional)</CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How was your day? Anything you want to remember?"
                className="min-h-[80px] sm:min-h-[100px] resize-none text-sm sm:text-base"
              />
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Save Buttons */}
        <AnimatedSection delay={500}>
          <div className="space-y-2">
            <Button 
              onClick={() => handleSave(false)} 
              className="w-full h-11 sm:h-12 text-base sm:text-lg active:scale-[0.98] transition-transform touch-manipulation" 
              size="lg"
              disabled={isSaving}
            >
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              {isSaving ? "Saving..." : "Save Check-in"}
            </Button>
            {(selectedMood || selectedEnergy || selectedSymptoms.length > 0 || notes) && (
              <Button
                variant="ghost"
                onClick={() => handleSave(true)}
                className="w-full text-muted-foreground"
                disabled={isSaving}
              >
                Save partial & continue later
              </Button>
            )}
          </div>
        </AnimatedSection>
      </div>
    </AppLayout>
  );
}
