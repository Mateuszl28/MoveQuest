/** Back-to-back quest completions within this window build a combo. */
export const COMBO_WINDOW_MS = 20 * 60 * 1000; // 20 minutes

/** XP multiplier for a given combo count (x1.0 → x1.5, capped). */
export function comboMultiplier(count: number): number {
  return 1 + Math.min(Math.max(count - 1, 0), 5) * 0.1;
}

export function comboBonusPct(count: number): number {
  return Math.round((comboMultiplier(count) - 1) * 100);
}

/** Is a combo with this timestamp still live right now? */
export function comboActive(lastTs: number, now: number): boolean {
  return lastTs > 0 && now - lastTs <= COMBO_WINDOW_MS;
}
