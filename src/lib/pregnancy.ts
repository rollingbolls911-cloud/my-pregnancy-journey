// Pregnancy calculation utilities
import { differenceInDays, addDays, format, isWithinInterval, startOfDay } from "date-fns";

export interface PregnancyProfile {
  id: string;
  name: string;
  lmpDate: string; // Last menstrual period date
  dueDate: string; // Estimated due date
  createdAt: string;
}

export interface GestationalAge {
  weeks: number;
  days: number;
  totalDays: number;
  trimester: 1 | 2 | 3;
  trimesterName: string;
  progress: number; // 0-100 percentage
}

// Standard pregnancy duration
const PREGNANCY_DAYS = 280; // 40 weeks
const TRIMESTER_1_END = 13 * 7; // Week 13
const TRIMESTER_2_END = 27 * 7; // Week 27

/**
 * Calculate due date from LMP (Last Menstrual Period)
 * Using Naegele's rule: LMP + 280 days
 */
export function calculateDueDateFromLMP(lmpDate: Date): Date {
  return addDays(lmpDate, PREGNANCY_DAYS);
}

/**
 * Calculate LMP from due date
 */
export function calculateLMPFromDueDate(dueDate: Date): Date {
  return addDays(dueDate, -PREGNANCY_DAYS);
}

/**
 * Calculate gestational age from LMP
 */
export function calculateGestationalAge(lmpDate: Date, currentDate: Date = new Date()): GestationalAge {
  const lmpStart = startOfDay(new Date(lmpDate));
  const today = startOfDay(currentDate);
  
  const totalDays = differenceInDays(today, lmpStart);
  const weeks = Math.floor(totalDays / 7);
  const days = totalDays % 7;
  
  // Determine trimester
  let trimester: 1 | 2 | 3;
  let trimesterName: string;
  
  if (totalDays <= TRIMESTER_1_END) {
    trimester = 1;
    trimesterName = "First Trimester";
  } else if (totalDays <= TRIMESTER_2_END) {
    trimester = 2;
    trimesterName = "Second Trimester";
  } else {
    trimester = 3;
    trimesterName = "Third Trimester";
  }
  
  // Calculate progress percentage
  const progress = Math.min(Math.max((totalDays / PREGNANCY_DAYS) * 100, 0), 100);
  
  return {
    weeks,
    days,
    totalDays,
    trimester,
    trimesterName,
    progress,
  };
}

/**
 * Get days remaining until due date
 */
export function getDaysRemaining(dueDate: Date, currentDate: Date = new Date()): number {
  return Math.max(0, differenceInDays(startOfDay(new Date(dueDate)), startOfDay(currentDate)));
}

/**
 * Format gestational age as string
 */
export function formatGestationalAge(ga: GestationalAge): string {
  return `${ga.weeks} weeks, ${ga.days} day${ga.days !== 1 ? "s" : ""}`;
}

/**
 * Get week-specific milestone/message
 */
export function getWeekMilestone(week: number): string {
  const milestones: Record<number, string> = {
    4: "Your baby is about the size of a poppy seed 🌱",
    5: "The heart begins to form ❤️",
    6: "The neural tube is developing 🧠",
    7: "Arms and legs are forming 👋",
    8: "Fingers and toes are developing ✨",
    9: "All essential organs have begun forming 🌸",
    10: "Your baby is now officially a fetus 🎉",
    11: "Bones are beginning to harden 💪",
    12: "Reflexes are developing 🤲",
    13: "Entering the second trimester! 🌟",
    14: "Your baby can make facial expressions 😊",
    15: "Your baby can sense light 💡",
    16: "You might start feeling movement soon 🦋",
    17: "Baby's skeleton is changing from cartilage to bone 🦴",
    18: "Your baby can hear sounds now 👂",
    19: "Vernix is forming to protect baby's skin 🛡️",
    20: "Halfway there! 🎊",
    21: "Baby's movements are getting stronger 💪",
    22: "Eyebrows and eyelids are fully formed 👁️",
    23: "Baby is practicing breathing movements 🌬️",
    24: "Viability milestone reached 🌈",
    25: "Baby responds to your voice 🗣️",
    26: "Eyes are beginning to open 👀",
    27: "Entering the third trimester! 🌟",
    28: "Baby can blink and has eyelashes ✨",
    29: "Brain is developing rapidly 🧠",
    30: "Baby is about 3 pounds now ⚖️",
    31: "All five senses are developed 🌸",
    32: "Baby is practicing breathing 💨",
    33: "Bones are hardening (except skull) 🦴",
    34: "Baby's immune system is developing 🛡️",
    35: "Most organs are fully developed 🎉",
    36: "Baby is getting ready for birth 🍼",
    37: "Full term begins! 🌟",
    38: "Baby could arrive any day now 🎊",
    39: "Almost there! Stay comfortable 💕",
    40: "Your due date is here! 🎉",
  };
  
  return milestones[week] || `Week ${week} of your beautiful journey 💕`;
}

/**
 * Get trimester-specific guidance categories
 */
export function getTrimesterGuidance(trimester: 1 | 2 | 3) {
  const guidance = {
    1: {
      advice: [
        "Take prenatal vitamins with folic acid daily",
        "Stay hydrated - aim for 8-10 glasses of water",
        "Get plenty of rest when you feel tired",
        "Schedule your first prenatal appointment",
      ],
      avoid: [
        "Alcohol and smoking",
        "Raw or undercooked meats and fish",
        "Unpasteurized dairy products",
        "High-mercury fish (shark, swordfish)",
      ],
      care: [
        "Listen to your body and rest when needed",
        "Gentle walks can help with energy",
        "Small, frequent meals may help with nausea",
        "Keep crackers by your bedside",
      ],
    },
    2: {
      advice: [
        "Continue prenatal vitamins",
        "Start thinking about childbirth classes",
        "Consider a pregnancy pillow for comfort",
        "Stay active with gentle exercise",
      ],
      avoid: [
        "Heavy lifting",
        "Lying flat on your back for long periods",
        "Hot tubs and saunas",
        "Standing for very long periods",
      ],
      care: [
        "Moisturize to help with stretching skin",
        "Sleep on your left side when possible",
        "Talk and sing to your baby",
        "Take time for activities you enjoy",
      ],
    },
    3: {
      advice: [
        "Pack your hospital bag",
        "Practice breathing techniques",
        "Finalize your birth plan",
        "Install the car seat",
      ],
      avoid: [
        "Strenuous exercise",
        "Travel far from home after 36 weeks",
        "Ignoring signs of labor",
        "Stress - try to stay calm and positive",
      ],
      care: [
        "Rest with your feet elevated",
        "Take warm (not hot) baths",
        "Practice relaxation techniques",
        "Spend quality time with your partner",
      ],
    },
  };
  
  return guidance[trimester];
}

// Symptom definitions
export const SYMPTOMS = [
  { id: "nausea", label: "Nausea", icon: "🤢" },
  { id: "fatigue", label: "Fatigue", icon: "😴" },
  { id: "headache", label: "Headache", icon: "🤕" },
  { id: "backpain", label: "Back Pain", icon: "🔙" },
  { id: "cramping", label: "Cramping", icon: "💫" },
  { id: "bloating", label: "Bloating", icon: "🎈" },
  { id: "heartburn", label: "Heartburn", icon: "🔥" },
  { id: "insomnia", label: "Insomnia", icon: "😵" },
  { id: "swelling", label: "Swelling", icon: "🦶" },
  { id: "moodswings", label: "Mood Swings", icon: "🎭" },
] as const;

// Mood options
export const MOODS = [
  { value: 1, label: "Struggling", emoji: "😔", color: "hsl(var(--destructive))" },
  { value: 2, label: "Low", emoji: "😕", color: "hsl(var(--chart-5))" },
  { value: 3, label: "Okay", emoji: "😐", color: "hsl(var(--muted-foreground))" },
  { value: 4, label: "Good", emoji: "🙂", color: "hsl(var(--chart-1))" },
  { value: 5, label: "Great", emoji: "😊", color: "hsl(var(--primary))" },
] as const;

// Energy levels
export const ENERGY_LEVELS = [
  { value: 1, label: "Exhausted", color: "hsl(var(--destructive))" },
  { value: 2, label: "Low", color: "hsl(var(--chart-5))" },
  { value: 3, label: "Moderate", color: "hsl(var(--muted-foreground))" },
  { value: 4, label: "Good", color: "hsl(var(--chart-1))" },
  { value: 5, label: "Energized", color: "hsl(var(--primary))" },
] as const;

// Red flag symptoms that require immediate medical attention
export const RED_FLAG_SYMPTOMS = [
  "Vaginal bleeding or fluid leakage",
  "Severe abdominal pain",
  "Severe headache or vision changes",
  "Reduced fetal movement (after 28 weeks)",
  "Fever over 38°C (100.4°F)",
  "Fainting or dizziness",
  "Difficulty breathing",
  "Chest pain",
  "Severe swelling of face or hands",
];

// Baby size comparisons by week
export interface BabySizeInfo {
  name: string;
  emoji: string;
  length: string;
  weight: string;
}

export function getBabySizeByWeek(week: number): BabySizeInfo {
  const sizes: Record<number, BabySizeInfo> = {
    4: { name: "Poppy seed", emoji: "🌱", length: "0.04 in", weight: "< 0.04 oz" },
    5: { name: "Sesame seed", emoji: "🫘", length: "0.05 in", weight: "< 0.04 oz" },
    6: { name: "Lentil", emoji: "🟤", length: "0.25 in", weight: "< 0.04 oz" },
    7: { name: "Blueberry", emoji: "🫐", length: "0.5 in", weight: "< 0.04 oz" },
    8: { name: "Raspberry", emoji: "🍇", length: "0.6 in", weight: "0.04 oz" },
    9: { name: "Cherry", emoji: "🍒", length: "0.9 in", weight: "0.07 oz" },
    10: { name: "Strawberry", emoji: "🍓", length: "1.2 in", weight: "0.14 oz" },
    11: { name: "Lime", emoji: "🍋‍🟩", length: "1.6 in", weight: "0.25 oz" },
    12: { name: "Plum", emoji: "🟣", length: "2.1 in", weight: "0.5 oz" },
    13: { name: "Peach", emoji: "🍑", length: "2.9 in", weight: "0.8 oz" },
    14: { name: "Lemon", emoji: "🍋", length: "3.4 in", weight: "1.5 oz" },
    15: { name: "Apple", emoji: "🍎", length: "4 in", weight: "2.5 oz" },
    16: { name: "Avocado", emoji: "🥑", length: "4.6 in", weight: "3.5 oz" },
    17: { name: "Pear", emoji: "🍐", length: "5.1 in", weight: "5 oz" },
    18: { name: "Bell pepper", emoji: "🫑", length: "5.6 in", weight: "6.7 oz" },
    19: { name: "Mango", emoji: "🥭", length: "6 in", weight: "8.5 oz" },
    20: { name: "Banana", emoji: "🍌", length: "6.5 in", weight: "10 oz" },
    21: { name: "Carrot", emoji: "🥕", length: "10.5 in", weight: "12 oz" },
    22: { name: "Papaya", emoji: "🧡", length: "11 in", weight: "15 oz" },
    23: { name: "Grapefruit", emoji: "🍊", length: "11.4 in", weight: "1.1 lb" },
    24: { name: "Corn", emoji: "🌽", length: "11.8 in", weight: "1.3 lb" },
    25: { name: "Cauliflower", emoji: "🥦", length: "13.6 in", weight: "1.5 lb" },
    26: { name: "Lettuce", emoji: "🥬", length: "14 in", weight: "1.7 lb" },
    27: { name: "Cabbage", emoji: "🥗", length: "14.4 in", weight: "2 lb" },
    28: { name: "Eggplant", emoji: "🍆", length: "14.8 in", weight: "2.2 lb" },
    29: { name: "Butternut squash", emoji: "🎃", length: "15.2 in", weight: "2.5 lb" },
    30: { name: "Coconut", emoji: "🥥", length: "15.7 in", weight: "3 lb" },
    31: { name: "Pineapple", emoji: "🍍", length: "16.2 in", weight: "3.3 lb" },
    32: { name: "Squash", emoji: "🟠", length: "16.7 in", weight: "3.7 lb" },
    33: { name: "Celery", emoji: "🥒", length: "17.2 in", weight: "4.2 lb" },
    34: { name: "Cantaloupe", emoji: "🍈", length: "17.7 in", weight: "4.7 lb" },
    35: { name: "Honeydew", emoji: "🍃", length: "18.2 in", weight: "5.2 lb" },
    36: { name: "Romaine lettuce", emoji: "🥬", length: "18.7 in", weight: "5.7 lb" },
    37: { name: "Winter melon", emoji: "🍉", length: "19 in", weight: "6.3 lb" },
    38: { name: "Leek", emoji: "🧅", length: "19.6 in", weight: "6.8 lb" },
    39: { name: "Watermelon", emoji: "🍉", length: "20 in", weight: "7.2 lb" },
    40: { name: "Small pumpkin", emoji: "🎃", length: "20.2 in", weight: "7.6 lb" },
  };

  return sizes[week] || { name: "Growing beautifully", emoji: "💕", length: "—", weight: "—" };
}
