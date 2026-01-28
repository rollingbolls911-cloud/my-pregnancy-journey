import confetti from "canvas-confetti";

export type CelebrationLevel = "small" | "medium" | "large";

const celebrationConfigs: Record<CelebrationLevel, confetti.Options> = {
  small: {
    particleCount: 30,
    spread: 50,
    origin: { y: 0.7 },
    colors: ["#ec4899", "#f472b6", "#fce7f3"],
  },
  medium: {
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#ec4899", "#f472b6", "#fce7f3", "#fbbf24", "#a855f7"],
  },
  large: {
    particleCount: 150,
    spread: 100,
    origin: { y: 0.5 },
    colors: ["#ec4899", "#f472b6", "#fce7f3", "#fbbf24", "#a855f7", "#22c55e"],
  },
};

export function celebrate(level: CelebrationLevel = "medium"): void {
  const config = celebrationConfigs[level];
  confetti(config);
}

export function celebrateMilestone(): void {
  // Fire confetti from both sides
  const duration = 2000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#ec4899", "#f472b6", "#fce7f3"],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#ec4899", "#f472b6", "#fce7f3"],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}

// Check for milestones that should trigger celebration
export function shouldCelebrate(
  currentWeek: number,
  currentDay: number,
  previousWeek?: number
): { celebrate: boolean; level: CelebrationLevel; message?: string } {
  // Trimester changes
  if (currentWeek === 13 && currentDay === 0 && previousWeek === 12) {
    return { celebrate: true, level: "large", message: "Welcome to the Second Trimester!" };
  }
  if (currentWeek === 27 && currentDay === 0 && previousWeek === 26) {
    return { celebrate: true, level: "large", message: "Welcome to the Third Trimester!" };
  }
  
  // Week milestones
  if (currentDay === 0 && previousWeek !== undefined && currentWeek > previousWeek) {
    // Every 4 weeks milestone
    if (currentWeek % 4 === 0) {
      return { celebrate: true, level: "medium", message: `Week ${currentWeek} milestone!` };
    }
    // Regular week change
    return { celebrate: true, level: "small" };
  }

  // 100 days (about 14 weeks 2 days)
  const totalDays = currentWeek * 7 + currentDay;
  if (totalDays === 100) {
    return { celebrate: true, level: "medium", message: "🎊 100 days of your journey!" };
  }

  return { celebrate: false, level: "small" };
}
