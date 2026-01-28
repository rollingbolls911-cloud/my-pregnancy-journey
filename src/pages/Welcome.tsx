import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Flower2, Sparkles, Heart } from "lucide-react";
import { usePregnancy } from "@/contexts/PregnancyContext";

export default function Welcome() {
  const navigate = useNavigate();
  const { isSetupComplete } = usePregnancy();

  const handleEnter = () => {
    if (isSetupComplete) {
      navigate("/home");
    } else {
      navigate("/home"); // Will show setup if not complete
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/10 p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-32 right-10 w-48 h-48 rounded-full bg-chart-2/10 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-chart-4/10 blur-2xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto">
        {/* Illustrated logo/icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center backdrop-blur-sm border border-primary/20 shadow-lg">
            <Flower2 className="h-16 w-16 text-primary" />
          </div>
          {/* Floating decorations */}
          <div className="absolute -top-2 -right-2 p-2 rounded-full bg-chart-2/20 backdrop-blur-sm animate-pulse">
            <Sparkles className="h-4 w-4 text-chart-2" />
          </div>
          <div className="absolute -bottom-1 -left-3 p-2 rounded-full bg-chart-4/20 backdrop-blur-sm animate-pulse delay-300">
            <Heart className="h-4 w-4 text-chart-4" />
          </div>
        </div>

        {/* Title and subtitle */}
        <h1 className="text-4xl font-bold text-foreground mb-3 tracking-tight">
          Bloom
        </h1>
        <p className="text-lg text-muted-foreground mb-2">
          Your pregnancy companion
        </p>
        <p className="text-sm text-muted-foreground/70 mb-10 max-w-xs">
          Track your journey with care, privacy, and peace of mind
        </p>

        {/* Enter button */}
        <Button
          onClick={handleEnter}
          size="lg"
          className="h-14 px-12 text-lg rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <Flower2 className="h-5 w-5 mr-2" />
          Enter
        </Button>

        {/* Privacy note */}
        <p className="text-xs text-muted-foreground/60 mt-8 max-w-xs">
          All your data stays private on your device
        </p>
      </div>
    </div>
  );
}
