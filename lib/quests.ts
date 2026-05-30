import type { Difficulty, FitnessLevel, Quest } from "./types";
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
  description: string;
  category: Quest["category"];
  icon: string;
  difficulty: Difficulty;
  reps?: number;
};

/**
 * Built-in "AI" quest pool. Scales reps/targets to fitness level.
 * The generator below selects a balanced, deterministic daily set.
 */
function buildPool(level: FitnessLevel): Template[] {
  const m = level === "beginner" ? 0.7 : level === "advanced" ? 1.5 : 1;
  const r = (n: number) => Math.round(n * m);
  return [
    // ---- cardio ----
    { title: `Walk ${r(4000)} steps`, description: "Get moving and rack up your daily steps.", category: "cardio", icon: "Footprints", difficulty: "easy" },
    { title: "15-minute walk after lunch", description: "A post-lunch stroll to keep the energy up.", category: "cardio", icon: "MapPin", difficulty: "easy" },
    { title: `Jog for ${r(20)} minutes`, description: "Steady-pace jog to build endurance.", category: "cardio", icon: "Wind", difficulty: "medium" },
    { title: `Climb ${r(10)} flights of stairs`, description: "Take the stairs instead of the elevator.", category: "cardio", icon: "TrendingUp", difficulty: "medium" },
    { title: `${r(30)}-minute bike ride`, description: "Outdoor or stationary — get the legs spinning.", category: "cardio", icon: "Bike", difficulty: "hard" },
    { title: `Do ${r(40)} jumping jacks`, description: "Quick cardio burst to wake up the body.", category: "cardio", icon: "Zap", difficulty: "easy" },

    // ---- strength ----
    { title: `Do ${r(20)} squats`, description: "Legs and glutes — keep your chest up.", category: "strength", icon: "Dumbbell", difficulty: "easy", reps: r(20) },
    { title: `Do ${r(15)} push-ups`, description: "Chest, shoulders and triceps. Modify on knees if needed.", category: "strength", icon: "Dumbbell", difficulty: "medium" },
    { title: `Hold a ${r(45)}-second plank`, description: "Core stability — keep a straight line.", category: "strength", icon: "Shield", difficulty: "medium" },
    { title: `Do ${r(30)} lunges`, description: "Alternating lunges for lower-body strength.", category: "strength", icon: "Dumbbell", difficulty: "hard" },
    { title: `${r(12)} glute bridges`, description: "Activate your posterior chain.", category: "strength", icon: "Dumbbell", difficulty: "easy" },

    // ---- mobility ----
    { title: "Stretch for 10 minutes", description: "Full-body stretch to loosen up.", category: "mobility", icon: "Sparkles", difficulty: "easy" },
    { title: "5-minute mobility flow", description: "Hips, shoulders and spine circles.", category: "mobility", icon: "Sparkles", difficulty: "easy" },
    { title: "10-minute yoga session", description: "Flow through a short yoga sequence.", category: "mobility", icon: "Flower2", difficulty: "medium" },
    { title: "Foam-roll your legs", description: "Release tension in quads and calves.", category: "mobility", icon: "Activity", difficulty: "medium" },

    // ---- wellness ----
    { title: "Drink 2 liters of water", description: "Stay hydrated throughout the day.", category: "wellness", icon: "Droplets", difficulty: "easy" },
    { title: "5 minutes of breathing", description: "Box breathing to reset your nervous system.", category: "wellness", icon: "Heart", difficulty: "easy" },
    { title: "Stand up every hour", description: "Break up sitting time with quick movement.", category: "wellness", icon: "Clock", difficulty: "medium" },
    { title: "Go to bed before 11pm", description: "Recovery is part of the quest.", category: "wellness", icon: "Moon", difficulty: "easy" },
  ];
}

function makeQuest(t: Template, idx: number, dayKey: string): Quest {
  return {
    id: `${dayKey}-${idx}-${t.title.replace(/\W+/g, "-").toLowerCase()}`,
    title: t.title,
    description: t.description,
    category: t.category,
    icon: t.icon,
    difficulty: t.difficulty,
    xpReward: XP_BY_DIFFICULTY[t.difficulty],
    damage: DAMAGE_BY_DIFFICULTY[t.difficulty],
    completed: false,
    reps: t.reps,
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

  // ensure a variety of categories: dedupe by title
  const seen = new Set<string>();
  const unique = mix.filter((t) => t && !seen.has(t.title) && seen.add(t.title));

  return unique.map((t, i) => makeQuest(t, i, day));
}
