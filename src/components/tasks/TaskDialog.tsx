import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoryLabels, DailyTask } from "@/lib/daily-care-plan";
import {
  Circle,
  Droplet,
  Apple,
  Pill,
  Heart,
  Cookie,
  Activity,
  Salad,
  Footprints,
  Moon,
  BedDouble,
  Sparkles,
  Music,
  BookHeart,
  Smartphone,
  Clock,
  UtensilsCrossed,
  StretchHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const availableIcons = [
  { name: "Circle", icon: Circle },
  { name: "Droplet", icon: Droplet },
  { name: "Apple", icon: Apple },
  { name: "Pill", icon: Pill },
  { name: "Heart", icon: Heart },
  { name: "Cookie", icon: Cookie },
  { name: "Activity", icon: Activity },
  { name: "Salad", icon: Salad },
  { name: "Footprints", icon: Footprints },
  { name: "Moon", icon: Moon },
  { name: "BedDouble", icon: BedDouble },
  { name: "Sparkles", icon: Sparkles },
  { name: "Music", icon: Music },
  { name: "BookHeart", icon: BookHeart },
  { name: "Smartphone", icon: Smartphone },
  { name: "Clock", icon: Clock },
  { name: "UtensilsCrossed", icon: UtensilsCrossed },
  { name: "StretchHorizontal", icon: StretchHorizontal },
];

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: {
    text: string;
    category: DailyTask["category"];
    note?: string;
    icon?: string;
  }) => Promise<boolean>;
  editTask?: {
    id: string;
    text: string;
    category: DailyTask["category"];
    note?: string;
    icon?: string;
  } | null;
  title?: string;
}

export function TaskDialog({
  open,
  onOpenChange,
  onSave,
  editTask,
  title = "Add Task",
}: TaskDialogProps) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState<DailyTask["category"]>("morning");
  const [note, setNote] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Circle");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editTask) {
      setText(editTask.text);
      setCategory(editTask.category);
      setNote(editTask.note || "");
      setSelectedIcon(editTask.icon || "Circle");
    } else {
      setText("");
      setCategory("morning");
      setNote("");
      setSelectedIcon("Circle");
    }
  }, [editTask, open]);

  const handleSave = async () => {
    if (!text.trim()) return;
    
    setSaving(true);
    const success = await onSave({
      text: text.trim(),
      category,
      note: note.trim() || undefined,
      icon: selectedIcon,
    });
    setSaving(false);

    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editTask ? "Edit Task" : title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="task-text">Task</Label>
            <Input
              id="task-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., Take prenatal vitamins"
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-category">Time of Day</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as DailyTask["category"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-note">Note (optional)</Label>
            <Textarea
              id="task-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Additional details..."
              rows={2}
              maxLength={500}
            />
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {availableIcons.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSelectedIcon(name)}
                  className={cn(
                    "p-2 rounded-lg border transition-colors",
                    selectedIcon === name
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:border-primary/50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!text.trim() || saving}>
            {saving ? "Saving..." : editTask ? "Update" : "Add Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
