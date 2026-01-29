import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pencil, Trash2, LucideIcon } from "lucide-react";

interface TaskItemProps {
  id: string;
  text: string;
  note?: string;
  icon: LucideIcon;
  completed: boolean;
  isCustom?: boolean;
  isPlaceholder?: boolean;
  disabled?: boolean;
  onToggle: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function TaskItem({
  id,
  text,
  note,
  icon: Icon,
  completed,
  isCustom,
  isPlaceholder,
  disabled,
  onToggle,
  onEdit,
  onDelete,
}: TaskItemProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-2 rounded-lg transition-all group",
        completed && "opacity-60 bg-accent/20",
        isPlaceholder && "border border-dashed border-border/60",
        isCustom && "bg-primary/5 border border-primary/20"
      )}
    >
      <Checkbox
        checked={completed}
        onCheckedChange={onToggle}
        className="mt-0.5 h-5 w-5"
        disabled={disabled}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Icon
            className={cn(
              "h-4 w-4 shrink-0",
              completed ? "text-primary" : "text-muted-foreground"
            )}
          />
          <span
            className={cn(
              "text-sm",
              completed && "line-through text-muted-foreground"
            )}
          >
            {text}
          </span>
        </div>
        {note && (
          <p className="text-xs text-muted-foreground mt-1 ml-6">{note}</p>
        )}
      </div>

      {isCustom && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
