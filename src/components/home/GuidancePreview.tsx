import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { getTrimesterGuidance } from "@/lib/pregnancy";
import { ArrowRight, Check, AlertTriangle, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export function GuidancePreview() {
  const { gestationalAge } = usePregnancy();

  if (!gestationalAge) return null;

  const guidance = getTrimesterGuidance(gestationalAge.trimester);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">This Week's Guidance</CardTitle>
        <Link to="/guidance">
          <Button variant="ghost" size="sm" className="text-primary">
            View all
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Advice */}
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Check className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground">Advice</h4>
            <p className="text-sm text-muted-foreground">{guidance.advice[0]}</p>
          </div>
        </div>

        {/* Avoid */}
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground">Be Careful</h4>
            <p className="text-sm text-muted-foreground">{guidance.avoid[0]}</p>
          </div>
        </div>

        {/* Care */}
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
            <Heart className="h-4 w-4 text-accent-foreground" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground">Self-Care</h4>
            <p className="text-sm text-muted-foreground">{guidance.care[0]}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
