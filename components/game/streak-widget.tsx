"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import type { StreakState } from "@/lib/types";
import { dateKey } from "@/lib/utils";

const MILESTONES = [3, 7, 14, 30];
const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export function StreakWidget({ streak }: { streak: StreakState }) {
  // last 7 days (Mon-anchored visual): build from today backwards
  const today = new Date();
  const last7: { key: string; active: boolean }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = dateKey(d);
    last7.push({ key, active: streak.activeDays.includes(key) });
  }
  const nextMilestone = MILESTONES.find((m) => m > streak.current) ?? MILESTONES[MILESTONES.length - 1];

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 shadow-lg shadow-orange-500/30"
          >
            <Flame className="size-6 text-white" />
          </motion.div>
          <div>
            <p className="font-display text-2xl font-extrabold leading-none">{streak.current}</p>
            <p className="text-xs text-muted">day streak</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-display text-lg font-bold text-gold">{streak.best}</p>
          <p className="text-xs text-muted">best</p>
        </div>
      </div>

      {/* weekly consistency */}
      <div className="mt-5 flex justify-between gap-1.5">
        {last7.map((d, i) => (
          <div key={d.key} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={`grid aspect-square w-full place-items-center rounded-lg text-xs font-bold ${
                d.active
                  ? "bg-gradient-to-br from-orange-400 to-rose-500 text-white"
                  : "bg-white/5 text-muted"
              }`}
            >
              {d.active ? "🔥" : ""}
            </div>
            <span className="text-[10px] text-muted">{DAY_LABELS[i]}</span>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-muted">
          <span>Next reward</span>
          <span>{streak.current}/{nextMilestone} days</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-orange-400 to-rose-500"
            animate={{ width: `${Math.min(100, (streak.current / nextMilestone) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
