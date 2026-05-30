"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useT } from "@/lib/i18n";

export function FAQ() {
  const { t } = useT();
  const FAQS = [
    { q: t("faq.q1", "Do I need any equipment?"), a: t("faq.a1", "Nope. MoveQuest builds quests around bodyweight movement, walks, stretching and hydration. If you have a gym, quests scale up with your fitness level.") },
    { q: t("faq.q2", "How are daily quests generated?"), a: t("faq.a2", "Our quest engine adapts to your fitness level, difficulty preference and streak. Each day you get a fresh, balanced set across cardio, strength, mobility and wellness.") },
    { q: t("faq.q3", "What happens if I miss a day?"), a: t("faq.a3", "Your streak resets, but your XP, level and achievements are permanent. Bosses refresh daily, so there's always a fresh battle waiting.") },
    { q: t("faq.q4", "Is my data private?"), a: t("faq.a4", "In this build everything lives locally in your browser — no account servers required. You own your adventure.") },
    { q: t("faq.q5", "Is it really free?"), a: t("faq.a5", "Yes. MoveQuest is built to make movement fun. Start your quest, level up, and defeat the Sedentary Dragon — no credit card.") },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur"
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left"
            >
              <span className="font-semibold">{f.q}</span>
              <ChevronDown
                className={`size-5 shrink-0 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="px-5 pb-5 text-muted">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
