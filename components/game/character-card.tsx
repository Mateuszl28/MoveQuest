"use client";

import { motion } from "framer-motion";
import { Dumbbell, Wind, Sparkles, CalendarCheck } from "lucide-react";
import type { CharacterStats } from "@/lib/types";
import { StatRadar } from "./stat-radar";

const STAT_META = [
  { key: "strength", label: "Strength", icon: Dumbbell, color: "from-rose-400 to-red-500", text: "text-rose-300" },
  { key: "endurance", label: "Endurance", icon: Wind, color: "from-pink-400 to-fuchsia-500", text: "text-pink-300" },
  { key: "agility", label: "Agility", icon: Sparkles, color: "from-sky-400 to-blue-500", text: "text-sky-300" },
  { key: "consistency", label: "Consistency", icon: CalendarCheck, color: "from-emerald-400 to-green-500", text: "text-emerald-300" },
] as const;

export function CharacterCard({ stats }: { stats: CharacterStats }) {
  const max = Math.max(1, ...Object.values(stats));
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <StatRadar stats={stats} />
        <div className="grid grid-cols-2 gap-2.5">
          {STAT_META.map((s, i) => {
            const value = stats[s.key];
            return (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-white/5 p-3"
              >
                <div className="flex items-center gap-2">
                  <span className={`grid size-7 place-items-center rounded-lg bg-gradient-to-br ${s.color}`}>
                    <s.icon className="size-4 text-white" />
                  </span>
                  <span className="text-xs text-muted">{s.label}</span>
                </div>
                <p className={`mt-1.5 font-display text-2xl font-extrabold ${s.text}`}>{value}</p>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${s.color}`}
                    animate={{ width: `${(value / max) * 100}%` }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
