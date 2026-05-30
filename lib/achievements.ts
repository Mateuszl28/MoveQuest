import type { Achievement, GameState } from "./types";

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: Achievement["tier"];
  /** returns true once earned */
  earned: (s: GameState) => boolean;
  /** 0..1 progress for the gallery */
  progress: (s: GameState) => number;
}

const ratio = (a: number, b: number) => Math.max(0, Math.min(1, a / b));

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first-steps",
    title: "First Steps",
    description: "Complete your first quest.",
    icon: "Footprints",
    tier: "bronze",
    earned: (s) => s.counters.questsCompleted >= 1,
    progress: (s) => ratio(s.counters.questsCompleted, 1),
  },
  {
    id: "squat-warrior",
    title: "Squat Warrior",
    description: "Complete 100 squats.",
    icon: "Dumbbell",
    tier: "silver",
    earned: (s) => s.counters.squats >= 100,
    progress: (s) => ratio(s.counters.squats, 100),
  },
  {
    id: "quest-machine",
    title: "Quest Machine",
    description: "Complete 25 quests.",
    icon: "ListChecks",
    tier: "silver",
    earned: (s) => s.counters.questsCompleted >= 25,
    progress: (s) => ratio(s.counters.questsCompleted, 25),
  },
  {
    id: "seven-day-hero",
    title: "7-Day Hero",
    description: "Maintain a 7-day streak.",
    icon: "Flame",
    tier: "gold",
    earned: (s) => s.streak.best >= 7,
    progress: (s) => ratio(s.streak.best, 7),
  },
  {
    id: "thirty-day-legend",
    title: "30-Day Legend",
    description: "Maintain a 30-day streak.",
    icon: "Crown",
    tier: "legendary",
    earned: (s) => s.streak.best >= 30,
    progress: (s) => ratio(s.streak.best, 30),
  },
  {
    id: "boss-slayer",
    title: "Boss Slayer",
    description: "Defeat 5 daily bosses.",
    icon: "Swords",
    tier: "gold",
    earned: (s) => s.counters.bossesDefeated >= 5,
    progress: (s) => ratio(s.counters.bossesDefeated, 5),
  },
  {
    id: "xp-master",
    title: "XP Master",
    description: "Earn 5,000 total XP.",
    icon: "Star",
    tier: "legendary",
    earned: (s) => s.totalXp >= 5000,
    progress: (s) => ratio(s.totalXp, 5000),
  },
  {
    id: "zen-mode",
    title: "Zen Mode",
    description: "Stretch for 60 total minutes.",
    icon: "Flower2",
    tier: "bronze",
    earned: (s) => s.counters.minutesStretched >= 60,
    progress: (s) => ratio(s.counters.minutesStretched, 60),
  },
];

export function initialAchievements(): Achievement[] {
  return ACHIEVEMENTS.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    icon: a.icon,
    tier: a.tier,
    unlocked: false,
  }));
}

/** Re-evaluate achievements against state; returns updated list + newly unlocked ids. */
export function evaluateAchievements(
  state: GameState,
  today: string,
): { achievements: Achievement[]; newlyUnlocked: Achievement[] } {
  const newlyUnlocked: Achievement[] = [];
  const achievements = state.achievements.map((ach) => {
    const def = ACHIEVEMENTS.find((d) => d.id === ach.id);
    if (!def || ach.unlocked) return ach;
    if (def.earned(state)) {
      const updated = { ...ach, unlocked: true, unlockedAt: today };
      newlyUnlocked.push(updated);
      return updated;
    }
    return ach;
  });
  return { achievements, newlyUnlocked };
}

export function achievementProgress(id: string, state: GameState): number {
  const def = ACHIEVEMENTS.find((d) => d.id === id);
  return def ? def.progress(state) : 0;
}
