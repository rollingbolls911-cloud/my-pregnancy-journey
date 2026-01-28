// Baby size comparisons by week - creates that emotional connection

export interface BabySize {
  week: number;
  size: string;
  iconKey: string;
  lengthCm?: string;
  weightG?: string;
}

export const babySizes: BabySize[] = [
  { week: 4, size: "Poppy seed", iconKey: "poppy-seed", lengthCm: "0.1", weightG: "<1" },
  { week: 5, size: "Sesame seed", iconKey: "sesame-seed", lengthCm: "0.2", weightG: "<1" },
  { week: 6, size: "Lentil", iconKey: "lentil", lengthCm: "0.5", weightG: "<1" },
  { week: 7, size: "Blueberry", iconKey: "blueberry", lengthCm: "1.3", weightG: "1" },
  { week: 8, size: "Raspberry", iconKey: "raspberry", lengthCm: "1.6", weightG: "1" },
  { week: 9, size: "Cherry", iconKey: "cherry", lengthCm: "2.3", weightG: "2" },
  { week: 10, size: "Strawberry", iconKey: "strawberry", lengthCm: "3.1", weightG: "4" },
  { week: 11, size: "Fig", iconKey: "fig", lengthCm: "4.1", weightG: "7" },
  { week: 12, size: "Lime", iconKey: "lime", lengthCm: "5.4", weightG: "14" },
  { week: 13, size: "Peach", iconKey: "peach", lengthCm: "7.4", weightG: "23" },
  { week: 14, size: "Lemon", iconKey: "lemon", lengthCm: "8.7", weightG: "43" },
  { week: 15, size: "Apple", iconKey: "apple", lengthCm: "10.1", weightG: "70" },
  { week: 16, size: "Avocado", iconKey: "avocado", lengthCm: "11.6", weightG: "100" },
  { week: 17, size: "Pear", iconKey: "pear", lengthCm: "13", weightG: "140" },
  { week: 18, size: "Bell pepper", iconKey: "bell-pepper", lengthCm: "14.2", weightG: "190" },
  { week: 19, size: "Mango", iconKey: "mango", lengthCm: "15.3", weightG: "240" },
  { week: 20, size: "Banana", iconKey: "banana", lengthCm: "16.4", weightG: "300" },
  { week: 21, size: "Carrot", iconKey: "carrot", lengthCm: "26.7", weightG: "360" },
  { week: 22, size: "Papaya", iconKey: "papaya", lengthCm: "27.8", weightG: "430" },
  { week: 23, size: "Grapefruit", iconKey: "grapefruit", lengthCm: "28.9", weightG: "500" },
  { week: 24, size: "Corn on the cob", iconKey: "corn", lengthCm: "30", weightG: "600" },
  { week: 25, size: "Cauliflower", iconKey: "cauliflower", lengthCm: "34.6", weightG: "660" },
  { week: 26, size: "Lettuce", iconKey: "lettuce", lengthCm: "35.6", weightG: "760" },
  { week: 27, size: "Cabbage", iconKey: "cabbage", lengthCm: "36.6", weightG: "875" },
  { week: 28, size: "Eggplant", iconKey: "eggplant", lengthCm: "37.6", weightG: "1000" },
  { week: 29, size: "Butternut squash", iconKey: "butternut-squash", lengthCm: "38.6", weightG: "1150" },
  { week: 30, size: "Coconut", iconKey: "coconut", lengthCm: "39.9", weightG: "1320" },
  { week: 31, size: "Pineapple", iconKey: "pineapple", lengthCm: "41.1", weightG: "1500" },
  { week: 32, size: "Squash", iconKey: "squash", lengthCm: "42.4", weightG: "1700" },
  { week: 33, size: "Cantaloupe", iconKey: "cantaloupe", lengthCm: "43.7", weightG: "1920" },
  { week: 34, size: "Honeydew melon", iconKey: "honeydew-melon", lengthCm: "45", weightG: "2150" },
  { week: 35, size: "Coconut", iconKey: "coconut", lengthCm: "46.2", weightG: "2380" },
  { week: 36, size: "Romaine lettuce", iconKey: "romaine-lettuce", lengthCm: "47.4", weightG: "2620" },
  { week: 37, size: "Winter melon", iconKey: "winter-melon", lengthCm: "48.6", weightG: "2860" },
  { week: 38, size: "Pumpkin", iconKey: "pumpkin", lengthCm: "49.8", weightG: "3100" },
  { week: 39, size: "Mini watermelon", iconKey: "mini-watermelon", lengthCm: "50.7", weightG: "3290" },
  { week: 40, size: "Watermelon", iconKey: "watermelon", lengthCm: "51.2", weightG: "3460" },
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
