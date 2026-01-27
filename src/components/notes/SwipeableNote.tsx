import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pin, PinOff, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuickNote } from "@/lib/storage";

interface SwipeableNoteProps {
  note: QuickNote;
  onTogglePin: (note: QuickNote) => void;
  onDelete: (id: string) => void;
}

export function SwipeableNote({ note, onTogglePin, onDelete }: SwipeableNoteProps) {
  const [offsetX, setOffsetX] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const startX = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    
    const currentX = e.touches[0].clientX;
    const delta = startX.current - currentX;
    
    // Only allow left swipe (positive delta)
    if (delta > 0) {
      setOffsetX(Math.min(delta, 100));
    } else {
      setOffsetX(0);
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    
    if (offsetX > 80) {
      // Trigger delete
      setIsDeleting(true);
      setOffsetX(200);
      setTimeout(() => onDelete(note.id), 200);
    } else {
      setOffsetX(0);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Delete background */}
      <div 
        className={cn(
          "absolute inset-y-0 right-0 flex items-center justify-end px-4 bg-destructive transition-opacity",
          offsetX > 0 ? "opacity-100" : "opacity-0"
        )}
        style={{ width: `${Math.max(offsetX, 60)}px` }}
      >
        <Trash2 className="h-5 w-5 text-destructive-foreground" />
      </div>

      {/* Note content */}
      <div
        className={cn(
          "flex items-start gap-2 p-2 rounded-lg text-sm relative bg-background transition-all",
          note.pinned
            ? "bg-primary/5 border border-primary/20"
            : "bg-muted/50",
          isDeleting && "opacity-0"
        )}
        style={{
          transform: `translateX(-${offsetX}px)`,
          transition: isDragging.current ? "none" : "transform 0.2s ease-out, opacity 0.2s",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <p className="flex-1 text-foreground leading-relaxed">
          {note.content}
        </p>
        <div className="flex gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onTogglePin(note)}
            className="h-7 w-7 p-0"
          >
            {note.pinned ? (
              <PinOff className="h-3.5 w-3.5 text-primary" />
            ) : (
              <Pin className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(note.id)}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hidden md:flex"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
