export interface WheelPrize {
  label: string;
  color: string; // hex for the slice
  coins?: number;
  xp?: number;
  freeze?: number;
}

/** Eight slices for the daily fortune wheel. */
export const WHEEL: WheelPrize[] = [
  { label: "50🪙", color: "#a3e635", coins: 50 },
  { label: "30 XP", color: "#34d399", xp: 30 },
  { label: "120🪙", color: "#f5b73c", coins: 120 },
  { label: "Freeze ❄️", color: "#38bdf8", freeze: 1 },
  { label: "75 XP", color: "#bef264", xp: 75 },
  { label: "200🪙", color: "#fbbf24", coins: 200 },
  { label: "20 XP", color: "#4ade80", xp: 20 },
  { label: "300🪙", color: "#facc15", coins: 300 },
];

export const SLICE_DEG = 360 / WHEEL.length;
