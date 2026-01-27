import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { getTrimesterGuidance, RED_FLAG_SYMPTOMS } from "@/lib/pregnancy";
import { Check, AlertTriangle, Heart, AlertCircle, Phone } from "lucide-react";

export default function Guidance() {
  const { gestationalAge } = usePregnancy();
  const [activeTab, setActiveTab] = useState("advice");

  if (!gestationalAge) {
    return (
      <AppLayout>
        <div className="p-4 text-center">
          <p className="text-muted-foreground">Please complete your profile setup first.</p>
        </div>
      </AppLayout>
    );
  }

  const guidance = getTrimesterGuidance(gestationalAge.trimester);

  return (
    <AppLayout>
      <div className="px-4 py-6 md:px-8 md:py-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Guidance Hub</h1>
          <p className="text-muted-foreground">
            Week {gestationalAge.weeks} · {gestationalAge.trimesterName}
          </p>
        </div>

        {/* Disclaimer */}
        <Card className="mb-6 border-chart-5/30 bg-chart-5/5">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-chart-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              This information is for educational purposes only and is not a substitute for
              professional medical advice. Always consult your healthcare provider.
            </p>
          </CardContent>
        </Card>

        {/* Guidance Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="advice">Advice</TabsTrigger>
            <TabsTrigger value="avoid">Avoid</TabsTrigger>
            <TabsTrigger value="care">Care</TabsTrigger>
            <TabsTrigger value="emergency">⚠️</TabsTrigger>
          </TabsList>

          <TabsContent value="advice">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  What to Do
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {guidance.advice.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <p className="text-foreground">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="avoid">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  </div>
                  What to Avoid
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {guidance.avoid.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5"
                  >
                    <div className="h-6 w-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertTriangle className="h-3 w-3 text-destructive" />
                    </div>
                    <p className="text-foreground">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="care">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                    <Heart className="h-4 w-4 text-accent-foreground" />
                  </div>
                  Self-Care Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {guidance.care.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-accent/50"
                  >
                    <div className="h-6 w-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Heart className="h-3 w-3 text-accent-foreground" />
                    </div>
                    <p className="text-foreground">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emergency">
            <Card className="border-destructive/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-destructive">
                  <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  </div>
                  When to Seek Help Immediately
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  If you experience any of these symptoms, contact your healthcare provider or
                  go to the emergency room immediately:
                </p>
                
                <div className="space-y-2">
                  {RED_FLAG_SYMPTOMS.map((symptom, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10"
                    >
                      <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                      <p className="text-foreground font-medium">{symptom}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">
                    Trust your instincts. If something feels wrong, seek care.
                  </p>
                  <Button variant="destructive" className="w-full" size="lg">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Emergency Services
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    This button is for reference only. Please dial your local emergency number.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
