"use client";

import { dateKey } from "@/lib/utils";

const WEEKS = 12;

function bucketClass(xp: number): string {
  if (xp <= 0) return "bg-white/[0.05]";
  if (xp < 50) return "bg-lime-400/25";
  if (xp < 100) return "bg-lime-400/45";
  if (xp < 200) return "bg-lime-400/70";
  return "bg-lime-300";
}

export function ActivityHeatmap({ xpHistory }: { xpHistory: Record<string, number> }) {
  // build the last WEEKS weeks (columns), each Mon..Sun (rows)
  const today = new Date();
  const start = new Date(today);
  const dow = (today.getDay() + 6) % 7; // Monday = 0
  start.setDate(today.getDate() - dow - (WEEKS - 1) * 7);

  const columns: { key: string; xp: number; future: boolean; label: string }[][] = [];
  for (let w = 0; w < WEEKS; w++) {
    const col: { key: string; xp: number; future: boolean; label: string }[] = [];
    for (let d = 0; d < 7; d++) {
      const cell = new Date(start);
      cell.setDate(start.getDate() + w * 7 + d);
      const key = dateKey(cell);
      col.push({
        key,
        xp: xpHistory[key] ?? 0,
        future: cell > today,
        label: `${key}: ${xpHistory[key] ?? 0} XP`,
      });
    }
    columns.push(col);
  }

  const activeDays = Object.values(xpHistory).filter((v) => v > 0).length;
  const totalXp = Object.values(xpHistory).reduce((s, v) => s + v, 0);

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display font-bold">Activity</h3>
        <span className="text-xs text-muted">{activeDays} active days · {totalXp.toLocaleString()} XP</span>
      </div>

      <div className="flex gap-[3px] overflow-x-auto pb-1">
        {columns.map((col, i) => (
          <div key={i} className="flex flex-col gap-[3px]">
            {col.map((cell) => (
              <div
                key={cell.key}
                title={cell.label}
                className={`size-3.5 rounded-[3px] ${cell.future ? "opacity-0" : bucketClass(cell.xp)}`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-end gap-1.5 text-[11px] text-muted">
        <span>less</span>
        <span className="size-3 rounded-[3px] bg-white/[0.05]" />
        <span className="size-3 rounded-[3px] bg-lime-400/25" />
        <span className="size-3 rounded-[3px] bg-lime-400/45" />
        <span className="size-3 rounded-[3px] bg-lime-400/70" />
        <span className="size-3 rounded-[3px] bg-lime-300" />
        <span>more</span>
      </div>
    </div>
  );
}
