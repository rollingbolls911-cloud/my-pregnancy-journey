// Islamic duas and verses for expectant mothers

export interface Dua {
  id: string;
  arabic?: string;
  transliteration?: string;
  translation: string;
  source: string;
  category: "protection" | "ease" | "gratitude" | "baby" | "strength" | "peace";
}

export const pregnancyDuas: Dua[] = [
  // Protection duas
  {
    id: "dua-1",
    arabic: "رَبِّ هَبْ لِي مِن لَّدُنكَ ذُرِّيَّةً طَيِّبَةً ۖ إِنَّكَ سَمِيعُ الدُّعَاءِ",
    transliteration: "Rabbi hab li min ladunka dhurriyyatan tayyibah innaka sami'ud-du'a",
    translation: "My Lord, grant me from Yourself a good offspring. Indeed, You are the Hearer of supplication.",
    source: "Surah Ali 'Imran 3:38",
    category: "baby",
  },
  {
    id: "dua-2",
    arabic: "رَبِّ لَا تَذَرْنِي فَرْدًا وَأَنتَ خَيْرُ الْوَارِثِينَ",
    transliteration: "Rabbi la tadharnee fardan wa anta khayrul-waritheen",
    translation: "My Lord, do not leave me alone [with no heir], while You are the best of inheritors.",
    source: "Surah Al-Anbiya 21:89",
    category: "baby",
  },
  {
    id: "dua-3",
    arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ",
    transliteration: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yun",
    translation: "Our Lord, grant us from among our spouses and offspring comfort to our eyes.",
    source: "Surah Al-Furqan 25:74",
    category: "baby",
  },
  {
    id: "dua-4",
    arabic: "حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ ۖ عَلَيْهِ تَوَكَّلْتُ",
    transliteration: "Hasbiyallahu la ilaha illa Huwa, 'alayhi tawakkaltu",
    translation: "Sufficient for me is Allah; there is no deity except Him. On Him I have relied.",
    source: "Surah At-Tawbah 9:129",
    category: "protection",
  },
  {
    id: "dua-5",
    arabic: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي",
    transliteration: "Rabbij'alni muqeemas-salati wa min dhurriyyati",
    translation: "My Lord, make me an establisher of prayer, and [many] from my descendants.",
    source: "Surah Ibrahim 14:40",
    category: "baby",
  },
  {
    id: "dua-6",
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    transliteration: "Inna ma'al 'usri yusra",
    translation: "Indeed, with hardship comes ease.",
    source: "Surah Ash-Sharh 94:6",
    category: "ease",
  },
  {
    id: "dua-7",
    arabic: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ",
    transliteration: "Rabbi awzi'ni an ashkura ni'mataka",
    translation: "My Lord, enable me to be grateful for Your favor.",
    source: "Surah An-Naml 27:19",
    category: "gratitude",
  },
  {
    id: "dua-8",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ",
    transliteration: "Allahumma inni as'alukal-'afiyah",
    translation: "O Allah, I ask You for well-being and safety.",
    source: "Hadith - Tirmidhi",
    category: "protection",
  },
  {
    id: "dua-9",
    arabic: "رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ",
    transliteration: "Rabbi inni lima anzalta ilayya min khayrin faqeer",
    translation: "My Lord, indeed I am in need of whatever good You would send down to me.",
    source: "Surah Al-Qasas 28:24",
    category: "gratitude",
  },
  {
    id: "dua-10",
    arabic: "وَتَوَكَّلْ عَلَى الْحَيِّ الَّذِي لَا يَمُوتُ",
    transliteration: "Wa tawakkal 'alal-Hayyil-ladhi la yamoot",
    translation: "And rely upon the Ever-Living who does not die.",
    source: "Surah Al-Furqan 25:58",
    category: "strength",
  },
  {
    id: "dua-11",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً",
    transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanah",
    translation: "Our Lord, give us good in this world and good in the Hereafter.",
    source: "Surah Al-Baqarah 2:201",
    category: "peace",
  },
  {
    id: "dua-12",
    arabic: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا",
    transliteration: "Rabbana afrigh 'alayna sabra",
    translation: "Our Lord, pour upon us patience.",
    source: "Surah Al-Baqarah 2:250",
    category: "strength",
  },
  {
    id: "dua-13",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ",
    transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan",
    translation: "O Allah, I seek refuge in You from worry and grief.",
    source: "Hadith - Bukhari",
    category: "peace",
  },
  {
    id: "dua-14",
    arabic: "لَا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
    transliteration: "La ilaha illa Anta, Subhanaka, inni kuntu minaz-zalimin",
    translation: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
    source: "Surah Al-Anbiya 21:87",
    category: "ease",
  },
  {
    id: "dua-15",
    translation: "May Allah bless you with a healthy pregnancy and a righteous child who will be the coolness of your eyes.",
    source: "General Dua",
    category: "baby",
  },
];

export function getDailyDua(): Dua {
  const today = new Date();
  // Use date as seed for consistent dua per day
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const index = dayOfYear % pregnancyDuas.length;
  return pregnancyDuas[index];
}

export function getRandomDua(): Dua {
  return pregnancyDuas[Math.floor(Math.random() * pregnancyDuas.length)];
}

export function getDuasByCategory(category: Dua["category"]): Dua[] {
  return pregnancyDuas.filter((dua) => dua.category === category);
}
