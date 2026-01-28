// Local storage utilities for pregnancy tracker
import { PregnancyProfile } from "./pregnancy";

const STORAGE_KEYS = {
  PROFILE: "bloom_pregnancy_profile",
  DAILY_LOGS: "bloom_daily_logs",
  JOURNAL_ENTRIES: "bloom_journal_entries",
  APPOINTMENTS: "bloom_appointments",
  NOTES: "bloom_notes",
  BUMP_PHOTOS: "bloom_bump_photos",
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

export interface BumpPhoto {
  id: string;
  imageUrl: string;
  caption: string;
  week: number;
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

// Bump photos storage
export function saveBumpPhoto(photo: BumpPhoto): void {
  const photos = getBumpPhotos();
  const existingIndex = photos.findIndex((p) => p.id === photo.id);
  
  if (existingIndex >= 0) {
    photos[existingIndex] = { ...photo, updatedAt: new Date().toISOString() };
  } else {
    photos.push(photo);
  }
  
  // Sort by week
  photos.sort((a, b) => a.week - b.week);
  localStorage.setItem(STORAGE_KEYS.BUMP_PHOTOS, JSON.stringify(photos));
}

export function getBumpPhotos(): BumpPhoto[] {
  const data = localStorage.getItem(STORAGE_KEYS.BUMP_PHOTOS);
  return data ? JSON.parse(data) : [];
}

export function deleteBumpPhoto(id: string): void {
  const photos = getBumpPhotos().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.BUMP_PHOTOS, JSON.stringify(photos));
}

export function updateBumpPhotoCaption(id: string, caption: string): void {
  const photos = getBumpPhotos();
  const photo = photos.find((p) => p.id === id);
  if (photo) {
    photo.caption = caption;
    photo.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.BUMP_PHOTOS, JSON.stringify(photos));
  }
}

// Export all data
export function exportAllData(): string {
  const data = {
    profile: getProfile(),
    dailyLogs: getDailyLogs(),
    journalEntries: getJournalEntries(),
    appointments: getAppointments(),
    notes: getQuickNotes(),
    bumpPhotos: getBumpPhotos(),
    exportedAt: new Date().toISOString(),
  };
  
  return JSON.stringify(data, null, 2);
}

// Export tracker data only (daily logs)
export function exportTrackerData(): string {
  const logs = getDailyLogs();
  const profile = getProfile();
  
  // Create a more readable format
  const data = {
    name: profile?.name || "Unknown",
    dueDate: profile?.dueDate,
    totalEntries: logs.length,
    logs: logs.map(log => ({
      date: log.date,
      mood: log.mood?.label,
      energy: log.energy?.label,
      symptoms: log.symptoms.map(s => s.symptomId),
      notes: log.notes,
    })),
    exportedAt: new Date().toISOString(),
  };
  
  return JSON.stringify(data, null, 2);
}

// Get tracker statistics
export function getTrackerStats() {
  const logs = getDailyLogs();
  const totalDays = logs.length;
  
  // Count mood distribution
  const moodCounts: Record<string, number> = {};
  logs.forEach(log => {
    if (log.mood?.label) {
      moodCounts[log.mood.label] = (moodCounts[log.mood.label] || 0) + 1;
    }
  });
  
  // Most common symptoms
  const symptomCounts: Record<string, number> = {};
  logs.forEach(log => {
    log.symptoms.forEach(s => {
      symptomCounts[s.symptomId] = (symptomCounts[s.symptomId] || 0) + 1;
    });
  });
  
  // Get streak
  const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < sortedLogs.length; i++) {
    const logDate = new Date(sortedLogs[i].date);
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);
    
    if (logDate.toDateString() === expectedDate.toDateString()) {
      streak++;
    } else {
      break;
    }
  }
  
  return {
    totalDays,
    streak,
    moodCounts,
    symptomCounts,
  };
}

// Clear all data
export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}
