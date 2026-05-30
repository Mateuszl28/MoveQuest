"use client";

import { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "@/lib/game-store";
import { playSfx } from "@/lib/sound";

const COLORS = ["#a3e635", "#bef264", "#34d399", "#f5b73c", "#fde68a"];

function Burst() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 340,
        y: 120 + Math.random() * 240,
        rot: Math.random() * 640,
        delay: Math.random() * 0.2,
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
          transition={{ duration: 1.5, delay: p.delay, ease: "easeOut" }}
          className="absolute left-1/2 top-1/3"
          style={{ width: p.size, height: p.size, backgroundColor: p.color, borderRadius: 2 }}
        />
      ))}
    </div>
  );
}

export function PerfectDayModal() {
  const { perfectDay, dismissPerfectDay, state } = useGame();
  useEffect(() => {
    if (perfectDay) playSfx("levelup", state.soundEnabled);
  }, [perfectDay, state.soundEnabled]);

  return (
    <AnimatePresence>
      {perfectDay && (
        <motion.div
          className="fixed inset-0 z-[120] grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={dismissPerfectDay}
        >
          <Burst />
          <motion.div
            initial={{ scale: 0.7, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 18 }}
            onClick={(e) => e.stopPropagation()}
            className="glass glow-primary relative w-full max-w-sm rounded-3xl p-8 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="mx-auto mb-4 grid size-24 place-items-center rounded-3xl bg-lime-300 text-5xl shadow-[0_0_50px_-8px_rgba(163,230,53,0.8)]"
            >
              🏅
            </motion.div>
            <p className="text-sm font-semibold uppercase tracking-widest text-lime-300">Perfect Day</p>
            <h2 className="mt-1 font-display text-4xl font-extrabold text-gradient">All quests cleared!</h2>
            <p className="mt-3 text-muted">Flawless. Bonus reward earned:</p>
            <p className="mt-1 font-display text-lg font-bold text-gold">+100 XP · +50 🪙</p>
            <button
              onClick={dismissPerfectDay}
              className="mt-6 w-full rounded-2xl bg-lime-300 py-3 font-display font-bold text-[#15200a] active:scale-95"
            >
              Let&apos;s go!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
