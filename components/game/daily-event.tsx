"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { generateDailyEvent } from "@/lib/events";

export function DailyEvent() {
  const e = generateDailyEvent();
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 rounded-2xl border border-lime-400/30 bg-gradient-to-r from-lime-500/12 to-emerald-500/8 px-4 py-3"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-lime-400/15 text-xl ring-1 ring-inset ring-lime-400/25">
        {e.emoji}
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-sm font-bold">
          <Sparkles className="size-3.5 text-lime-300" /> Today&apos;s Event · {e.title}
        </p>
        <p className="truncate text-xs text-muted">{e.blurb}</p>
      </div>
    </motion.div>
  );
}
