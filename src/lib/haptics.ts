// Haptic feedback utility for PWA
// Uses the Vibration API when available

export type HapticPattern = "light" | "medium" | "heavy" | "success" | "error";

const patterns: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 25,
  heavy: 50,
  success: [10, 50, 10],
  error: [50, 100, 50],
};

export function hapticFeedback(pattern: HapticPattern = "light"): void {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(patterns[pattern]);
    } catch {
      // Vibration not supported or blocked
    }
  }
}

export function isHapticsSupported(): boolean {
  return typeof navigator !== "undefined" && "vibrate" in navigator;
}
