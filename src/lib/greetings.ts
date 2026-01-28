// Personalized greeting system for Hanan

const timeBasedGreetings = {
  morning: [
    "Good morning, {name} ☀️",
    "Rise and shine, {name} 🌸",
    "Beautiful morning, {name} 💕",
    "Wishing you a gentle morning, {name}",
    "A new day awaits you, {name} 🌷",
  ],
  afternoon: [
    "Good afternoon, {name} 🌤️",
    "Hope you're having a lovely day, {name}",
    "Checking in on you, {name} 💕",
    "How are you feeling, {name}?",
    "Afternoon blessings, {name} 🌺",
  ],
  evening: [
    "Good evening, {name} 🌙",
    "Rest easy tonight, {name} ✨",
    "You did beautifully today, {name}",
    "Time to unwind, {name} 💕",
    "Evening peace to you, {name} 🌸",
  ],
  night: [
    "Sweet dreams ahead, {name} 🌙",
    "Rest well, {name} ✨",
    "You've earned your rest, {name}",
    "Goodnight, {name} 💕",
    "Peaceful night, {name} 🌙",
  ],
};

const encouragingMessages = [
  "You're doing amazing 💕",
  "One day at a time",
  "You did enough today",
  "Be gentle with yourself",
  "You are stronger than you know",
  "Every day is a new beginning",
  "You're exactly where you need to be",
  "Trust your journey",
  "Your body knows what to do",
  "You've got this, always",
];

const weeklyAffirmations: Record<number, string[]> = {
  // First trimester
  4: ["Your little one is just beginning 🌱", "A beautiful journey starts now"],
  5: ["Tiny heart is forming 💕", "Magic is happening inside you"],
  6: ["Your baby is growing every day", "You're creating something wonderful"],
  7: ["Heart is beating now 💓", "Listen to your body's wisdom"],
  8: ["Baby is the size of a raspberry 🍇", "Every day is progress"],
  9: ["Little fingers are forming", "You're doing beautifully"],
  10: ["Baby can move now ✨", "Trust this amazing process"],
  11: ["Almost done with first trimester!", "You're so strong"],
  12: ["Baby can stretch and kick", "The hardest part may be behind you"],
  13: ["Welcome to second trimester 🌸", "A new chapter begins"],
  // Second trimester
  14: ["Baby can make faces now", "You might feel more energy soon"],
  15: ["Baby is forming taste buds", "Enjoy the little moments"],
  16: ["You might feel movement soon 🦋", "How exciting!"],
  17: ["Baby is growing quickly", "You're glowing"],
  18: ["Halfway there! 🎉", "What an incredible journey"],
  19: ["Baby can hear you now 💕", "Talk to your little one"],
  20: ["Halfway milestone! 🌟", "You're amazing"],
  21: ["Baby's movements get stronger", "Every kick is a hello"],
  22: ["Baby is developing routines", "Rest when you need to"],
  23: ["Baby recognizes your voice", "Your bond grows stronger"],
  24: ["Viability milestone 💪", "Such a strong baby"],
  25: ["Baby has a sleep cycle", "Growing so fast"],
  26: ["Eyes are opening now 👀", "World is waiting"],
  27: ["Third trimester soon!", "Home stretch approaching"],
  // Third trimester
  28: ["Welcome to third trimester 🌟", "Final chapter begins"],
  29: ["Baby is gaining weight", "Almost there"],
  30: ["Baby practices breathing", "Your body is incredible"],
  31: ["Baby's brain is developing fast", "You're doing great"],
  32: ["Baby is head-down soon", "Getting ready"],
  33: ["Baby gains half a pound a week", "Growing strong"],
  34: ["Baby's lungs maturing", "Almost ready"],
  35: ["Baby is fully formed 💕", "Just gaining weight now"],
  36: ["Full term is near!", "Home stretch"],
  37: ["Early term! Baby could come anytime", "You're ready"],
  38: ["Full term 🎉", "Any day now"],
  39: ["Baby is fully ready", "Excitement builds"],
  40: ["Due date week! 🌸", "Your baby will arrive when ready"],
};

export function getTimeOfDay(): "morning" | "afternoon" | "evening" | "night" {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export function getPersonalizedGreeting(name: string): string {
  const timeOfDay = getTimeOfDay();
  const greetings = timeBasedGreetings[timeOfDay];
  
  // Use date as seed for consistent greeting per day
  const today = new Date().toDateString();
  const seed = today.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = seed % greetings.length;
  
  return greetings[index].replace("{name}", name);
}

export function getEncouragingMessage(): string {
  const today = new Date().toDateString();
  const seed = today.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = seed % encouragingMessages.length;
  return encouragingMessages[index];
}

export function getWeeklyAffirmation(week: number): string {
  const affirmations = weeklyAffirmations[Math.min(week, 40)] || weeklyAffirmations[40];
  const today = new Date().toDateString();
  const seed = today.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = seed % affirmations.length;
  return affirmations[index];
}
