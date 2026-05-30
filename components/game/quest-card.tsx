"use client";

import { motion } from "framer-motion";
import { Check, Swords } from "lucide-react";
import type { Quest } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Icon } from "./icon";

const CATEGORY_COLOR: Record<Quest["category"], string> = {
  strength: "text-rose-300 bg-rose-500/15",
  cardio: "text-pink-300 bg-pink-500/15",
  mobility: "text-sky-300 bg-sky-500/15",
  wellness: "text-emerald-300 bg-emerald-500/15",
};

export function QuestCard({
  quest,
  onComplete,
}: {
  quest: Quest;
  onComplete: (id: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl border p-3.5 transition-colors ${
        quest.completed
          ? "border-emerald-500/30 bg-emerald-500/10"
          : "border-border bg-card/60 hover:border-violet-400/40"
      }`}
    >
      <div
        className={`grid size-11 shrink-0 place-items-center rounded-xl ${
          quest.completed ? "bg-emerald-500/20 text-emerald-300" : CATEGORY_COLOR[quest.category]
        }`}
      >
        <Icon name={quest.icon} className="size-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className={`truncate font-semibold ${quest.completed ? "text-emerald-200 line-through" : ""}`}>
          {quest.title}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <Badge variant={quest.difficulty}>{quest.difficulty}</Badge>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-gold">+{quest.xpReward} XP</span>
          <span className="inline-flex items-center gap-1 text-xs text-rose-300/80">
            <Swords className="size-3" /> {quest.damage}
          </span>
        </div>
      </div>

      {quest.completed ? (
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-500/20 text-emerald-300">
          <Check className="size-5" />
        </span>
      ) : (
        <button
          onClick={() => onComplete(quest.id)}
          aria-label={`Complete ${quest.title}`}
          className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-white/5 text-muted transition-all hover:border-emerald-400/50 hover:bg-emerald-500/15 hover:text-emerald-300 active:scale-90"
        >
          <Check className="size-5" />
        </button>
      )}
    </motion.div>
  );
}
