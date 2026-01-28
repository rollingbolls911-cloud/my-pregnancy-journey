import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSection } from "@/components/ui/animated-section";
import { getMemories, Memory } from "@/lib/memories";
import { format } from "date-fns";
import { Heart, BookHeart, Sparkles, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface MemoryTimelineProps {
  onEmpty?: () => void;
}

export function MemoryTimeline({ onEmpty }: MemoryTimelineProps) {
  const memories = getMemories();

  if (memories.length === 0) {
    return (
      <Card className="border-dashed border-primary/30">
        <CardContent className="py-10 text-center">
          <div className="mx-auto h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-chart-1/20 flex items-center justify-center mb-4">
            <BookHeart className="h-7 w-7 text-primary" />
          </div>
          <h3 className="text-base font-medium text-foreground mb-2">
            No memories yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Capture special moments from your pregnancy journey on the Home page
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group memories by week
  const groupedByWeek = memories.reduce((acc, memory) => {
    const week = memory.week;
    if (!acc[week]) {
      acc[week] = [];
    }
    acc[week].push(memory);
    return acc;
  }, {} as Record<number, Memory[]>);

  // Sort weeks in descending order
  const sortedWeeks = Object.keys(groupedByWeek)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="space-y-6">
      {sortedWeeks.map((week, weekIndex) => (
        <AnimatedSection key={week} delay={weekIndex * 100} direction="up">
          <div className="relative">
            {/* Week header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-chart-1 flex items-center justify-center shadow-md">
                <span className="text-xs font-bold text-primary-foreground">{week}</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Week {week}</h3>
                <p className="text-xs text-muted-foreground">
                  {groupedByWeek[week].length} {groupedByWeek[week].length === 1 ? 'memory' : 'memories'}
                </p>
              </div>
            </div>

            {/* Timeline line */}
            <div className="ml-4 border-l-2 border-primary/20 pl-6 space-y-4">
              {groupedByWeek[week].map((memory, memoryIndex) => (
                <MemoryCard 
                  key={memory.id} 
                  memory={memory} 
                  delay={weekIndex * 100 + memoryIndex * 50}
                />
              ))}
            </div>
          </div>
        </AnimatedSection>
      ))}

      {/* End of timeline marker */}
      <div className="flex items-center justify-center py-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Heart className="h-3.5 w-3.5 text-primary" />
          <span>{memories.length} precious {memories.length === 1 ? 'memory' : 'memories'}</span>
          <Heart className="h-3.5 w-3.5 text-primary" />
        </div>
      </div>
    </div>
  );
}

function MemoryCard({ memory, delay }: { memory: Memory; delay: number }) {
  return (
    <Card className="border-border/40 bg-gradient-to-br from-card to-primary/5 overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-4">
        {/* Date and prompt */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(memory.date), "MMMM d, yyyy")}</span>
          </div>
          <Sparkles className="h-3.5 w-3.5 text-primary/50" />
        </div>

        {/* Prompt badge */}
        <div className="mb-3">
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
            <Heart className="h-3 w-3" />
            {memory.prompt}
          </span>
        </div>

        {/* Memory content */}
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
          {memory.content}
        </p>

        {/* Subtle decoration */}
        <div className="mt-3 pt-3 border-t border-border/30">
          <p className="text-[10px] text-muted-foreground italic text-right">
            Week {memory.week} of your journey
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
