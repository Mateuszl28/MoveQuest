import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** XP required per level. */
export const XP_PER_LEVEL = 500;

export function levelFromXp(totalXp: number): number {
  return Math.floor(totalXp / XP_PER_LEVEL) + 1;
}

/** XP accumulated within the current level (0..XP_PER_LEVEL). */
export function xpIntoLevel(totalXp: number): number {
  return totalXp % XP_PER_LEVEL;
}

export function xpForNextLevel(totalXp: number): number {
  return XP_PER_LEVEL - xpIntoLevel(totalXp);
}

export function levelProgress(totalXp: number): number {
  return (xpIntoLevel(totalXp) / XP_PER_LEVEL) * 100;
}

/** A stable date key like 2026-05-30 in local time. */
export function dateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  return Math.round((db.getTime() - da.getTime()) / 86_400_000);
}

/** Deterministic seed from a string (so daily content is stable). */
export function seedFromString(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return (h ^= h >>> 16) >>> 0;
}

/** Seeded PRNG (mulberry32). */
export function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(arr: T[], rnd: () => number): T {
  return arr[Math.floor(rnd() * arr.length)];
}

export function shuffle<T>(arr: T[], rnd: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const XP_BY_DIFFICULTY = { easy: 25, medium: 50, hard: 100 } as const;
export const DAMAGE_BY_DIFFICULTY = { easy: 12, medium: 22, hard: 40 } as const;
