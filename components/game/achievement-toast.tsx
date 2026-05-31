"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "@/lib/game-store";
import { Icon } from "./icon";
import { useT } from "@/lib/i18n";

export function AchievementToast() {
  const { toast } = useGame();
  const { t } = useT();
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex justify-center px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ y: -60, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -40, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="glass glow-gold flex items-center gap-3 rounded-2xl px-4 py-3 shadow-2xl"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950 shadow-lg shadow-amber-500/40">
              <Icon name={toast.icon} className="size-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gold">
                {t("ach.unlocked", "Achievement unlocked")}
              </p>
              <p className="font-display font-bold leading-tight">{t(`ach.${toast.id}.t`, toast.title)}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
