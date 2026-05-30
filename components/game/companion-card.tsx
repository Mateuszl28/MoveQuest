"use client";

import { motion } from "framer-motion";
import { PawPrint } from "lucide-react";
import {
  COMPANIONS,
  companionById,
  companionEmoji,
  companionStageIndex,
  nextEvolutionLevel,
} from "@/lib/companions";

const STAGE_NAMES = ["Egg", "Hatchling", "Beast", "Legendary"];

export function CompanionCard({
  companion,
  level,
  onChange,
}: {
  companion: string;
  level: number;
  onChange: (id: string) => void;
}) {
  const def = companionById(companion);
  const stage = companionStageIndex(level);
  const emoji = companionEmoji(companion, level);
  const next = nextEvolutionLevel(level);

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5">
      <div className="mb-3 flex items-center gap-2">
        <PawPrint className="size-5 text-lime-300" />
        <h3 className="font-display font-bold">Companion</h3>
      </div>

      <div className="flex items-center gap-4">
        <motion.div
          key={emoji}
          initial={{ scale: 0.6, rotate: -10 }}
          animate={{ scale: 1, rotate: 0, y: [0, -6, 0] }}
          transition={{ y: { duration: 3, repeat: Infinity }, scale: { type: "spring", stiffness: 220 } }}
          className="grid size-20 shrink-0 place-items-center rounded-2xl bg-lime-400/10 ring-1 ring-inset ring-lime-400/25 text-5xl"
        >
          {emoji}
        </motion.div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-bold leading-tight">{def.name}</p>
          <p className="text-xs font-semibold text-lime-300">{STAGE_NAMES[stage]} · stage {stage + 1}/4</p>
          <p className="mt-1 text-xs text-muted">
            {next ? `Evolves at level ${next}` : "Fully evolved 👑"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {COMPANIONS.map((c) => (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            title={c.blurb}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2 text-sm font-medium transition-all ${
              companion === c.id
                ? "border-lime-400 bg-lime-400/15"
                : "border-border bg-white/5 hover:bg-white/10"
            }`}
          >
            <span className="text-lg">{c.stages[stage]}</span>
            <span className="hidden sm:inline">{c.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
