"use client";

import { motion } from "framer-motion";
import {
  Activity, Coins, Dumbbell, Flame, Flower2, ListChecks, Star, Swords, Trophy,
} from "lucide-react";
import type { GameState } from "@/lib/types";
import { levelFromXp } from "@/lib/utils";
import { nextRank, rankForLevel } from "@/lib/ranks";
import { useT } from "@/lib/i18n";

export function StatsPanel({ state }: { state: GameState }) {
  const { t } = useT();
  const level = levelFromXp(state.totalXp);
  const rank = rankForLevel(level);
  const next = nextRank(level);
  const unlocked = state.achievements.filter((a) => a.unlocked).length;

  const items = [
    { icon: Star, label: t("stats.totalxp", "Total XP"), value: state.totalXp.toLocaleString(), color: "text-gold" },
    { icon: Coins, label: t("stats.coins", "Coins"), value: state.coins.toLocaleString(), color: "text-gold" },
    { icon: ListChecks, label: t("stats.questsdone", "Quests done"), value: state.counters.questsCompleted, color: "text-lime-300" },
    { icon: Swords, label: t("stats.bosses", "Bosses slain"), value: state.counters.bossesDefeated, color: "text-rose-300" },
    { icon: Flame, label: t("stats.beststreak", "Best streak"), value: `${state.streak.best}d`, color: "text-orange-300" },
    { icon: Dumbbell, label: t("stats.squats", "Squats"), value: state.counters.squats, color: "text-rose-300" },
    { icon: Flower2, label: t("stats.stretched", "Min. stretched"), value: state.counters.minutesStretched, color: "text-sky-300" },
    { icon: Trophy, label: t("stats.achievements", "Achievements"), value: `${unlocked}/${state.achievements.length}`, color: "text-emerald-300" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="size-5 text-lime-300" />
        <h3 className="font-display font-bold">{t("stats.title", "Lifetime stats")}</h3>
      </div>

      <div className="mb-4 rounded-xl border border-border bg-white/5 p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">{rank.emoji} {t(`rank.${rank.name}`, rank.name)}</span>
          {next ? (
            <span className="text-xs text-muted">{t("stats.next", "Next")}: {next.emoji} {t(`rank.${next.name}`, next.name)} (Lvl {next.minLevel})</span>
          ) : (
            <span className="text-xs text-gold">{t("stats.maxrank", "Max rank reached 👑")}</span>
          )}
        </div>
        {next && (
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-lime-400/15 ring-1 ring-inset ring-lime-400/30"
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
