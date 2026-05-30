import type { Boss } from "./types";
import { dateKey, mulberry32, seedFromString } from "./utils";

const ROSTER: Omit<Boss, "hp" | "maxHp" | "bonusXp" | "defeated" | "id">[] = [
  { name: "Sedentary Dragon", title: "Hoarder of Comfort", emoji: "🐉" },
  { name: "Burnout Beast", title: "Devourer of Motivation", emoji: "👹" },
  { name: "Hydra of Laziness", title: "Many-Headed Procrastinator", emoji: "🐲" },
  { name: "Couch Kraken", title: "Lord of the Cushions", emoji: "🦑" },
  { name: "Snooze Specter", title: "Thief of Mornings", emoji: "👻" },
  { name: "Sugar Golem", title: "Craving Incarnate", emoji: "🍩" },
  { name: "Doomscroll Wraith", title: "Eater of Hours", emoji: "📱" },
];

/** A daily boss whose HP scales gently with the player's level. */
export function generateDailyBoss(level: number, date?: Date): Boss {
  const day = dateKey(date);
  const rnd = mulberry32(seedFromString(`boss|${day}`));
  const base = ROSTER[Math.floor(rnd() * ROSTER.length)];
  const maxHp = 100 + Math.min(level - 1, 20) * 10; // 100..300
  return {
    id: `boss-${day}`,
    ...base,
    maxHp,
    hp: maxHp,
    bonusXp: 75 + Math.min(level - 1, 20) * 5,
    defeated: false,
  };
}
