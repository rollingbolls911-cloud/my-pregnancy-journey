import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Flower2 } from "lucide-react";
import { usePregnancy } from "@/contexts/PregnancyContext";
import welcomeIllustration from "@/assets/welcome-illustration.png";

export default function Welcome() {
  const navigate = useNavigate();
  const { isSetupComplete } = usePregnancy();

  const handleEnter = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-b from-background via-background to-primary/5 p-6 relative overflow-hidden">
      {/* Soft gradient overlays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-chart-2/5 to-transparent" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm mx-auto">
        {/* Illustrated graphic */}
        <div className="relative mb-6 w-64 h-64 sm:w-72 sm:h-72">
          <img 
            src={welcomeIllustration} 
            alt="Pregnancy journey illustration" 
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>

        {/* Title and subtitle */}
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-3 tracking-tight">
          Bloom
        </h1>
        <p className="text-lg text-muted-foreground mb-2">
          Your care companion 💕
        </p>
        <p className="text-sm text-muted-foreground/70 mb-10 max-w-xs leading-relaxed">
          A safe, private space for your pregnancy journey—just for you
        </p>

        {/* Enter button */}
        <Button
          onClick={handleEnter}
          size="lg"
          className="h-14 px-14 text-lg rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <Flower2 className="h-5 w-5 mr-2" />
          Begin
        </Button>

        {/* Privacy note */}
        <p className="text-xs text-muted-foreground/50 mt-10 max-w-xs">
          Everything stays private, always 🔒
        </p>
      </div>
    </div>
  );
}
