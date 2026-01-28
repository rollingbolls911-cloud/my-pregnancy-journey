import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Types matching our database schema
export interface CloudProfile {
  id: string;
  user_id: string;
  name: string;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface CloudDailyLog {
  id: string;
  user_id: string;
  date: string;
  mood_value: number | null;
  mood_label: string | null;
  energy_value: number | null;
  energy_label: string | null;
  symptoms: { symptomId: string; severity: number; notes?: string }[];
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CloudJournalEntry {
  id: string;
  user_id: string;
  date: string;
  title: string;
  content: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CloudAppointment {
  id: string;
  user_id: string;
  title: string;
  datetime: string;
  location: string | null;
  provider: string | null;
  notes: string | null;
  created_at: string;
}

export interface CloudQuickNote {
  id: string;
  user_id: string;
  content: string;
  pinned: boolean;
  created_at: string;
  updated_at: string;
}

// Profile hooks
export function useCloudProfile() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["cloud-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data as CloudProfile | null;
    },
    enabled: !!user,
  });
}

export function useSaveCloudProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profile: { name: string; due_date: string }) => {
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("profiles")
        .upsert({
          user_id: user.id,
          name: profile.name,
          due_date: profile.due_date,
        }, { onConflict: "user_id" })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cloud-profile"] });
    },
  });
}

// Daily logs hooks
export function useCloudDailyLogs() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["cloud-daily-logs", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("daily_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });
      if (error) throw error;
      return data as CloudDailyLog[];
    },
    enabled: !!user,
  });
}

export function useSaveCloudDailyLog() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (log: Omit<CloudDailyLog, "id" | "user_id" | "created_at" | "updated_at">) => {
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("daily_logs")
        .upsert({
          user_id: user.id,
          date: log.date,
          mood_value: log.mood_value,
          mood_label: log.mood_label,
          energy_value: log.energy_value,
          energy_label: log.energy_label,
          symptoms: log.symptoms,
          notes: log.notes,
        }, { onConflict: "user_id,date" })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cloud-daily-logs"] });
    },
  });
}

// Journal entries hooks
export function useCloudJournalEntries() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["cloud-journal-entries", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as CloudJournalEntry[];
    },
    enabled: !!user,
  });
}

export function useSaveCloudJournalEntry() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (entry: Omit<CloudJournalEntry, "user_id" | "created_at" | "updated_at"> & { id?: string }) => {
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("journal_entries")
        .upsert({
          id: entry.id,
          user_id: user.id,
          date: entry.date,
          title: entry.title,
          content: entry.content,
          tags: entry.tags,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cloud-journal-entries"] });
    },
  });
}

export function useDeleteCloudJournalEntry() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("journal_entries")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cloud-journal-entries"] });
    },
  });
}

// Appointments hooks
export function useCloudAppointments() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["cloud-appointments", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("user_id", user.id)
        .order("datetime", { ascending: true });
      if (error) throw error;
      return data as CloudAppointment[];
    },
    enabled: !!user,
  });
}

export function useSaveCloudAppointment() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (appointment: Omit<CloudAppointment, "user_id" | "created_at"> & { id?: string }) => {
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("appointments")
        .upsert({
          id: appointment.id,
          user_id: user.id,
          title: appointment.title,
          datetime: appointment.datetime,
          location: appointment.location,
          provider: appointment.provider,
          notes: appointment.notes,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cloud-appointments"] });
    },
  });
}

export function useDeleteCloudAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cloud-appointments"] });
    },
  });
}

// Quick notes hooks
export function useCloudQuickNotes() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["cloud-quick-notes", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("quick_notes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as CloudQuickNote[];
    },
    enabled: !!user,
  });
}

export function useSaveCloudQuickNote() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (note: Partial<Omit<CloudQuickNote, "user_id" | "created_at" | "updated_at">> & { id?: string; content: string; pinned: boolean }) => {
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("quick_notes")
        .upsert({
          id: note.id,
          user_id: user.id,
          content: note.content,
          pinned: note.pinned,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cloud-quick-notes"] });
    },
  });
}

export function useDeleteCloudQuickNote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("quick_notes")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cloud-quick-notes"] });
    },
  });
}
