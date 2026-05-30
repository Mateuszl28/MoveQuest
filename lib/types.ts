export type Difficulty = "easy" | "medium" | "hard";
export type FitnessLevel = "beginner" | "intermediate" | "advanced";
export type StatKey = "strength" | "endurance" | "agility" | "consistency";

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  difficulty: Difficulty;
  completed: boolean;
  /** lucide icon name + tailwind accent, set by the generator */
  icon: string;
  category: "strength" | "cardio" | "mobility" | "wellness";
  /** how much boss damage this quest deals */
  damage: number;
  /** if the quest involves a countable rep (e.g. squats) */
  reps?: number;
  /** if the quest is time-based, its duration in seconds (enables a timer) */
  durationSec?: number;
}

export interface CharacterStats {
  strength: number;
  endurance: number;
  agility: number;
  consistency: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: "bronze" | "silver" | "gold" | "legendary";
  unlocked: boolean;
  /** unlock timestamp (date key) */
  unlockedAt?: string;
}

export interface Boss {
  id: string;
  name: string;
  title: string;
  emoji: string;
  maxHp: number;
  hp: number;
  bonusXp: number;
  defeated: boolean;
}

export interface Profile {
  username: string;
  avatar: string;
  age: number;
  fitnessLevel: FitnessLevel;
  difficultyPreference: Difficulty;
}

export interface StreakState {
  current: number;
  best: number;
  lastActiveDate: string | null;
  /** dateKeys of active days, last 30 kept */
  activeDays: string[];
}

export interface GameState {
  version: number;
  profile: Profile | null;
  totalXp: number;
  stats: CharacterStats;
  streak: StreakState;
  achievements: Achievement[];
  /** generated for `questsDate`; regenerated each new day */
  quests: Quest[];
  questsDate: string | null;
  boss: Boss | null;
  bossDate: string | null;
  /** cumulative counters used for achievements */
  counters: {
    questsCompleted: number;
    squats: number;
    bossesDefeated: number;
    minutesStretched: number;
    dailyClaims: number;
  };
  /** XP earned per day for charts, keyed by date */
  xpHistory: Record<string, number>;
  /** ids of friend challenges already claimed (prevents double reward) */
  claimedChallenges: string[];
  /** in-game currency earned from quests, bosses and daily rewards */
  coins: number;
  /** purchased cosmetic ids (titles + avatars) */
  ownedCosmetics: string[];
  /** equipped title cosmetic id, or null for the level-based rank */
  equippedTitle: string | null;
  /** date key of the last claimed daily reward */
  lastRewardDate: string | null;
  /** sound effects on/off */
  soundEnabled: boolean;
}
