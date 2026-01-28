// Comfort preferences system - things that help her feel better

export interface ComfortItem {
  id: string;
  label: string;
  emoji: string;
  category: "physical" | "spiritual" | "emotional" | "activity";
}

export const defaultComfortItems: ComfortItem[] = [
  // Physical
  { id: "tea", label: "Warm tea", emoji: "🍵", category: "physical" },
  { id: "shower", label: "Warm shower", emoji: "🚿", category: "physical" },
  { id: "rest", label: "Lie down", emoji: "🛋️", category: "physical" },
  { id: "snack", label: "Light snack", emoji: "🥛", category: "physical" },
  { id: "fresh-air", label: "Fresh air", emoji: "🌿", category: "physical" },
  
  // Activity
  { id: "walk", label: "Short walk", emoji: "🚶‍♀️", category: "activity" },
  { id: "stretch", label: "Gentle stretch", emoji: "🧘‍♀️", category: "activity" },
  { id: "breathing", label: "Deep breathing", emoji: "💨", category: "activity" },
  { id: "music", label: "Soft music", emoji: "🎵", category: "activity" },
  { id: "reading", label: "Read a book", emoji: "📖", category: "activity" },
  
  // Spiritual
  { id: "dua", label: "Dua/Prayer", emoji: "🤲", category: "spiritual" },
  { id: "quran", label: "Listen to Quran", emoji: "📿", category: "spiritual" },
  { id: "dhikr", label: "Dhikr", emoji: "✨", category: "spiritual" },
  
  // Emotional
  { id: "talk", label: "Talk to someone", emoji: "💬", category: "emotional" },
  { id: "journal", label: "Write it out", emoji: "📝", category: "emotional" },
  { id: "cry", label: "Let it out", emoji: "💧", category: "emotional" },
  { id: "alone-time", label: "Quiet time", emoji: "🌙", category: "emotional" },
];

// Custom mood labels - her safe words
export interface MoodOption {
  value: number;
  label: string;
  emoji: string;
}

export const defaultMoodOptions: MoodOption[] = [
  { value: 1, label: "Heavy", emoji: "🌧️" },
  { value: 2, label: "Tired", emoji: "😴" },
  { value: 3, label: "Okay", emoji: "🌤️" },
  { value: 4, label: "Calm", emoji: "☺️" },
  { value: 5, label: "Bright", emoji: "✨" },
];

export const defaultEnergyOptions: MoodOption[] = [
  { value: 1, label: "Drained", emoji: "🪫" },
  { value: 2, label: "Low", emoji: "🔋" },
  { value: 3, label: "Okay", emoji: "⚡" },
  { value: 4, label: "Good", emoji: "💪" },
  { value: 5, label: "Energized", emoji: "🌟" },
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
