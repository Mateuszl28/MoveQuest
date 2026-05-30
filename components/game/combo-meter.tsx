"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flame } from "lucide-react";
import { COMBO_WINDOW_MS, comboActive, comboBonusPct } from "@/lib/combo";

export function ComboMeter({ count, lastTs }: { count: number; lastTs: number }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  const active = comboActive(lastTs, now) && count >= 2;
  const remainingPct = active ? Math.max(0, 100 - ((now - lastTs) / COMBO_WINDOW_MS) * 100) : 0;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="overflow-hidden rounded-xl border border-orange-400/40 bg-gradient-to-r from-orange-500/15 to-rose-500/10 px-3 py-2"
        >
          <div className="flex items-center gap-2">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Flame className="size-4 text-orange-300" />
            </motion.span>
            <span className="text-sm font-bold text-orange-200">Combo ×{count}</span>
            <span className="text-xs font-semibold text-gold">+{comboBonusPct(count)}% XP</span>
            <span className="ml-auto text-[11px] text-muted">keep going!</span>
          </div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-400 to-rose-500 transition-[width] duration-1000 ease-linear"
              style={{ width: `${remainingPct}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
