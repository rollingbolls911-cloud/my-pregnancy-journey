// Unified icon system - replaces emojis with consistent Lucide icons
import {
  Sprout, Leaf, Cherry, Apple, Citrus, 
  Grape, Carrot, Banana, Squircle,
  Sun, Moon, Cloud, Sparkles, Heart, Star,
  Coffee, ShowerHead, Sofa, Milk, Wind, TreeDeciduous,
  Footprints, PersonStanding, Music, BookOpen,
  HandHeart, BookHeart, Sparkle, MessageCircle, PenLine, Droplets, Moon as MoonIcon,
  Pill, Droplet, Dumbbell, Salad, BedDouble, Activity,
  Phone, Zap, Battery, BatteryLow, BatteryMedium, BatteryFull,
  CloudSun, CloudRain, Smile, Meh, Frown, PartyPopper, Baby, Flower2
} from "lucide-react";
import { cn } from "./utils";

// Baby size icons by week range
export const babySizeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "poppy-seed": Sprout,
  "sesame-seed": Leaf,
  "lentil": Leaf,
  "blueberry": Grape,
  "raspberry": Grape,
  "cherry": Cherry,
  "strawberry": Cherry,
  "fig": Leaf,
  "lime": Citrus,
  "peach": Apple,
  "lemon": Citrus,
  "apple": Apple,
  "avocado": Leaf,
  "pear": Apple,
  "bell-pepper": Apple,
  "mango": Apple,
  "banana": Banana,
  "carrot": Carrot,
  "papaya": Apple,
  "grapefruit": Citrus,
  "corn": Leaf,
  "cauliflower": Leaf,
  "lettuce": Leaf,
  "cabbage": Leaf,
  "eggplant": Leaf,
  "butternut-squash": Squircle,
  "coconut": Leaf,
  "pineapple": Leaf,
  "squash": Squircle,
  "cantaloupe": Citrus,
  "honeydew-melon": Citrus,
  "romaine-lettuce": Leaf,
  "winter-melon": Citrus,
  "pumpkin": Squircle,
  "mini-watermelon": Citrus,
  "watermelon": Citrus,
};

// Mood icons
export const moodIcons: Record<number, React.ComponentType<{ className?: string }>> = {
  1: CloudRain,  // Heavy
  2: Meh,        // Tired
  3: CloudSun,   // Okay
  4: Smile,      // Calm
  5: Sparkles,   // Bright
};

// Energy icons
export const energyIcons: Record<number, React.ComponentType<{ className?: string }>> = {
  1: BatteryLow,     // Drained
  2: Battery,        // Low
  3: BatteryMedium,  // Okay
  4: BatteryFull,    // Good
  5: Zap,            // Energized
};

// Comfort item icons
export const comfortIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  // Physical
  "tea": Coffee,
  "shower": ShowerHead,
  "rest": Sofa,
  "snack": Milk,
  "fresh-air": Wind,
  // Activity
  "walk": Footprints,
  "stretch": PersonStanding,
  "breathing": Wind,
  "music": Music,
  "reading": BookOpen,
  // Spiritual
  "dua": HandHeart,
  "quran": BookHeart,
  "dhikr": Sparkle,
  // Emotional
  "talk": MessageCircle,
  "journal": PenLine,
  "cry": Droplets,
  "alone-time": MoonIcon,
};

// Task suggestion icons
export const taskIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "vitamins": Pill,
  "water": Droplet,
  "walk": Footprints,
  "breathing": Wind,
  "snack": Salad,
  "rest": BedDouble,
  "stretch": Activity,
  "journal": PenLine,
  "call": Phone,
  "music": Music,
};

// Time of day icons
export const timeIcons = {
  morning: Sun,
  afternoon: CloudSun,
  evening: Moon,
  night: Moon,
};

// Celebration/milestone icons
export const milestoneIcons = {
  celebration: PartyPopper,
  baby: Baby,
  heart: Heart,
  star: Star,
  sparkle: Sparkles,
  flower: Flower2,
};

// Icon component wrapper with consistent styling
interface IconProps {
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Icon({ icon: IconComponent, className, size = "md" }: IconProps) {
  const sizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return <IconComponent className={cn(sizeClasses[size], className)} />;
}

// Get baby size icon for a given week
export function getBabySizeIcon(week: number): React.ComponentType<{ className?: string }> {
  if (week <= 5) return Sprout;
  if (week <= 8) return Grape;
  if (week <= 11) return Cherry;
  if (week <= 14) return Citrus;
  if (week <= 17) return Apple;
  if (week <= 21) return Banana;
  if (week <= 25) return Carrot;
  if (week <= 30) return Leaf;
  if (week <= 35) return Squircle;
  return Citrus;
}
