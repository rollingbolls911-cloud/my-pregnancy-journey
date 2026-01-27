import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { MOODS, SYMPTOMS, ENERGY_LEVELS } from "@/lib/pregnancy";
import {
  saveDailyLog,
  getDailyLogByDate,
  DailyLog,
  generateId,
} from "@/lib/storage";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function Tracker() {
  const { gestationalAge } = usePregnancy();
  const today = format(new Date(), "yyyy-MM-dd");

  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<number | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<
    Array<{ symptomId: string; severity: number }>
  >([]);
  const [notes, setNotes] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

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
    const existing = selectedSymptoms.find((s) => s.symptomId === symptomId);
    if (existing) {
      // Cycle through severity 1-3, then remove
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

  const handleSave = () => {
    const moodData = selectedMood
      ? MOODS.find((m) => m.value === selectedMood)
      : undefined;
    const energyData = selectedEnergy
      ? ENERGY_LEVELS.find((e) => e.value === selectedEnergy)
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
    toast.success("Check-in saved!", {
      description: "Your daily log has been recorded.",
    });
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
      <div className="px-4 py-6 md:px-8 md:py-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Daily Check-in</h1>
          <p className="text-muted-foreground">
            {format(new Date(), "EEEE, MMMM d")} · Week {gestationalAge.weeks}, Day{" "}
            {gestationalAge.days}
          </p>
        </div>

        {/* Mood */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">How are you feeling?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between gap-2">
              {MOODS.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-1 p-3 rounded-lg transition-all",
                    selectedMood === mood.value
                      ? "bg-primary/10 ring-2 ring-primary"
                      : "bg-muted/50 hover:bg-muted"
                  )}
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-xs text-muted-foreground">{mood.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Energy */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Energy level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {ENERGY_LEVELS.map((energy) => (
                <button
                  key={energy.value}
                  onClick={() => setSelectedEnergy(energy.value)}
                  className={cn(
                    "flex-1 py-3 rounded-lg text-sm font-medium transition-all",
                    selectedEnergy === energy.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                >
                  {energy.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Symptoms */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Any symptoms today?</CardTitle>
            <p className="text-sm text-muted-foreground">Tap to add, tap again to increase severity</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {SYMPTOMS.map((symptom) => {
                const severity = getSymptomSeverity(symptom.id);
                return (
                  <button
                    key={symptom.id}
                    onClick={() => toggleSymptom(symptom.id)}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-lg text-left transition-all",
                      severity > 0
                        ? severity === 1
                          ? "bg-chart-1/20 ring-1 ring-chart-1"
                          : severity === 2
                          ? "bg-chart-4/30 ring-1 ring-chart-4"
                          : "bg-destructive/20 ring-1 ring-destructive"
                        : "bg-muted/50 hover:bg-muted"
                    )}
                  >
                    <span className="text-lg">{symptom.icon}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-foreground">{symptom.label}</span>
                        {severity > 0 && (
                        <div className="flex gap-0.5 mt-1">
                          {[1, 2, 3].map((level) => (
                            <div
                              key={level}
                              className={cn(
                                "h-1.5 w-4 rounded-full",
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

        {/* Notes */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Notes (optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How was your day? Anything you want to remember?"
              className="min-h-[100px] resize-none"
            />
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button onClick={handleSave} className="w-full h-12 text-lg" size="lg">
          <Sparkles className="h-5 w-5 mr-2" />
          Save Check-in
        </Button>
      </div>
    </AppLayout>
  );
}
