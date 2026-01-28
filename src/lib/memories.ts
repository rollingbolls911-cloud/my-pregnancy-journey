// Memory storage and prompts - the emotional keepsake feature

export interface Memory {
  id: string;
  date: string; // YYYY-MM-DD
  prompt: string;
  content: string;
  week: number;
  createdAt: string;
  updatedAt: string;
}

const MEMORIES_KEY = "bloom_memories";

// Memory prompts - gentle, emotional, keepsake-worthy
export const memoryPrompts = [
  "Today I felt…",
  "I'm grateful for…",
  "One thing I want to tell my baby…",
  "A moment that made me smile today…",
  "Something I'm looking forward to…",
  "A prayer or wish for my baby…",
  "How I imagine meeting you…",
  "What I want you to know about this time…",
  "A feeling I want to remember…",
  "Something I learned about myself today…",
  "A moment of peace I experienced…",
  "What makes me feel connected to you…",
  "A dream I have for our family…",
  "Something I want to remember about this week…",
  "How I felt when I first knew about you…",
];

export function getRandomPrompts(count: number = 3): string[] {
  const shuffled = [...memoryPrompts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getTodayPrompt(): string {
  const today = new Date().toDateString();
  const seed = today.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = seed % memoryPrompts.length;
  return memoryPrompts[index];
}

// Storage functions
export function getMemories(): Memory[] {
  const data = localStorage.getItem(MEMORIES_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveMemory(memory: Memory): void {
  const memories = getMemories();
  const existingIndex = memories.findIndex(m => m.id === memory.id);
  
  if (existingIndex >= 0) {
    memories[existingIndex] = { ...memory, updatedAt: new Date().toISOString() };
  } else {
    memories.push(memory);
  }
  
  // Sort by date (newest first)
  memories.sort((a, b) => b.date.localeCompare(a.date));
  localStorage.setItem(MEMORIES_KEY, JSON.stringify(memories));
}

export function deleteMemory(id: string): void {
  const memories = getMemories().filter(m => m.id !== id);
  localStorage.setItem(MEMORIES_KEY, JSON.stringify(memories));
}

export function getMemoryByDate(date: string): Memory | null {
  const memories = getMemories();
  return memories.find(m => m.date === date) || null;
}

export function getMemoriesForWeek(week: number): Memory[] {
  const memories = getMemories();
  return memories.filter(m => m.week === week);
}

export function getMemoryDates(): Set<string> {
  const memories = getMemories();
  return new Set(memories.map(m => m.date));
}

// Get weekly recap data
export function getWeeklyRecap(week: number) {
  const memories = getMemoriesForWeek(week);
  
  // Get daily logs for this week
  const dailyLogsData = localStorage.getItem("bloom_daily_logs");
  const dailyLogs = dailyLogsData ? JSON.parse(dailyLogsData) : [];
  
  // Get appointments for this week
  const appointmentsData = localStorage.getItem("bloom_appointments");
  const appointments = appointmentsData ? JSON.parse(appointmentsData) : [];
  
  // We'll need to determine which dates fall in this week
  // For now, count based on week field in memories
  const checkIns = dailyLogs.length; // Total check-ins (simplified)
  const appointmentCount = appointments.length;
  
  return {
    week,
    memoriesCount: memories.length,
    checkInsCount: checkIns,
    appointmentsCount: appointmentCount,
    memories,
  };
}

// Generate unique ID
export function generateMemoryId(): string {
  return `memory-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
