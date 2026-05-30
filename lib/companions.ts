export interface Companion {
  id: string;
  name: string;
  /** four evolution stages (unlocked by level) */
  stages: string[];
  blurb: string;
}

export const COMPANIONS: Companion[] = [
  { id: "drake", name: "Drake", stages: ["🥚", "🦎", "🐲", "🐉"], blurb: "A dragon-in-waiting that grows fierce with you." },
  { id: "birdie", name: "Phoenix", stages: ["🥚", "🐣", "🦜", "🦅"], blurb: "Rises higher every level — never give up." },
  { id: "cub", name: "Cub", stages: ["🐾", "🐱", "🐯", "🦁"], blurb: "A little cub destined to become king of the gym." },
];

export const EVO_LEVELS = [1, 5, 12, 20];

export function companionById(id: string): Companion {
  return COMPANIONS.find((c) => c.id === id) ?? COMPANIONS[0];
}

export function companionStageIndex(level: number): number {
  if (level >= EVO_LEVELS[3]) return 3;
  if (level >= EVO_LEVELS[2]) return 2;
  if (level >= EVO_LEVELS[1]) return 1;
  return 0;
}

export function companionEmoji(id: string, level: number): string {
  return companionById(id).stages[companionStageIndex(level)];
}

/** Level at which the companion next evolves, or null if maxed. */
export function nextEvolutionLevel(level: number): number | null {
  return EVO_LEVELS.find((l) => l > level) ?? null;
}
