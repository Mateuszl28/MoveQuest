"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Swords, Trophy } from "lucide-react";
import type { Boss } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export function BossBattle({ boss }: { boss: Boss | null }) {
  const prevHp = useRef(boss?.hp ?? 0);
  const [hit, setHit] = useState(false);
  const [popups, setPopups] = useState<{ id: number; dmg: number }[]>([]);
  const counter = useRef(0);

  useEffect(() => {
    if (!boss) return;
    const dmg = prevHp.current - boss.hp;
    if (dmg > 0) {
      setHit(true);
      const id = ++counter.current;
      setPopups((p) => [...p, { id, dmg }]);
      const t1 = setTimeout(() => setHit(false), 380);
      const t2 = setTimeout(() => setPopups((p) => p.filter((x) => x.id !== id)), 1000);
      prevHp.current = boss.hp;
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    prevHp.current = boss.hp;
  }, [boss?.hp, boss]);

  if (!boss) return null;
  const pct = (boss.hp / boss.maxHp) * 100;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-rose-400/25 bg-gradient-to-br from-rose-500/10 via-card/70 to-violet-500/10 p-5">
      <div className="mb-3 flex items-center justify-between">
        <Badge variant="hard"><Swords className="size-3.5" /> Daily Boss</Badge>
        <span className="text-xs text-muted">+{boss.bonusXp} XP on defeat</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <motion.div
            animate={
              boss.defeated
                ? { rotate: 0, scale: 0.8, opacity: 0.4, filter: "grayscale(1)" }
                : hit
                  ? { x: [0, -8, 8, -5, 0], rotate: [0, -6, 6, 0] }
                  : { y: [0, -6, 0] }
            }
            transition={boss.defeated ? { duration: 0.5 } : hit ? { duration: 0.38 } : { duration: 3, repeat: Infinity }}
            className="select-none text-6xl drop-shadow-[0_0_20px_rgba(244,63,94,0.4)]"
          >
            {boss.defeated ? "💀" : boss.emoji}
          </motion.div>
          {/* floating damage numbers */}
          <AnimatePresence>
            {popups.map((p) => (
              <motion.span
                key={p.id}
                initial={{ opacity: 1, y: 0, scale: 0.8 }}
                animate={{ opacity: 0, y: -44, scale: 1.3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute left-1/2 top-0 -translate-x-1/2 font-display text-xl font-black text-rose-400"
              >
                -{p.dmg}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-bold leading-tight">{boss.name}</p>
          <p className="text-xs text-muted">{boss.title}</p>

          <div className="mt-3">
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-rose-300">HP</span>
              <span className="font-semibold tabular-nums">{boss.hp} / {boss.maxHp}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10 ring-1 ring-inset ring-white/5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-rose-500 to-red-600"
                animate={{ width: `${pct}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
              />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {boss.defeated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-gold/30 bg-gold/10 py-2 text-sm font-semibold text-gold"
          >
            <Trophy className="size-4" /> Boss defeated! +{boss.bonusXp} bonus XP
          </motion.div>
        )}
      </AnimatePresence>

      {!boss.defeated && (
        <p className="mt-4 text-center text-xs text-muted">
          Complete quests to deal damage ⚔️
        </p>
      )}
    </div>
  );
}
