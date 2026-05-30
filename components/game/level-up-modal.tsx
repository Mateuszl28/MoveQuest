"use client";

import { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { useGame } from "@/lib/game-store";
import { playSfx } from "@/lib/sound";

const COLORS = ["#fbbf24", "#8b5cf6", "#3b82f6", "#22c55e", "#f472b6", "#fde68a"];

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 320,
        y: 120 + Math.random() * 260,
        rot: Math.random() * 720,
        delay: Math.random() * 0.25,
        color: COLORS[i % COLORS.length],
        size: 6 + Math.random() * 8,
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          animate={{ opacity: 0, x: p.x, y: p.y, rotate: p.rot }}
          transition={{ duration: 1.6, delay: p.delay, ease: "easeOut" }}
          className="absolute left-1/2 top-1/3"
          style={{ width: p.size, height: p.size, backgroundColor: p.color, borderRadius: 2 }}
        />
      ))}
    </div>
  );
}

export function LevelUpModal() {
  const { levelUp, dismissLevelUp, state } = useGame();
  useEffect(() => {
    if (levelUp !== null) playSfx("levelup", state.soundEnabled);
  }, [levelUp, state.soundEnabled]);
  return (
    <AnimatePresence>
      {levelUp !== null && (
        <motion.div
          className="fixed inset-0 z-[120] grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={dismissLevelUp}
        >
          <Confetti />
          <motion.div
            initial={{ scale: 0.7, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 18 }}
            onClick={(e) => e.stopPropagation()}
            className="glass glow-gold relative w-full max-w-sm rounded-3xl p-8 text-center"
          >
            <button
              onClick={dismissLevelUp}
              className="absolute right-4 top-4 text-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
            <motion.div
              animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="mx-auto mb-4 grid size-24 place-items-center rounded-3xl bg-gradient-to-br from-amber-300 to-amber-500 text-5xl shadow-2xl shadow-amber-500/40"
            >
              🎉
            </motion.div>
            <p className="flex items-center justify-center gap-1.5 text-sm font-semibold uppercase tracking-widest text-gold">
              <Sparkles className="size-4" /> Level Up!
            </p>
            <h2 className="mt-1 font-display text-5xl font-extrabold text-gold-gradient">Level {levelUp}</h2>
            <p className="mt-3 text-muted">
              Your dedication is paying off. New quests and tougher bosses await, hero!
            </p>
            <button
              onClick={dismissLevelUp}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-amber-300 to-amber-500 py-3 font-display font-bold text-amber-950 shadow-lg shadow-amber-500/30 active:scale-95"
            >
              Continue the Quest
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
