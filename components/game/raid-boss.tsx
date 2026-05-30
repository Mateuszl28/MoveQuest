"use client";

import { motion } from "framer-motion";
import { Swords, Trophy, Coins, Star } from "lucide-react";
import type { Raid } from "@/lib/types";

export function RaidBoss({ raid }: { raid: Raid | null }) {
  if (!raid) return null;
  const pct = (raid.hp / raid.maxHp) * 100;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-fuchsia-400/30 bg-gradient-to-br from-fuchsia-500/12 via-card/70 to-rose-500/10 p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 rounded-full bg-fuchsia-500/15 px-2.5 py-0.5 text-xs font-semibold text-fuchsia-200 ring-1 ring-inset ring-fuchsia-400/30">
          <Swords className="size-3.5" /> Weekly Raid
        </span>
        <span className="flex items-center gap-2 text-xs text-muted">
          <span className="inline-flex items-center gap-0.5 text-gold"><Star className="size-3.5" />{raid.bonusXp}</span>
          <span className="inline-flex items-center gap-0.5 text-gold"><Coins className="size-3.5" />{raid.bonusCoins}</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <motion.div
          animate={raid.defeated ? { filter: "grayscale(1)", opacity: 0.4, scale: 0.85 } : { scale: [1, 1.06, 1] }}
          transition={raid.defeated ? { duration: 0.5 } : { duration: 4, repeat: Infinity }}
          className="select-none text-6xl drop-shadow-[0_0_22px_rgba(217,70,239,0.4)]"
        >
          {raid.defeated ? "💀" : raid.emoji}
        </motion.div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-bold leading-tight">{raid.name}</p>
          <p className="text-xs text-muted">{raid.title}</p>
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-fuchsia-200">HP</span>
              <span className="font-semibold tabular-nums">{raid.hp} / {raid.maxHp}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10 ring-1 ring-inset ring-white/5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-rose-500"
                animate={{ width: `${pct}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
              />
            </div>
          </div>
        </div>
      </div>

      {raid.defeated ? (
        <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-gold/30 bg-gold/10 py-2 text-sm font-semibold text-gold">
          <Trophy className="size-4" /> Raid cleared — legendary!
        </div>
      ) : (
        <p className="mt-4 text-center text-xs text-muted">Every quest you finish this week chips away at it ⚔️</p>
      )}
    </div>
  );
}
