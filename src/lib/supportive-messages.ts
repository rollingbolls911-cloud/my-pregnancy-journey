// Supportive messages for the tap-to-reveal feature - warm, caring notes

export const supportiveMessages = [
  // Gentle encouragement
  "You're doing amazing, even on the hard days. Rest is productive.",
  "Every small step you take matters. Be proud of yourself.",
  "Your body is doing incredible work. Trust the process.",
  "It's okay to feel whatever you're feeling right now.",
  "You don't have to be perfect. You just have to be you.",
  
  // Self-compassion
  "Be gentle with yourself today. You deserve kindness.",
  "Some days are harder than others. That's completely normal.",
  "You're stronger than you know, even when you don't feel it.",
  "Taking care of yourself IS taking care of your baby.",
  "It's okay to ask for help. You don't have to do this alone.",
  
  // Baby connection
  "Your baby already loves the sound of your voice.",
  "Every moment of connection matters, big or small.",
  "Your baby feels safe because of you.",
  "You're creating the most beautiful bond right now.",
  "Your love is already surrounding your little one.",
  
  // Rest & peace
  "If you're tired, rest. Tomorrow is a new day.",
  "Take a deep breath. You're exactly where you need to be.",
  "A calm mama means a calm baby. Prioritize your peace.",
  "It's okay to slow down. The world can wait.",
  "Give yourself permission to just be today.",
  
  // Affirmations
  "You were made for this journey. Trust yourself.",
  "Every pregnancy is unique. Comparison steals joy.",
  "Your intuition is your superpower. Listen to it.",
  "The love you feel is already changing the world.",
  "You're writing a beautiful story, one day at a time.",
  
  // Spiritual / peaceful
  "Everything is unfolding exactly as it should.",
  "This moment is precious. Breathe it in.",
  "You are blessed with this beautiful gift.",
  "Have patience with yourself and trust in Allah's plan.",
  "Every difficulty brings ease. Keep going.",
];

export const dailyFocusSuggestions = [
  // Physical
  "Stay hydrated today 💧",
  "Take a short, gentle walk",
  "Do some light stretching",
  "Get some fresh air today",
  "Listen to your body's signals",
  
  // Emotional
  "Write down one thing you're grateful for",
  "Call someone who makes you smile",
  "Allow yourself a moment of stillness",
  "Say something kind to yourself",
  "Let go of one worry today",
  
  // Spiritual
  "Take a moment for dua/prayer 🤲",
  "Listen to something peaceful",
  "Practice gratitude for this journey",
  "Find a quiet moment for reflection",
  "Connect with your baby through words",
  
  // Practical
  "Take your prenatal vitamin 💊",
  "Rest when you feel tired",
  "Eat something nourishing",
  "Drink a warm cup of tea 🍵",
  "Give yourself a 10-minute break",
];

export function getSupportiveMessage(): string {
  const today = new Date().toDateString();
  const hour = new Date().getHours();
  // Use date + hour as seed for variety throughout the day
  const seed = today.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) + hour;
  const index = seed % supportiveMessages.length;
  return supportiveMessages[index];
}

export function getDailyFocus(): string {
  const today = new Date().toDateString();
  const seed = today.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = seed % dailyFocusSuggestions.length;
  return dailyFocusSuggestions[index];
}

export function getRandomSupportiveMessage(): string {
  return supportiveMessages[Math.floor(Math.random() * supportiveMessages.length)];
}
