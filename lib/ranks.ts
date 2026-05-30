export interface Rank {
  name: string;
  emoji: string;
  minLevel: number;
}

/** Free, level-based ranks shown under the hero name when no title is equipped. */
export const RANKS: Rank[] = [
  { name: "Novice", emoji: "🌱", minLevel: 1 },
  { name: "Apprentice", emoji: "🗺️", minLevel: 3 },
  { name: "Adventurer", emoji: "🧭", minLevel: 5 },
  { name: "Warrior", emoji: "🛡️", minLevel: 8 },
  { name: "Champion", emoji: "⚔️", minLevel: 12 },
  { name: "Hero", emoji: "🦸", minLevel: 17 },
  { name: "Legend", emoji: "👑", minLevel: 25 },
];

export function rankForLevel(level: number): Rank {
  let current = RANKS[0];
  for (const r of RANKS) if (level >= r.minLevel) current = r;
  return current;
}

export function nextRank(level: number): Rank | null {
  return RANKS.find((r) => r.minLevel > level) ?? null;
}
