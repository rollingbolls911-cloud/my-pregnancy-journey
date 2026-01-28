// Comfort preferences system - things that help her feel better

export interface ComfortItem {
  id: string;
  label: string;
  iconKey: string;
  category: "physical" | "spiritual" | "emotional" | "activity";
}

export const defaultComfortItems: ComfortItem[] = [
  // Physical
  { id: "tea", label: "Warm tea", iconKey: "tea", category: "physical" },
  { id: "shower", label: "Warm shower", iconKey: "shower", category: "physical" },
  { id: "rest", label: "Lie down", iconKey: "rest", category: "physical" },
  { id: "snack", label: "Light snack", iconKey: "snack", category: "physical" },
  { id: "fresh-air", label: "Fresh air", iconKey: "fresh-air", category: "physical" },
  
  // Activity
  { id: "walk", label: "Short walk", iconKey: "walk", category: "activity" },
  { id: "stretch", label: "Gentle stretch", iconKey: "stretch", category: "activity" },
  { id: "breathing", label: "Deep breathing", iconKey: "breathing", category: "activity" },
  { id: "music", label: "Soft music", iconKey: "music", category: "activity" },
  { id: "reading", label: "Read a book", iconKey: "reading", category: "activity" },
  
  // Spiritual
  { id: "dua", label: "Dua/Prayer", iconKey: "dua", category: "spiritual" },
  { id: "quran", label: "Listen to Quran", iconKey: "quran", category: "spiritual" },
  { id: "dhikr", label: "Dhikr", iconKey: "dhikr", category: "spiritual" },
  
  // Emotional
  { id: "talk", label: "Talk to someone", iconKey: "talk", category: "emotional" },
  { id: "journal", label: "Write it out", iconKey: "journal", category: "emotional" },
  { id: "cry", label: "Let it out", iconKey: "cry", category: "emotional" },
  { id: "alone-time", label: "Quiet time", iconKey: "alone-time", category: "emotional" },
];

// Custom mood labels - her safe words
export interface MoodOption {
  value: number;
  label: string;
  iconKey: string;
}

export const defaultMoodOptions: MoodOption[] = [
  { value: 1, label: "Heavy", iconKey: "mood-1" },
  { value: 2, label: "Tired", iconKey: "mood-2" },
  { value: 3, label: "Okay", iconKey: "mood-3" },
  { value: 4, label: "Calm", iconKey: "mood-4" },
  { value: 5, label: "Bright", iconKey: "mood-5" },
];

export const defaultEnergyOptions: MoodOption[] = [
  { value: 1, label: "Drained", iconKey: "energy-1" },
  { value: 2, label: "Low", iconKey: "energy-2" },
  { value: 3, label: "Okay", iconKey: "energy-3" },
  { value: 4, label: "Good", iconKey: "energy-4" },
  { value: 5, label: "Energized", iconKey: "energy-5" },
];

const COMFORT_STORAGE_KEY = "bloom_comfort_preferences";
const MOOD_STORAGE_KEY = "bloom_mood_labels";

export function getComfortPreferences(): string[] {
  const data = localStorage.getItem(COMFORT_STORAGE_KEY);
  if (!data) {
    // Default favorites
    return ["tea", "dua", "breathing", "rest"];
  }
  return JSON.parse(data);
}

export function saveComfortPreferences(ids: string[]): void {
  localStorage.setItem(COMFORT_STORAGE_KEY, JSON.stringify(ids));
}

export function getPreferredComfortItems(): ComfortItem[] {
  const preferredIds = getComfortPreferences();
  return defaultComfortItems.filter(item => preferredIds.includes(item.id));
}

export function getMoodLabels(): MoodOption[] {
  const data = localStorage.getItem(MOOD_STORAGE_KEY);
  if (!data) return defaultMoodOptions;
  return JSON.parse(data);
}

export function saveMoodLabels(options: MoodOption[]): void {
  localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(options));
}
