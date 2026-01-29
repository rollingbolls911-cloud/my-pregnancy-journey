import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { dailyCarePlan, DailyTask } from "@/lib/daily-care-plan";
import { toast } from "sonner";
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
  LucideIcon,
} from "lucide-react";

export interface TaskStatus {
  taskId: string;
  completed: boolean;
  completedAt: string | null;
}

export interface CustomTask {
  id: string;
  text: string;
  category: DailyTask["category"];
  note?: string;
  icon: string;
  isCustom: true;
}

export interface CombinedTask extends Omit<DailyTask, "icon"> {
  completed: boolean;
  isCustom?: boolean;
  icon: LucideIcon;
  iconName?: string; // String name of the icon for custom tasks
  dbId?: string; // For custom tasks, this is the UUID from database
}

const iconMap: Record<string, LucideIcon> = {
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
};

export function useDailyTasks() {
  const [taskStatuses, setTaskStatuses] = useState<Map<string, TaskStatus>>(new Map());
  const [customTasks, setCustomTasks] = useState<CustomTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const today = format(new Date(), "yyyy-MM-dd");

  // Get icon component from string name
  const getIconComponent = (iconName: string): LucideIcon => {
    return iconMap[iconName] || Circle;
  };

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch today's task statuses and custom tasks
  const fetchTasks = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      // Fetch task statuses and custom tasks in parallel
      const [statusesResult, customTasksResult] = await Promise.all([
        supabase
          .from("daily_tasks")
          .select("*")
          .eq("user_id", userId)
          .eq("date", today),
        supabase
          .from("custom_tasks")
          .select("*")
          .eq("user_id", userId)
      ]);

      if (statusesResult.error) throw statusesResult.error;
      if (customTasksResult.error) throw customTasksResult.error;

      // Process task statuses
      const statusMap = new Map<string, TaskStatus>();
      statusesResult.data?.forEach((task) => {
        statusMap.set(task.task_id, {
          taskId: task.task_id,
          completed: task.completed,
          completedAt: task.completed_at,
        });
      });
      setTaskStatuses(statusMap);

      // Process custom tasks
      const custom: CustomTask[] = (customTasksResult.data || []).map((task) => ({
        id: task.id,
        text: task.text,
        category: task.category as DailyTask["category"],
        note: task.note || undefined,
        icon: task.icon || "Circle",
        isCustom: true as const,
      }));
      setCustomTasks(custom);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, today]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Toggle task completion
  const toggleTask = async (taskId: string): Promise<boolean> => {
    if (!userId) {
      toast.error("Please sign in to track tasks");
      return false;
    }

    const currentStatus = taskStatuses.get(taskId);
    const newCompleted = !currentStatus?.completed;

    // Optimistic update
    setTaskStatuses((prev) => {
      const newMap = new Map(prev);
      newMap.set(taskId, {
        taskId,
        completed: newCompleted,
        completedAt: newCompleted ? new Date().toISOString() : null,
      });
      return newMap;
    });

    try {
      const { error } = await supabase
        .from("daily_tasks")
        .upsert(
          {
            user_id: userId,
            date: today,
            task_id: taskId,
            completed: newCompleted,
            completed_at: newCompleted ? new Date().toISOString() : null,
          },
          {
            onConflict: "user_id,date,task_id",
          }
        );

      if (error) throw error;
      return newCompleted;
    } catch (error) {
      console.error("Error toggling task:", error);
      // Revert optimistic update
      setTaskStatuses((prev) => {
        const newMap = new Map(prev);
        if (currentStatus) {
          newMap.set(taskId, currentStatus);
        } else {
          newMap.delete(taskId);
        }
        return newMap;
      });
      toast.error("Failed to update task");
      return false;
    }
  };

  // Add custom task
  const addTask = async (task: {
    text: string;
    category: DailyTask["category"];
    note?: string;
    icon?: string;
  }): Promise<boolean> => {
    if (!userId) {
      toast.error("Please sign in to add tasks");
      return false;
    }

    try {
      const { data, error } = await supabase
        .from("custom_tasks")
        .insert({
          user_id: userId,
          text: task.text,
          category: task.category,
          note: task.note || null,
          icon: task.icon || "Circle",
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      setCustomTasks((prev) => [
        ...prev,
        {
          id: data.id,
          text: data.text,
          category: data.category as DailyTask["category"],
          note: data.note || undefined,
          icon: data.icon || "Circle",
          isCustom: true,
        },
      ]);

      toast.success("Task added");
      return true;
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task");
      return false;
    }
  };

  // Update custom task
  const updateTask = async (
    taskId: string,
    updates: {
      text?: string;
      category?: DailyTask["category"];
      note?: string;
      icon?: string;
    }
  ): Promise<boolean> => {
    if (!userId) {
      toast.error("Please sign in to update tasks");
      return false;
    }

    try {
      const { error } = await supabase
        .from("custom_tasks")
        .update({
          text: updates.text,
          category: updates.category,
          note: updates.note || null,
          icon: updates.icon,
        })
        .eq("id", taskId)
        .eq("user_id", userId);

      if (error) throw error;

      // Update local state
      setCustomTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                text: updates.text ?? task.text,
                category: updates.category ?? task.category,
                note: updates.note ?? task.note,
                icon: updates.icon ?? task.icon,
              }
            : task
        )
      );

      toast.success("Task updated");
      return true;
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
      return false;
    }
  };

  // Delete custom task
  const deleteTask = async (taskId: string): Promise<boolean> => {
    if (!userId) {
      toast.error("Please sign in to delete tasks");
      return false;
    }

    try {
      const { error } = await supabase
        .from("custom_tasks")
        .delete()
        .eq("id", taskId)
        .eq("user_id", userId);

      if (error) throw error;

      // Remove from local state
      setCustomTasks((prev) => prev.filter((task) => task.id !== taskId));

      // Also remove completion status for this task
      setTaskStatuses((prev) => {
        const newMap = new Map(prev);
        newMap.delete(taskId);
        return newMap;
      });

      toast.success("Task deleted");
      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
      return false;
    }
  };

  // Get all tasks (predefined + custom) with status
  const getTasksWithStatus = (): CombinedTask[] => {
    // Convert predefined tasks
    const predefinedTasks: CombinedTask[] = dailyCarePlan.map((task) => ({
      ...task,
      completed: taskStatuses.get(task.id)?.completed || false,
      isCustom: false,
    }));

    // Convert custom tasks
    const customTasksWithStatus: CombinedTask[] = customTasks.map((task) => ({
      id: task.id,
      text: task.text,
      category: task.category,
      note: task.note,
      icon: getIconComponent(task.icon),
      iconName: task.icon, // Store the icon name for editing
      completed: taskStatuses.get(task.id)?.completed || false,
      isCustom: true,
      dbId: task.id,
    }));

    return [...predefinedTasks, ...customTasksWithStatus];
  };

  // Get completion stats
  const getStats = () => {
    const tasks = getTasksWithStatus();
    const completed = tasks.filter((t) => t.completed).length;
    const total = tasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percentage };
  };

  return {
    tasks: getTasksWithStatus(),
    customTasks,
    loading,
    toggleTask,
    addTask,
    updateTask,
    deleteTask,
    stats: getStats(),
    isAuthenticated: !!userId,
    refresh: fetchTasks,
  };
}
