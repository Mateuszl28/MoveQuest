"use client";

import { motion } from "framer-motion";
import { CalendarRange, Coins, Star, Trophy } from "lucide-react";
import { generateWeeklyChallenge, weeklyXpEarned } from "@/lib/weekly";

export function WeeklyChallenge({
  level,
  xpHistory,
  claimedWeeks,
  onClaim,
}: {
  level: number;
  xpHistory: Record<string, number>;
  claimedWeeks: string[];
  onClaim: (id: string, coins: number, xp: number) => void;
}) {
  const ch = generateWeeklyChallenge(level);
  const earned = weeklyXpEarned(xpHistory);
  const pct = Math.min(100, (earned / ch.targetXp) * 100);
  const met = earned >= ch.targetXp;
  const claimed = claimedWeeks.includes(ch.id);

  return (
    <div className="rounded-2xl border border-lime-400/25 bg-gradient-to-br from-lime-500/10 via-card/70 to-emerald-500/10 p-5">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarRange className="size-5 text-lime-300" />
          <h3 className="font-display font-bold">Weekly Challenge</h3>
        </div>
        <span className="flex items-center gap-2 text-xs text-muted">
          <span className="inline-flex items-center gap-0.5 text-gold"><Coins className="size-3.5" />{ch.rewardCoins}</span>
          <span className="inline-flex items-center gap-0.5 text-gold"><Star className="size-3.5" />{ch.rewardXp}</span>
        </span>
      </div>

      <p className="text-sm text-muted">{ch.title}</p>

      <div className="mt-3 mb-1 flex justify-between text-xs">
        <span className="text-muted">progress</span>
        <span className="font-semibold tabular-nums">{earned.toLocaleString()} / {ch.targetXp.toLocaleString()}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className={`h-full rounded-full ${met ? "bg-gradient-to-r from-emerald-400 to-green-500" : "bg-gradient-to-r from-lime-400 to-lime-300"}`}
          animate={{ width: `${pct}%` }}
        />
      </div>

      {claimed ? (
        <div className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/10 py-2 text-sm font-semibold text-emerald-300">
          <Trophy className="size-4" /> Claimed — see you next week!
        </div>
      ) : met ? (
        <button
          onClick={() => onClaim(ch.id, ch.rewardCoins, ch.rewardXp)}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-300 to-amber-500 py-2 text-sm font-bold text-amber-950 active:scale-95"
        >
          <Trophy className="size-4" /> Claim reward
        </button>
      ) : null}
    </div>
  );
}
