"use client";

import { motion } from "framer-motion";
import { Coins, Gift, Star } from "lucide-react";
import { DAILY_REWARD } from "@/lib/shop";
import { dateKey } from "@/lib/utils";

export function DailyReward({
  lastRewardDate,
  onClaim,
}: {
  lastRewardDate: string | null;
  onClaim: () => void;
}) {
  const claimed = lastRewardDate === dateKey();

  return (
    <div className="overflow-hidden rounded-2xl border border-amber-300/30 bg-gradient-to-br from-amber-400/10 via-card/70 to-orange-500/10 p-5">
      <div className="flex items-center gap-4">
        <motion.div
          animate={claimed ? {} : { rotate: [0, -10, 10, -6, 0], y: [0, -4, 0] }}
          transition={{ duration: 1.6, repeat: claimed ? 0 : Infinity }}
          className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 text-3xl shadow-lg shadow-amber-500/30"
        >
          🎁
        </motion.div>
        <div className="min-w-0 flex-1">
          <p className="font-display font-bold leading-tight">Daily Reward</p>
          <p className="flex flex-wrap items-center gap-x-3 text-xs text-muted">
            <span className="inline-flex items-center gap-1 text-gold"><Coins className="size-3.5" /> +{DAILY_REWARD.coins}</span>
            <span className="inline-flex items-center gap-1 text-gold"><Star className="size-3.5" /> +{DAILY_REWARD.xp} XP</span>
          </p>
        </div>
      </div>
      <button
        onClick={onClaim}
        disabled={claimed}
        className={`mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-bold transition active:scale-95 ${
          claimed
            ? "cursor-not-allowed bg-white/5 text-muted"
            : "bg-gradient-to-r from-amber-300 to-amber-500 text-amber-950 shadow-lg shadow-amber-500/25"
        }`}
      >
        <Gift className="size-4" /> {claimed ? "Claimed — back tomorrow" : "Claim daily reward"}
      </button>
    </div>
  );
}
