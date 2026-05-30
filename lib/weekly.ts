import { dateKey, mulberry32, seedFromString } from "./utils";

export interface WeeklyChallenge {
  id: string; // week key (Monday's date)
  title: string;
  targetXp: number;
  rewardCoins: number;
  rewardXp: number;
}

/** Monday (local) of the week containing `d`. */
function monday(d: Date): Date {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // 0 = Monday
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** The seven date keys (Mon–Sun) for the week containing `d`. */
export function weekDays(d: Date = new Date()): string[] {
  const m = monday(d);
  return Array.from({ length: 7 }, (_, i) => {
    const x = new Date(m);
    x.setDate(m.getDate() + i);
    return dateKey(x);
  });
}

export function weekId(d: Date = new Date()): string {
  return dateKey(monday(d));
}

const TARGETS = [
  { mult: 1, coins: 120 },
  { mult: 1.4, coins: 180 },
  { mult: 1.8, coins: 240 },
];

/** Deterministic weekly XP goal that scales gently with the player's level. */
export function generateWeeklyChallenge(level: number, d: Date = new Date()): WeeklyChallenge {
  const id = weekId(d);
  const rnd = mulberry32(seedFromString(`weekly|${id}`));
  const t = TARGETS[Math.floor(rnd() * TARGETS.length)];
  const base = 600 + Math.min(level - 1, 20) * 60; // 600..1800
  const targetXp = Math.round((base * t.mult) / 50) * 50;
  return {
    id,
    title: `Earn ${targetXp.toLocaleString()} XP this week`,
    targetXp,
    rewardCoins: t.coins,
    rewardXp: Math.round(targetXp * 0.15),
  };
}

export function weeklyXpEarned(xpHistory: Record<string, number>, d: Date = new Date()): number {
  return weekDays(d).reduce((s, k) => s + (xpHistory[k] ?? 0), 0);
}
