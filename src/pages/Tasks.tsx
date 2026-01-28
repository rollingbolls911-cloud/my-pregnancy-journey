import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AnimatedSection } from "@/components/ui/animated-section";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { format } from "date-fns";
import { Plus, Trash2, Sparkles, ListTodo, Heart, PartyPopper, Pill, Droplet, Footprints, Wind, Salad, BedDouble, Activity, PenLine, Phone, Music } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { hapticFeedback } from "@/lib/haptics";
import { celebrate } from "@/lib/celebrations";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

const STORAGE_KEY = "bloom_daily_tasks";

function getTasks(): Task[] {
  const today = format(new Date(), "yyyy-MM-dd");
  const data = localStorage.getItem(`${STORAGE_KEY}_${today}`);
  return data ? JSON.parse(data) : [];
}

function saveTasks(tasks: Task[]): void {
  const today = format(new Date(), "yyyy-MM-dd");
  localStorage.setItem(`${STORAGE_KEY}_${today}`, JSON.stringify(tasks));
}

// Suggested tasks based on pregnancy
const suggestedTasks = [
  { text: "Take prenatal vitamins", icon: Pill },
  { text: "Drink 8 glasses of water", icon: Droplet },
  { text: "Take a short walk", icon: Footprints },
  { text: "Practice breathing exercises", icon: Wind },
  { text: "Eat a healthy snack", icon: Salad },
  { text: "Rest for 20 minutes", icon: BedDouble },
  { text: "Do gentle stretches", icon: Activity },
  { text: "Journal your thoughts", icon: PenLine },
  { text: "Call/text a loved one", icon: Phone },
  { text: "Listen to calming music", icon: Music },
];

export default function Tasks() {
  const { profile, gestationalAge } = usePregnancy();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const isHapticsEnabled = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("bloom-haptics") !== "false";
    }
    return true;
  };

  useEffect(() => {
    setTasks(getTasks());
  }, []);

  const addTask = (text: string) => {
    if (!text.trim()) return;
    
    const newTask: Task = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setNewTaskText("");
    setShowSuggestions(false);
    
    if (isHapticsEnabled()) hapticFeedback("light");
    toast("Task added", { duration: 1500, icon: <Heart className="h-4 w-4 text-primary" /> });
  };

  const toggleTask = (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    
    const task = tasks.find((t) => t.id === id);
    if (task && !task.completed) {
      // Task is being completed
      if (isHapticsEnabled()) hapticFeedback("success");
      celebrate("small");
      
      // Check if all tasks are done
      const completedCount = updatedTasks.filter((t) => t.completed).length;
      if (completedCount === updatedTasks.length && updatedTasks.length > 0) {
        setTimeout(() => {
          toast.success("All done! You're amazing", { duration: 3000, icon: <Sparkles className="h-4 w-4 text-primary" /> });
          celebrate("medium");
        }, 300);
      }
    } else {
      if (isHapticsEnabled()) hapticFeedback("light");
    }
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    if (isHapticsEnabled()) hapticFeedback("light");
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  return (
    <AppLayout>
      <div className="px-3 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8 max-w-2xl mx-auto">
        {/* Header */}
        <AnimatedSection delay={0}>
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Today's Tasks
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              {format(new Date(), "EEEE, MMMM d")}
              {totalCount > 0 && (
                <span className="ml-2 text-primary">
                  · {completedCount}/{totalCount} done
                </span>
              )}
            </p>
          </div>
        </AnimatedSection>

        {/* Add Task */}
        <AnimatedSection delay={100}>
          <Card className="mb-4">
            <CardContent className="p-3 sm:p-4">
              <div className="flex gap-2">
                <Input
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="Add a task..."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addTask(newTaskText);
                    }
                  }}
                />
                <Button
                  onClick={() => addTask(newTaskText)}
                  disabled={!newTaskText.trim()}
                  size="icon"
                  className="h-10 w-10"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Suggestions toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="mt-2 text-muted-foreground text-xs"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                {showSuggestions ? "Hide suggestions" : "Need ideas?"}
              </Button>
              
              {/* Suggested tasks */}
              {showSuggestions && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {suggestedTasks.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => addTask(suggestion.text)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full bg-accent/60 hover:bg-accent text-foreground border border-border/30 transition-all active:scale-95 touch-manipulation"
                    >
                      <suggestion.icon className="h-3.5 w-3.5" />
                      {suggestion.text}
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Task List */}
        <AnimatedSection delay={200}>
          {tasks.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-6 text-center">
                <ListTodo className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground text-sm">
                  No tasks yet. Add something small to start your day.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {tasks.map((task, index) => (
                <Card
                  key={task.id}
                  className={cn(
                    "transition-all duration-200",
                    task.completed && "opacity-60"
                  )}
                >
                  <CardContent className="p-3 sm:p-4 flex items-center gap-3">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="h-5 w-5"
                    />
                    <span
                      className={cn(
                        "flex-1 text-sm sm:text-base",
                        task.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {task.text}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTask(task.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </AnimatedSection>

        {/* Encouragement */}
        {completedCount > 0 && completedCount === totalCount && totalCount > 0 && (
          <AnimatedSection delay={0} direction="scale">
            <Card className="mt-4 bg-gradient-to-r from-primary/10 to-accent">
              <CardContent className="p-4 text-center">
                <PartyPopper className="h-6 w-6 mx-auto text-primary mb-2" />
                <p className="font-medium text-foreground">
                  You did it! All tasks complete
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  You're doing beautifully, {profile?.name}
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>
        )}
      </div>
    </AppLayout>
  );
}
