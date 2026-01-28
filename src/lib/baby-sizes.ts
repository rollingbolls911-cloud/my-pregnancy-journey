// Baby size comparisons by week - creates that emotional connection

export interface BabySize {
  week: number;
  size: string;
  emoji: string;
  lengthCm?: string;
  weightG?: string;
}

export const babySizes: BabySize[] = [
  { week: 4, size: "Poppy seed", emoji: "🌱", lengthCm: "0.1", weightG: "<1" },
  { week: 5, size: "Sesame seed", emoji: "🫛", lengthCm: "0.2", weightG: "<1" },
  { week: 6, size: "Lentil", emoji: "🫘", lengthCm: "0.5", weightG: "<1" },
  { week: 7, size: "Blueberry", emoji: "🫐", lengthCm: "1.3", weightG: "1" },
  { week: 8, size: "Raspberry", emoji: "🍇", lengthCm: "1.6", weightG: "1" },
  { week: 9, size: "Cherry", emoji: "🍒", lengthCm: "2.3", weightG: "2" },
  { week: 10, size: "Strawberry", emoji: "🍓", lengthCm: "3.1", weightG: "4" },
  { week: 11, size: "Fig", emoji: "🌰", lengthCm: "4.1", weightG: "7" },
  { week: 12, size: "Lime", emoji: "🍋", lengthCm: "5.4", weightG: "14" },
  { week: 13, size: "Peach", emoji: "🍑", lengthCm: "7.4", weightG: "23" },
  { week: 14, size: "Lemon", emoji: "🍋", lengthCm: "8.7", weightG: "43" },
  { week: 15, size: "Apple", emoji: "🍎", lengthCm: "10.1", weightG: "70" },
  { week: 16, size: "Avocado", emoji: "🥑", lengthCm: "11.6", weightG: "100" },
  { week: 17, size: "Pear", emoji: "🍐", lengthCm: "13", weightG: "140" },
  { week: 18, size: "Bell pepper", emoji: "🫑", lengthCm: "14.2", weightG: "190" },
  { week: 19, size: "Mango", emoji: "🥭", lengthCm: "15.3", weightG: "240" },
  { week: 20, size: "Banana", emoji: "🍌", lengthCm: "16.4", weightG: "300" },
  { week: 21, size: "Carrot", emoji: "🥕", lengthCm: "26.7", weightG: "360" },
  { week: 22, size: "Papaya", emoji: "🥝", lengthCm: "27.8", weightG: "430" },
  { week: 23, size: "Grapefruit", emoji: "🍊", lengthCm: "28.9", weightG: "500" },
  { week: 24, size: "Corn on the cob", emoji: "🌽", lengthCm: "30", weightG: "600" },
  { week: 25, size: "Cauliflower", emoji: "🥬", lengthCm: "34.6", weightG: "660" },
  { week: 26, size: "Lettuce", emoji: "🥗", lengthCm: "35.6", weightG: "760" },
  { week: 27, size: "Cabbage", emoji: "🥬", lengthCm: "36.6", weightG: "875" },
  { week: 28, size: "Eggplant", emoji: "🍆", lengthCm: "37.6", weightG: "1000" },
  { week: 29, size: "Butternut squash", emoji: "🎃", lengthCm: "38.6", weightG: "1150" },
  { week: 30, size: "Coconut", emoji: "🥥", lengthCm: "39.9", weightG: "1320" },
  { week: 31, size: "Pineapple", emoji: "🍍", lengthCm: "41.1", weightG: "1500" },
  { week: 32, size: "Squash", emoji: "🎃", lengthCm: "42.4", weightG: "1700" },
  { week: 33, size: "Cantaloupe", emoji: "🍈", lengthCm: "43.7", weightG: "1920" },
  { week: 34, size: "Honeydew melon", emoji: "🍈", lengthCm: "45", weightG: "2150" },
  { week: 35, size: "Coconut", emoji: "🥥", lengthCm: "46.2", weightG: "2380" },
  { week: 36, size: "Romaine lettuce", emoji: "🥬", lengthCm: "47.4", weightG: "2620" },
  { week: 37, size: "Winter melon", emoji: "🍈", lengthCm: "48.6", weightG: "2860" },
  { week: 38, size: "Pumpkin", emoji: "🎃", lengthCm: "49.8", weightG: "3100" },
  { week: 39, size: "Mini watermelon", emoji: "🍉", lengthCm: "50.7", weightG: "3290" },
  { week: 40, size: "Watermelon", emoji: "🍉", lengthCm: "51.2", weightG: "3460" },
];

export function getBabySize(week: number): BabySize {
  // Find closest week
  const size = babySizes.find(s => s.week === week);
  if (size) return size;
  
  // If week is less than 4, return first
  if (week < 4) return babySizes[0];
  
  // If week is more than 40, return last
  if (week > 40) return babySizes[babySizes.length - 1];
  
  // Find closest
  return babySizes.reduce((prev, curr) => 
    Math.abs(curr.week - week) < Math.abs(prev.week - week) ? curr : prev
  );
}
