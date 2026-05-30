import type { Raid } from "./types";
import { mulberry32, seedFromString } from "./utils";

const ROSTER: Omit<Raid, "hp" | "maxHp" | "bonusXp" | "bonusCoins" | "defeated" | "id">[] = [
  { name: "Mount Inertia", title: "The Immovable", emoji: "🏔️" },
  { name: "Plateau Titan", title: "Stagnation Given Form", emoji: "🗿" },
  { name: "Lord Couchlock", title: "Sovereign of Sloth", emoji: "🛋️" },
  { name: "Gluttony Leviathan", title: "The Bottomless", emoji: "🐙" },
  { name: "Excuse Hydra", title: "Hundred-Headed Maybe-Later", emoji: "🐍" },
];

/** A big boss that lives the whole week; every quest chips away at it. */
export function generateRaid(level: number, weekId: string): Raid {
  const rnd = mulberry32(seedFromString(`raid|${weekId}`));
  const base = ROSTER[Math.floor(rnd() * ROSTER.length)];
  const maxHp = 500 + Math.min(level - 1, 30) * 45; // 500..1850
  return {
    id: `raid-${weekId}`,
    ...base,
    maxHp,
    hp: maxHp,
    bonusXp: 300 + Math.min(level - 1, 30) * 15,
    bonusCoins: 250,
    defeated: false,
  };
}
