import { Droplet, StretchHorizontal, UtensilsCrossed, Pill, Apple, Heart, Cookie, Activity, Salad, Footprints, Moon, BedDouble, Sparkles, Music, BookHeart, Smartphone, Clock, LucideIcon } from "lucide-react";

export interface DailyTask {
  id: string;
  text: string;
  category: "morning" | "mid-morning" | "lunch" | "afternoon" | "evening" | "night";
  icon: LucideIcon;
  isPlaceholder?: boolean; // For medication/supplements
  note?: string;
}

export const dailyCarePlan: DailyTask[] = [
  // Morning (Wake → Breakfast)
  {
    id: "morning-water",
    text: "Water (250–400 ml) right after waking",
    category: "morning",
    icon: Droplet,
  },
  {
    id: "morning-stretch",
    text: "Light stretch (3–5 min): neck/shoulders/ankles + deep breathing",
    category: "morning",
    icon: StretchHorizontal,
  },
  {
    id: "morning-breakfast",
    text: "Breakfast (protein + fiber)",
    category: "morning",
    icon: UtensilsCrossed,
    note: "Examples: eggs, yogurt + oats, dal + roti",
  },
  {
    id: "morning-medication",
    text: "Medication/Supplements (as prescribed)",
    category: "morning",
    icon: Pill,
    isPlaceholder: true,
    note: "Prenatal / Iron / Folic acid / Vitamin D (doctor instructions)",
  },
  {
    id: "morning-fruit",
    text: "Fruit #1: banana / apple / orange / guava",
    category: "morning",
    icon: Apple,
  },
  {
    id: "morning-note",
    text: "Tiny note: \"Good morning, Ayuni. Today: gentle and calm.\"",
    category: "morning",
    icon: Heart,
  },

  // Mid-Morning
  {
    id: "midmorning-water",
    text: "Water (400 ml)",
    category: "mid-morning",
    icon: Droplet,
  },
  {
    id: "midmorning-snack",
    text: "Snack: nuts, dates (if ok), yogurt, or biscuits + milk",
    category: "mid-morning",
    icon: Cookie,
  },
  {
    id: "midmorning-checkin",
    text: "2-minute check-in: mood + energy",
    category: "mid-morning",
    icon: Activity,
  },

  // Lunch
  {
    id: "lunch-meal",
    text: "Balanced lunch (½ veggies + ¼ protein + ¼ carbs)",
    category: "lunch",
    icon: Salad,
  },
  {
    id: "lunch-water",
    text: "Water (250–400 ml)",
    category: "lunch",
    icon: Droplet,
  },
  {
    id: "lunch-fruit",
    text: "Fruit #2: seasonal fruit",
    category: "lunch",
    icon: Apple,
  },
  {
    id: "lunch-walk",
    text: "10–15 min walk (if comfortable)",
    category: "lunch",
    icon: Footprints,
  },

  // Afternoon
  {
    id: "afternoon-water",
    text: "Water (250 ml)",
    category: "afternoon",
    icon: Droplet,
  },
  {
    id: "afternoon-rest",
    text: "Rest/nap (20–40 min)",
    category: "afternoon",
    icon: BedDouble,
    note: "Even lying down counts",
  },
  {
    id: "afternoon-comfort",
    text: "Comfort care: warm shower / feet up / light music / breathing",
    category: "afternoon",
    icon: Sparkles,
  },

  // Evening (Dinner time)
  {
    id: "evening-water",
    text: "Water (250–400 ml)",
    category: "evening",
    icon: Droplet,
  },
  {
    id: "evening-dinner",
    text: "Dinner (lighter than lunch if preferred)",
    category: "evening",
    icon: UtensilsCrossed,
  },
  {
    id: "evening-medication",
    text: "Medication/Supplements (as prescribed)",
    category: "evening",
    icon: Pill,
    isPlaceholder: true,
  },
  {
    id: "evening-appointment",
    text: "Appointment prep (if any): add questions for doctor",
    category: "evening",
    icon: Clock,
  },

  // Night (Before bed)
  {
    id: "night-water",
    text: "Water (small amount if it disturbs sleep)",
    category: "night",
    icon: Droplet,
  },
  {
    id: "night-journal",
    text: "Journal (1 minute): \"One sweet moment from today…\"",
    category: "night",
    icon: BookHeart,
  },
  {
    id: "night-winddown",
    text: "Sleep wind-down: dim lights + no heavy screen time 20 mins",
    category: "night",
    icon: Smartphone,
  },
];

export const categoryLabels: Record<DailyTask["category"], string> = {
  morning: "Morning",
  "mid-morning": "Mid-Morning",
  lunch: "Lunch",
  afternoon: "Afternoon",
  evening: "Evening",
  night: "Night",
};

export const dailyTargets = {
  water: "8–10 cups total",
  fruits: "2 servings/day",
  movement: "10–20 minutes gentle walk",
  checkin: "1 daily log (mood + energy + symptoms)",
};
