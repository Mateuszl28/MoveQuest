import type { Quest } from "./types";
import { dateKey, mulberry32, seedFromString } from "./utils";

export type EventType = "category-xp" | "boss-damage" | "coin-rush";

export interface DailyEvent {
  id: string;
  type: EventType;
  title: string;
  emoji: string;
  blurb: string;
  category?: Quest["category"];
}

const CATS: { c: Quest["category"]; label: string; emoji: string }[] = [
  { c: "cardio", label: "Cardio Carnival", emoji: "🏃" },
  { c: "strength", label: "Iron Day", emoji: "🏋️" },
  { c: "mobility", label: "Mobility Mania", emoji: "🤸" },
  { c: "wellness", label: "Wellness Wave", emoji: "🧊" },
];

export const EVENT_BONUS = 0.5; // +50%

/** A deterministic event for the day that grants a real bonus. */
export function generateDailyEvent(date?: Date): DailyEvent {
  const day = dateKey(date);
  const rnd = mulberry32(seedFromString(`event|${day}`));
  const roll = rnd();
  if (roll < 0.5) {
    const cat = CATS[Math.floor(rnd() * CATS.length)];
    return {
      id: `ev-${day}`,
      type: "category-xp",
      category: cat.c,
      emoji: cat.emoji,
      title: cat.label,
      blurb: `+${EVENT_BONUS * 100}% XP from ${cat.c} quests today`,
    };
  }
  if (roll < 0.78) {
    return {
      id: `ev-${day}`,
      type: "boss-damage",
      emoji: "⚔️",
      title: "Boss Frenzy",
      blurb: `Quests deal +${EVENT_BONUS * 100}% boss damage today`,
    };
  }
  return {
    id: `ev-${day}`,
    type: "coin-rush",
    emoji: "🪙",
    title: "Coin Rush",
    blurb: `+${EVENT_BONUS * 100}% coins from quests today`,
  };
}

export function eventXpMultiplier(e: DailyEvent, category: Quest["category"]): number {
  return e.type === "category-xp" && e.category === category ? 1 + EVENT_BONUS : 1;
}
export function eventDamageMultiplier(e: DailyEvent): number {
  return e.type === "boss-damage" ? 1 + EVENT_BONUS : 1;
}
export function eventCoinMultiplier(e: DailyEvent): number {
  return e.type === "coin-rush" ? 1 + EVENT_BONUS : 1;
}
