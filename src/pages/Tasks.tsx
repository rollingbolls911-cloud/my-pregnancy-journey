import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { format } from "date-fns";
import {
  Sparkles,
  Heart,
  PartyPopper,
  ChevronDown,
  ChevronUp,
  Droplet,
  Apple,
  Footprints,
  Activity,
  Info,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { hapticFeedback } from "@/lib/haptics";
import { celebrate } from "@/lib/celebrations";
import { useDailyTasks, CombinedTask } from "@/hooks/useDailyTasks";
import { categoryLabels, dailyTargets, DailyTask } from "@/lib/daily-care-plan";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskItem } from "@/components/tasks/TaskItem";
import { TaskDialog } from "@/components/tasks/TaskDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const isHapticsEnabled = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("bloom-haptics") !== "false";
  }
  return true;
};

export default function Tasks() {
  const { profile } = usePregnancy();
  const {
    tasks,
    loading,
    toggleTask,
    addTask,
    updateTask,
    deleteTask,
    stats,
    isAuthenticated,
  } = useDailyTasks();
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    new Set(["morning", "mid-morning", "lunch", "afternoon", "evening", "night"])
  );
  const [celebratedAll, setCelebratedAll] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<{
    id: string;
    text: string;
    category: DailyTask["category"];
    note?: string;
    icon?: string;
  } | null>(null);
  const [deleteConfirmTask, setDeleteConfirmTask] = useState<string | null>(null);

  const handleToggle = async (taskId: string) => {
    const wasCompleted = tasks.find((t) => t.id === taskId)?.completed;
    const newCompleted = await toggleTask(taskId);

    if (newCompleted && !wasCompleted) {
      if (isHapticsEnabled()) hapticFeedback("success");
      celebrate("small");

      // Check if all tasks are done
      const newCompletedCount = tasks.filter((t) => t.completed).length + 1;
      if (newCompletedCount === tasks.length && !celebratedAll) {
        setCelebratedAll(true);
        setTimeout(() => {
          toast.success("All done! You're amazing", {
            duration: 3000,
            icon: <Sparkles className="h-4 w-4 text-primary" />,
          });
          celebrate("medium");
        }, 300);
      }
    } else if (isHapticsEnabled()) {
      hapticFeedback("light");
    }
  };

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleAddTask = async (task: {
    text: string;
    category: DailyTask["category"];
    note?: string;
    icon?: string;
  }) => {
    return await addTask(task);
  };

  const handleEditTask = async (task: {
    text: string;
    category: DailyTask["category"];
    note?: string;
    icon?: string;
  }) => {
    if (!editingTask) return false;
    const success = await updateTask(editingTask.id, task);
    if (success) {
      setEditingTask(null);
    }
    return success;
  };

  const handleDeleteTask = async () => {
    if (!deleteConfirmTask) return;
    await deleteTask(deleteConfirmTask);
    setDeleteConfirmTask(null);
  };

  const openEditDialog = (task: CombinedTask) => {
    if (!task.isCustom || !task.dbId) return;
    setEditingTask({
      id: task.dbId,
      text: task.text,
      category: task.category,
      note: task.note,
      icon: task.iconName || "Circle",
    });
    setDialogOpen(true);
  };

  // Group tasks by category
  const tasksByCategory = tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, CombinedTask[]>);

  const categories = Object.keys(categoryLabels) as Array<
    keyof typeof categoryLabels
  >;

  if (loading) {
    return (
      <AppLayout>
        <div className="px-3 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8 max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-3 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8 max-w-2xl mx-auto">
        {/* Header */}
        <AnimatedSection delay={0}>
          <div className="mb-4 sm:mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground font-serif">
                Daily Care Plan
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                {format(new Date(), "EEEE, MMMM d")}
              </p>
            </div>
            {isAuthenticated && (
              <Button
                onClick={() => {
                  setEditingTask(null);
                  setDialogOpen(true);
                }}
                size="sm"
                className="gap-1.5"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Task</span>
              </Button>
            )}
          </div>
        </AnimatedSection>

        {/* Progress Card */}
        <AnimatedSection delay={100}>
          <Card className="mb-4 overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  Today's Progress
                </span>
                <span className="text-sm text-primary font-semibold">
                  {stats.completed}/{stats.total} tasks
                </span>
              </div>
              <Progress value={stats.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {stats.percentage === 100
                  ? "Amazing! All done for today 💛"
                  : stats.percentage >= 50
                  ? "You're doing great, keep going!"
                  : "One step at a time, you've got this"}
              </p>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Daily Targets */}
        <AnimatedSection delay={150}>
          <Card className="mb-4 bg-accent/30 border-accent/50">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-foreground">
                  Daily Targets
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Droplet className="h-3 w-3 text-sky-500" />
                  <span>{dailyTargets.water}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Apple className="h-3 w-3 text-rose-400" />
                  <span>{dailyTargets.fruits}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Footprints className="h-3 w-3 text-emerald-500" />
                  <span>{dailyTargets.movement}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Activity className="h-3 w-3 text-violet-500" />
                  <span>{dailyTargets.checkin}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Task Categories */}
        <div className="space-y-3">
          {categories.map((category, categoryIndex) => {
            const categoryTasks = tasksByCategory[category] || [];
            if (categoryTasks.length === 0) return null;

            const completedInCategory = categoryTasks.filter(
              (t) => t.completed
            ).length;
            const isOpen = openCategories.has(category);

            return (
              <AnimatedSection key={category} delay={200 + categoryIndex * 50}>
                <Collapsible
                  open={isOpen}
                  onOpenChange={() => toggleCategory(category)}
                >
                  <Card>
                    <CollapsibleTrigger className="w-full">
                      <CardHeader className="p-3 pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                            {categoryLabels[category]}
                            <span className="text-xs font-normal text-muted-foreground">
                              {completedInCategory}/{categoryTasks.length}
                            </span>
                          </CardTitle>
                          {isOpen ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="p-3 pt-0 space-y-2">
                        {categoryTasks.map((task) => (
                          <TaskItem
                            key={task.id}
                            id={task.id}
                            text={task.text}
                            note={task.note}
                            icon={task.icon}
                            completed={task.completed}
                            isCustom={task.isCustom}
                            isPlaceholder={task.isPlaceholder}
                            disabled={!isAuthenticated}
                            onToggle={() => handleToggle(task.id)}
                            onEdit={
                              task.isCustom
                                ? () => openEditDialog(task)
                                : undefined
                            }
                            onDelete={
                              task.isCustom && task.dbId
                                ? () => setDeleteConfirmTask(task.dbId!)
                                : undefined
                            }
                          />
                        ))}
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              </AnimatedSection>
            );
          })}
        </div>

        {/* All Done Celebration */}
        {stats.percentage === 100 && (
          <AnimatedSection delay={0} direction="scale">
            <Card className="mt-4 bg-gradient-to-r from-primary/10 to-accent">
              <CardContent className="p-4 text-center">
                <PartyPopper className="h-6 w-6 mx-auto text-primary mb-2" />
                <p className="font-medium text-foreground font-serif">
                  You did it! All tasks complete
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  You're doing beautifully, {profile?.name || "mama"}
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>
        )}

        {/* Not authenticated warning */}
        {!isAuthenticated && (
          <AnimatedSection delay={300}>
            <Card className="mt-4 border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800">
              <CardContent className="p-4 text-center">
                <Heart className="h-5 w-5 mx-auto text-amber-600 mb-2" />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Sign in to save your daily progress and add custom tasks
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>
        )}
      </div>

      {/* Add/Edit Task Dialog */}
      <TaskDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingTask(null);
        }}
        onSave={editingTask ? handleEditTask : handleAddTask}
        editTask={editingTask}
        title="Add Task"
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteConfirmTask}
        onOpenChange={(open) => !open && setDeleteConfirmTask(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task?</AlertDialogTitle>
            <AlertDialogDescription>
              This task will be removed from your daily care plan. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTask}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
