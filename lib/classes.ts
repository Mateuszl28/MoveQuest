import type { HeroClass, Quest } from "./types";

export interface HeroClassDef {
  id: HeroClass;
  name: string;
  emoji: string;
  blurb: string;
  /** category the class favours in daily quest generation, or null for balanced */
  favored: Quest["category"] | null;
  passive: string;
  accent: string; // tailwind text color for flavour
}

export const HERO_CLASSES: HeroClassDef[] = [
  {
    id: "warrior",
    name: "Warrior",
    emoji: "💪",
    blurb: "Lives for strength work and the grind.",
    favored: "strength",
    passive: "+20% XP from strength quests",
    accent: "text-rose-300",
  },
  {
    id: "runner",
    name: "Runner",
    emoji: "🏃",
    blurb: "Cardio is cardio is cardio. Keep moving.",
    favored: "cardio",
    passive: "+20% XP from cardio quests",
    accent: "text-pink-300",
  },
  {
    id: "yogi",
    name: "Yogi",
    emoji: "🧘",
    blurb: "Mobility, breath and balance above all.",
    favored: "mobility",
    passive: "+20% XP from mobility quests",
    accent: "text-sky-300",
  },
  {
    id: "allrounder",
    name: "All-Rounder",
    emoji: "✨",
    blurb: "A little of everything, every single day.",
    favored: null,
    passive: "+10% XP from every quest",
    accent: "text-lime-300",
  },
];

export function heroClassDef(id: HeroClass): HeroClassDef {
  return HERO_CLASSES.find((c) => c.id === id) ?? HERO_CLASSES[3];
}

/** XP multiplier a class grants for a given quest category. */
export function classXpMultiplier(id: HeroClass | undefined, category: Quest["category"]): number {
  if (!id) return 1;
  const def = heroClassDef(id);
  if (def.favored === null) return 1.1; // all-rounder
  return def.favored === category ? 1.2 : 1;
}
