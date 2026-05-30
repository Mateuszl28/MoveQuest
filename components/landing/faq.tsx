"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Do I need any equipment?",
    a: "Nope. MoveQuest builds quests around bodyweight movement, walks, stretching and hydration. If you have a gym, quests scale up with your fitness level.",
  },
  {
    q: "How are daily quests generated?",
    a: "Our quest engine adapts to your fitness level, difficulty preference and streak. Each day you get a fresh, balanced set across cardio, strength, mobility and wellness.",
  },
  {
    q: "What happens if I miss a day?",
    a: "Your streak resets, but your XP, level and achievements are permanent. Bosses refresh daily, so there's always a fresh battle waiting.",
  },
  {
    q: "Is my data private?",
    a: "In this build everything lives locally in your browser — no account servers required. You own your adventure.",
  },
  {
    q: "Is it really free?",
    a: "Yes. MoveQuest is built to make movement fun. Start your quest, level up, and defeat the Sedentary Dragon — no credit card.",
  },
];

export function FAQ() {
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
