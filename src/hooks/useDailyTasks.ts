import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { dailyCarePlan, DailyTask } from "@/lib/daily-care-plan";
import { toast } from "sonner";

export interface TaskStatus {
  taskId: string;
  completed: boolean;
  completedAt: string | null;
}

export function useDailyTasks() {
  const [taskStatuses, setTaskStatuses] = useState<Map<string, TaskStatus>>(new Map());
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const today = format(new Date(), "yyyy-MM-dd");

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

  // Fetch today's task statuses
  const fetchTasks = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("daily_tasks")
        .select("*")
        .eq("user_id", userId)
        .eq("date", today);

      if (error) throw error;

      const statusMap = new Map<string, TaskStatus>();
      data?.forEach((task) => {
        statusMap.set(task.task_id, {
          taskId: task.task_id,
          completed: task.completed,
          completedAt: task.completed_at,
        });
      });

      setTaskStatuses(statusMap);
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

  // Get task with status
  const getTasksWithStatus = (): (DailyTask & { completed: boolean })[] => {
    return dailyCarePlan.map((task) => ({
      ...task,
      completed: taskStatuses.get(task.id)?.completed || false,
    }));
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
    loading,
    toggleTask,
    stats: getStats(),
    isAuthenticated: !!userId,
    refresh: fetchTasks,
  };
}
