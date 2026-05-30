"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import type { GameState } from "@/lib/types";
import { ACHIEVEMENTS, achievementProgress } from "@/lib/achievements";
import { Icon } from "./icon";

const TIER: Record<string, { ring: string; grad: string; label: string }> = {
  bronze: { ring: "ring-orange-400/40", grad: "from-orange-300 to-amber-600", label: "Bronze" },
  silver: { ring: "ring-slate-300/40", grad: "from-slate-200 to-slate-400", label: "Silver" },
  gold: { ring: "ring-amber-300/50", grad: "from-amber-300 to-amber-500", label: "Gold" },
  legendary: { ring: "ring-fuchsia-400/50", grad: "from-fuchsia-400 to-lime-500", label: "Legendary" },
};

export function AchievementsGallery({
  state,
  limit,
}: {
  state: GameState;
  limit?: number;
}) {
  const items = ACHIEVEMENTS.map((def) => {
    const a = state.achievements.find((x) => x.id === def.id)!;
    return { def, unlocked: a.unlocked, progress: achievementProgress(def.id, state) };
  }).sort((a, b) => Number(b.unlocked) - Number(a.unlocked) || b.progress - a.progress);

  const shown = limit ? items.slice(0, limit) : items;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {shown.map(({ def, unlocked, progress }, i) => {
        const tier = TIER[def.tier];
        return (
          <motion.div
            key={def.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            className={`relative flex flex-col items-center rounded-2xl border p-4 text-center ${
              unlocked ? `border-transparent bg-white/5 ring-1 ${tier.ring}` : "border-border bg-card/40"
            }`}
          >
            <div
              className={`mb-3 grid size-14 place-items-center rounded-2xl ${
                unlocked ? `bg-gradient-to-br ${tier.grad} shadow-lg` : "bg-white/5"
              }`}
            >
              {unlocked ? (
                <Icon name={def.icon} className="size-7 text-white drop-shadow" />
              ) : (
                <Lock className="size-6 text-muted" />
              )}
            </div>
            <p className={`text-sm font-bold ${unlocked ? "" : "text-muted"}`}>{def.title}</p>
            <p className="mt-0.5 line-clamp-2 text-[11px] text-muted">{def.description}</p>
            {!unlocked && (
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-lime-400/15 ring-1 ring-inset ring-lime-400/30"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
            )}
            {unlocked && (
              <span className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-gold">
                {tier.label}
              </span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
