// Local storage utilities for pregnancy tracker
import { PregnancyProfile } from "./pregnancy";

const STORAGE_KEYS = {
  PROFILE: "bloom_pregnancy_profile",
  DAILY_LOGS: "bloom_daily_logs",
  JOURNAL_ENTRIES: "bloom_journal_entries",
  APPOINTMENTS: "bloom_appointments",
  NOTES: "bloom_notes",
} as const;

// Types
export interface DailyLog {
  id: string;
  date: string; // YYYY-MM-DD
  mood?: { value: number; label: string };
  energy?: { value: number; label: string };
  symptoms: Array<{ symptomId: string; severity: number; notes?: string }>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  title: string;
  datetime: string;
  location?: string;
  provider?: string;
  notes?: string;
  createdAt: string;
}

export interface QuickNote {
  id: string;
  content: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

// Generate unique IDs
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Profile storage
export function saveProfile(profile: PregnancyProfile): void {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

export function getProfile(): PregnancyProfile | null {
  const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
  return data ? JSON.parse(data) : null;
}

export function clearProfile(): void {
  localStorage.removeItem(STORAGE_KEYS.PROFILE);
}

// Daily logs storage
export function saveDailyLog(log: DailyLog): void {
  const logs = getDailyLogs();
  const existingIndex = logs.findIndex((l) => l.date === log.date);
  
  if (existingIndex >= 0) {
    logs[existingIndex] = { ...log, updatedAt: new Date().toISOString() };
  } else {
    logs.push(log);
  }
  
  localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
}

export function getDailyLogs(): DailyLog[] {
  const data = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
  return data ? JSON.parse(data) : [];
}

export function getDailyLogByDate(date: string): DailyLog | null {
  const logs = getDailyLogs();
  return logs.find((l) => l.date === date) || null;
}

// Journal entries storage
export function saveJournalEntry(entry: JournalEntry): void {
  const entries = getJournalEntries();
  const existingIndex = entries.findIndex((e) => e.id === entry.id);
  
  if (existingIndex >= 0) {
    entries[existingIndex] = { ...entry, updatedAt: new Date().toISOString() };
  } else {
    entries.push(entry);
  }
  
  localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(entries));
}

export function getJournalEntries(): JournalEntry[] {
  const data = localStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
  return data ? JSON.parse(data) : [];
}

export function deleteJournalEntry(id: string): void {
  const entries = getJournalEntries().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(entries));
}

// Appointments storage
export function saveAppointment(appointment: Appointment): void {
  const appointments = getAppointments();
  const existingIndex = appointments.findIndex((a) => a.id === appointment.id);
  
  if (existingIndex >= 0) {
    appointments[existingIndex] = appointment;
  } else {
    appointments.push(appointment);
  }
  
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
}

export function getAppointments(): Appointment[] {
  const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
  return data ? JSON.parse(data) : [];
}

export function deleteAppointment(id: string): void {
  const appointments = getAppointments().filter((a) => a.id !== id);
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
}

export function getUpcomingAppointments(): Appointment[] {
  const now = new Date().toISOString();
  return getAppointments()
    .filter((a) => a.datetime >= now)
    .sort((a, b) => a.datetime.localeCompare(b.datetime));
}

// Quick notes storage
export function saveQuickNote(note: QuickNote): void {
  const notes = getQuickNotes();
  const existingIndex = notes.findIndex((n) => n.id === note.id);
  
  if (existingIndex >= 0) {
    notes[existingIndex] = { ...note, updatedAt: new Date().toISOString() };
  } else {
    notes.push(note);
  }
  
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
}

export function getQuickNotes(): QuickNote[] {
  const data = localStorage.getItem(STORAGE_KEYS.NOTES);
  return data ? JSON.parse(data) : [];
}

export function deleteQuickNote(id: string): void {
  const notes = getQuickNotes().filter((n) => n.id !== id);
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
}

// Export all data
export function exportAllData(): string {
  const data = {
    profile: getProfile(),
    dailyLogs: getDailyLogs(),
    journalEntries: getJournalEntries(),
    appointments: getAppointments(),
    notes: getQuickNotes(),
    exportedAt: new Date().toISOString(),
  };
  
  return JSON.stringify(data, null, 2);
}

// Clear all data
export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}
