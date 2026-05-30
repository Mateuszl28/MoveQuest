"use client";

import { motion } from "framer-motion";
import {
  Activity, Coins, Dumbbell, Flame, Flower2, ListChecks, Star, Swords, Trophy,
} from "lucide-react";
import type { GameState } from "@/lib/types";
import { levelFromXp } from "@/lib/utils";
import { nextRank, rankForLevel } from "@/lib/ranks";

export function StatsPanel({ state }: { state: GameState }) {
  const level = levelFromXp(state.totalXp);
  const rank = rankForLevel(level);
  const next = nextRank(level);
  const unlocked = state.achievements.filter((a) => a.unlocked).length;

  const items = [
    { icon: Star, label: "Total XP", value: state.totalXp.toLocaleString(), color: "text-gold" },
    { icon: Coins, label: "Coins", value: state.coins.toLocaleString(), color: "text-gold" },
    { icon: ListChecks, label: "Quests done", value: state.counters.questsCompleted, color: "text-violet-300" },
    { icon: Swords, label: "Bosses slain", value: state.counters.bossesDefeated, color: "text-rose-300" },
    { icon: Flame, label: "Best streak", value: `${state.streak.best}d`, color: "text-orange-300" },
    { icon: Dumbbell, label: "Squats", value: state.counters.squats, color: "text-rose-300" },
    { icon: Flower2, label: "Min. stretched", value: state.counters.minutesStretched, color: "text-sky-300" },
    { icon: Trophy, label: "Achievements", value: `${unlocked}/${state.achievements.length}`, color: "text-emerald-300" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="size-5 text-violet-300" />
        <h3 className="font-display font-bold">Lifetime stats</h3>
      </div>

      <div className="mb-4 rounded-xl border border-border bg-white/5 p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">{rank.emoji} {rank.name}</span>
          {next ? (
            <span className="text-xs text-muted">Next: {next.emoji} {next.name} (Lvl {next.minLevel})</span>
          ) : (
            <span className="text-xs text-gold">Max rank reached 👑</span>
          )}
        </div>
        {next && (
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
              animate={{ width: `${Math.min(100, (level / next.minLevel) * 100)}%` }}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {items.map((it, i) => (
          <motion.div
            key={it.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="rounded-xl border border-border bg-white/5 p-3"
          >
            <it.icon className={`size-4 ${it.color}`} />
            <p className={`mt-1.5 font-display text-xl font-extrabold ${it.color}`}>{it.value}</p>
            <p className="text-[11px] text-muted">{it.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
