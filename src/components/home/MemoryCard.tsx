import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Heart, 
  BookHeart, 
  Sparkles, 
  Check, 
  RefreshCw,
  ChevronRight 
} from "lucide-react";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { 
  getTodayPrompt, 
  getRandomPrompts, 
  saveMemory, 
  getMemoryByDate, 
  generateMemoryId 
} from "@/lib/memories";
import { format } from "date-fns";
import { hapticFeedback } from "@/lib/haptics";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export function MemoryCard() {
  const { gestationalAge } = usePregnancy();
  const today = format(new Date(), "yyyy-MM-dd");
  
  const [currentPrompt, setCurrentPrompt] = useState(getTodayPrompt());
  const [memoryText, setMemoryText] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Check if today already has a memory
  const existingMemory = getMemoryByDate(today);

  const isHapticsEnabled = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("bloom-haptics") !== "false";
    }
    return true;
  };

  const handleShuffle = () => {
    const prompts = getRandomPrompts(3);
    const newPrompt = prompts.find(p => p !== currentPrompt) || prompts[0];
    setCurrentPrompt(newPrompt);
    if (isHapticsEnabled()) hapticFeedback("light");
  };

  const handleSave = () => {
    if (!memoryText.trim() || !gestationalAge) return;

    const memory = {
      id: generateMemoryId(),
      date: today,
      prompt: currentPrompt,
      content: memoryText.trim(),
      week: gestationalAge.weeks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveMemory(memory);
    setIsSaved(true);
    setIsExpanded(false);
    
    if (isHapticsEnabled()) hapticFeedback("success");
    toast.success("Memory saved", {
      description: "You can view all memories in your journal",
    });

    // Reset after a moment
    setTimeout(() => {
      setMemoryText("");
      setIsSaved(false);
    }, 2000);
  };

  // If already saved today, show summary
  if (existingMemory) {
    return (
      <Card className="border-border/30 bg-gradient-to-br from-primary/5 to-chart-1/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-chart-1/20 flex items-center justify-center">
              <BookHeart className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-foreground">Memory saved today</p>
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                "{existingMemory.content.slice(0, 50)}{existingMemory.content.length > 50 ? '...' : ''}"
              </p>
            </div>
            <Link to="/journal">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/30 overflow-hidden">
      <CardContent className="p-0">
        {/* Header - always visible */}
        <button
          onClick={() => {
            setIsExpanded(!isExpanded);
            if (isHapticsEnabled()) hapticFeedback("light");
          }}
          className="w-full p-4 flex items-center gap-3 text-left transition-colors hover:bg-accent/20"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-chart-1/20 flex items-center justify-center">
            <BookHeart className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              My Baby Memory
            </p>
            <p className="text-xs text-muted-foreground">1 minute to capture a feeling</p>
          </div>
          <Heart className="h-4 w-4 text-primary/50" />
        </button>

        {/* Expanded content */}
        <div className={cn(
          "overflow-hidden transition-all duration-300",
          isExpanded ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="px-4 pb-4 space-y-3">
            {/* Prompt */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-primary italic">
                "{currentPrompt}"
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleShuffle}
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Text area */}
            <Textarea
              placeholder="Write from your heart..."
              value={memoryText}
              onChange={(e) => setMemoryText(e.target.value)}
              className="min-h-[100px] resize-none text-sm"
            />

            {/* Save button */}
            <Button
              onClick={handleSave}
              disabled={!memoryText.trim() || isSaved}
              className={cn(
                "w-full transition-all",
                isSaved && "bg-primary/20 text-primary"
              )}
            >
              {isSaved ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Saved
                </>
              ) : (
                <>
                  <Heart className="h-4 w-4 mr-2" />
                  Save Memory
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
