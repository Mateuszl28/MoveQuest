import type { CustomQuest, Difficulty, FitnessLevel, Quest } from "./types";
import {
  DAMAGE_BY_DIFFICULTY,
  XP_BY_DIFFICULTY,
  dateKey,
  mulberry32,
  seedFromString,
  shuffle,
} from "./utils";

type Template = {
  title: string;
  titlePl: string;
  description: string;
  descPl: string;
  category: Quest["category"];
  icon: string;
  difficulty: Difficulty;
  reps?: number;
  durationSec?: number;
  stepGoal?: number;
};

/**
 * Built-in "AI" quest pool. Scales reps/targets to fitness level.
 * Each template carries English + Polish text so the language can switch live.
 */
function buildPool(level: FitnessLevel): Template[] {
  const m = level === "beginner" ? 0.7 : level === "advanced" ? 1.5 : 1;
  const r = (n: number) => Math.round(n * m);
  return [
    // ---- cardio ----
    { title: `Walk ${r(4000)} steps`, titlePl: `Przejdź ${r(4000)} kroków`, description: "Get moving and rack up your daily steps.", descPl: "Rusz się i nazbieraj dzienne kroki.", category: "cardio", icon: "Footprints", difficulty: "easy", stepGoal: r(4000) },
    { title: "15-minute walk after lunch", titlePl: "15-minutowy spacer po obiedzie", description: "A post-lunch stroll to keep the energy up.", descPl: "Spacer po obiedzie, by utrzymać energię.", category: "cardio", icon: "MapPin", difficulty: "easy", durationSec: 900 },
    { title: `Jog for ${r(20)} minutes`, titlePl: `Biegaj przez ${r(20)} minut`, description: "Steady-pace jog to build endurance.", descPl: "Spokojny trucht budujący wytrzymałość.", category: "cardio", icon: "Wind", difficulty: "medium", durationSec: r(20) * 60 },
    { title: `Climb ${r(10)} flights of stairs`, titlePl: `Wejdź po schodach ${r(10)} pięter`, description: "Take the stairs instead of the elevator.", descPl: "Wybierz schody zamiast windy.", category: "cardio", icon: "TrendingUp", difficulty: "medium" },
    { title: `${r(30)}-minute bike ride`, titlePl: `${r(30)}-minutowa jazda na rowerze`, description: "Outdoor or stationary — get the legs spinning.", descPl: "Na zewnątrz lub stacjonarnie — rozkręć nogi.", category: "cardio", icon: "Bike", difficulty: "hard", durationSec: r(30) * 60 },
    { title: `Do ${r(40)} jumping jacks`, titlePl: `Zrób ${r(40)} pajacyków`, description: "Quick cardio burst to wake up the body.", descPl: "Szybki zryw cardio, by obudzić ciało.", category: "cardio", icon: "Zap", difficulty: "easy" },

    // ---- strength ----
    { title: `Do ${r(20)} squats`, titlePl: `Zrób ${r(20)} przysiadów`, description: "Legs and glutes — keep your chest up.", descPl: "Nogi i pośladki — trzymaj klatkę wysoko.", category: "strength", icon: "Dumbbell", difficulty: "easy", reps: r(20) },
    { title: `Do ${r(15)} push-ups`, titlePl: `Zrób ${r(15)} pompek`, description: "Chest, shoulders and triceps. Modify on knees if needed.", descPl: "Klatka, barki i triceps. Możesz na kolanach.", category: "strength", icon: "Dumbbell", difficulty: "medium" },
    { title: `Hold a ${r(45)}-second plank`, titlePl: `Utrzymaj deskę ${r(45)} sekund`, description: "Core stability — keep a straight line.", descPl: "Stabilność korpusu — trzymaj prostą linię.", category: "strength", icon: "Shield", difficulty: "medium", durationSec: r(45) },
    { title: `Do ${r(30)} lunges`, titlePl: `Zrób ${r(30)} wykroków`, description: "Alternating lunges for lower-body strength.", descPl: "Naprzemienne wykroki na siłę dolnych partii.", category: "strength", icon: "Dumbbell", difficulty: "hard" },
    { title: `${r(12)} glute bridges`, titlePl: `${r(12)} mostków biodrowych`, description: "Activate your posterior chain.", descPl: "Aktywuj tylną taśmę mięśniową.", category: "strength", icon: "Dumbbell", difficulty: "easy" },

    // ---- mobility ----
    { title: "Stretch for 10 minutes", titlePl: "Rozciągaj się 10 minut", description: "Full-body stretch to loosen up.", descPl: "Rozciąganie całego ciała, by się rozluźnić.", category: "mobility", icon: "Sparkles", difficulty: "easy", durationSec: 600 },
    { title: "5-minute mobility flow", titlePl: "5-minutowy flow mobilności", description: "Hips, shoulders and spine circles.", descPl: "Krążenia bioder, barków i kręgosłupa.", category: "mobility", icon: "Sparkles", difficulty: "easy", durationSec: 300 },
    { title: "10-minute yoga session", titlePl: "10-minutowa sesja jogi", description: "Flow through a short yoga sequence.", descPl: "Przejdź przez krótką sekwencję jogi.", category: "mobility", icon: "Flower2", difficulty: "medium", durationSec: 600 },
    { title: "Foam-roll your legs", titlePl: "Rolowanie nóg", description: "Release tension in quads and calves.", descPl: "Rozluźnij napięcie w udach i łydkach.", category: "mobility", icon: "Activity", difficulty: "medium" },

    // ---- wellness ----
    { title: "Drink 2 liters of water", titlePl: "Wypij 2 litry wody", description: "Stay hydrated throughout the day.", descPl: "Bądź nawodniony przez cały dzień.", category: "wellness", icon: "Droplets", difficulty: "easy" },
    { title: "5 minutes of breathing", titlePl: "5 minut oddychania", description: "Box breathing to reset your nervous system.", descPl: "Oddychanie kwadratowe, by zresetować układ nerwowy.", category: "wellness", icon: "Heart", difficulty: "easy", durationSec: 300 },
    { title: "Stand up every hour", titlePl: "Wstawaj co godzinę", description: "Break up sitting time with quick movement.", descPl: "Przerywaj siedzenie krótkim ruchem.", category: "wellness", icon: "Clock", difficulty: "medium" },
    { title: "Go to bed before 11pm", titlePl: "Idź spać przed 23:00", description: "Recovery is part of the quest.", descPl: "Regeneracja to część wyprawy.", category: "wellness", icon: "Moon", difficulty: "easy" },
  ];
}

function makeQuest(t: Template, idx: number, dayKey: string): Quest {
  return {
    id: `${dayKey}-${idx}-${t.title.replace(/\W+/g, "-").toLowerCase()}`,
    title: t.title,
    titlePl: t.titlePl,
    description: t.description,
    descriptionPl: t.descPl,
    category: t.category,
    icon: t.icon,
    difficulty: t.difficulty,
    xpReward: XP_BY_DIFFICULTY[t.difficulty],
    damage: DAMAGE_BY_DIFFICULTY[t.difficulty],
    completed: false,
    reps: t.reps,
    durationSec: t.durationSec,
    stepGoal: t.stepGoal,
  };
}

const CATEGORY_ICON: Record<Quest["category"], string> = {
  strength: "Dumbbell",
  cardio: "Footprints",
  mobility: "Sparkles",
  wellness: "Heart",
};

/** Turn a user-defined custom quest into a concrete daily quest instance. */
export function customToQuest(cq: CustomQuest, day: string): Quest {
  return {
    id: `${day}-custom-${cq.id}`,
    title: cq.title,
    description: "Your custom quest.",
    category: cq.category,
    icon: CATEGORY_ICON[cq.category],
    difficulty: cq.difficulty,
    xpReward: XP_BY_DIFFICULTY[cq.difficulty],
    damage: DAMAGE_BY_DIFFICULTY[cq.difficulty],
    completed: false,
  };
}

/**
 * Deterministically generate the day's quests based on the player's
 * fitness level, difficulty preference and streak. Same day + same
 * inputs => same quests (stable across reloads), but it adapts:
 *  - higher streak unlocks an extra quest
 *  - difficulty preference biases the mix
 */
export function generateDailyQuests(opts: {
  level: FitnessLevel;
  preference: Difficulty;
  streak: number;
  /** the hero class's favoured category — gets an extra quest */
  favored?: Quest["category"] | null;
  date?: Date;
}): Quest[] {
  const day = dateKey(opts.date);
  const rnd = mulberry32(seedFromString(`${day}|${opts.level}|${opts.preference}`));
  const pool = buildPool(opts.level);

  const easy = shuffle(pool.filter((p) => p.difficulty === "easy"), rnd);
  const medium = shuffle(pool.filter((p) => p.difficulty === "medium"), rnd);
  const hard = shuffle(pool.filter((p) => p.difficulty === "hard"), rnd);

  // base mix biased by preference
  const mix: Template[] = [];
  if (opts.preference === "easy") {
    mix.push(easy[0], easy[1], medium[0], easy[2], medium[1]);
  } else if (opts.preference === "hard") {
    mix.push(medium[0], hard[0], medium[1], hard[1], easy[0]);
  } else {
    mix.push(easy[0], medium[0], hard[0], easy[1], medium[1]);
  }

  // streak bonus quest every 3 days of streak
  if (opts.streak >= 3) mix.push(hard[hard.length > 2 ? 2 : 0]);

  // class-favoured bonus quest
  if (opts.favored) {
    const favPool = shuffle(pool.filter((p) => p.category === opts.favored), rnd);
    if (favPool[0]) mix.push(favPool[0]);
  }

  // ensure a variety of categories: dedupe by title
  const seen = new Set<string>();
  const unique = mix.filter((t) => t && !seen.has(t.title) && seen.add(t.title));

  return unique.map((t, i) => makeQuest(t, i, day));
}
