"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import type { GameState } from "@/lib/types";
import { levelFromXp } from "@/lib/utils";
import { useT } from "@/lib/i18n";

interface Msg { role: "coach" | "user"; text: string }

/** A lightweight, offline "AI" coach. Context-aware, rule-based replies. */
function reply(input: string, s: GameState): string {
  const q = input.toLowerCase();
  const level = levelFromXp(s.totalXp);
  const remaining = s.quests.filter((x) => !x.completed).length;
  const done = s.quests.length - remaining;

  if (/streak/.test(q))
    return `You're on a ${s.streak.current}-day streak (best: ${s.streak.best}). Complete just one quest today to keep the fire alive! 🔥`;
  if (/quest|today|do/.test(q))
    return remaining === 0
      ? "You've cleared every quest today — legendary! Rest up and come back tomorrow for a fresh set. 🏆"
      : `You have ${remaining} quest${remaining > 1 ? "s" : ""} left today. Knock out an easy one first to build momentum — every rep damages the boss! ⚔️`;
  if (/boss/.test(q))
    return s.boss && !s.boss.defeated
      ? `${s.boss.name} has ${s.boss.hp}/${s.boss.maxHp} HP left. Finish ${Math.ceil(s.boss.hp / 22)} more quests to take it down for +${s.boss.bonusXp} XP! 💥`
      : "Today's boss is defeated — incredible work! A new one spawns tomorrow.";
  if (/level|xp/.test(q))
    return `You're level ${level} with ${s.totalXp.toLocaleString()} XP. Keep stacking quests — hard ones give 100 XP each!`;
  if (/tired|lazy|motivat|hard|cant|can't/.test(q))
    return "Start absurdly small: 5 squats or a 2-minute stretch. Motion creates motivation — and your boss won't fight itself. You've got this. 💪";
  if (/water|hydrat/.test(q))
    return "Hydration is a quest too! Aim for 2L today — your Wellness stat (and your brain) will thank you. 💧";
  if (/hi|hello|hey|yo/.test(q))
    return `Hey adventurer! You've completed ${done}/${s.quests.length} quests today. What's the plan — want a nudge on quests, your streak, or the boss?`;
  return "I'm your movement coach! Ask me about your quests, streak, the daily boss, or how to stay motivated. 🎯";
}

export function Coach({ state }: { state: GameState }) {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "coach", text: "Hey! I'm Quill, your movement coach. Ask me anything — quests, streaks, or beating today's boss. 🦉" },
  ]);
  const { t } = useT();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const r = reply(text, state);
    setMsgs((m) => [...m, { role: "user", text }, { role: "coach", text: r }]);
    setInput("");
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }));
  };

  const suggestions = [t("coach.s1", "What should I do today?"), t("coach.s2", "How's my streak?"), t("coach.s3", "I feel lazy")];

  return (
    <div className="flex h-[28rem] flex-col rounded-2xl border border-border bg-card/60">
      <div className="flex items-center gap-2 border-b border-border p-4">
        <span className="grid size-9 place-items-center rounded-xl bg-lime-400/15 ring-1 ring-inset ring-lime-400/30 text-lg">🦉</span>
        <div>
          <p className="font-display font-bold leading-tight">{t("coach.name", "Coach Quill")}</p>
          <p className="text-xs text-emerald-400">● {t("coach.online", "online")}</p>
        </div>
        <Sparkles className="ml-auto size-4 text-lime-300" />
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {msgs.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                m.role === "user"
                  ? "bg-lime-400/15 ring-1 ring-inset ring-lime-400/30 text-white"
                  : "border border-border bg-white/5"
              }`}
            >
              {m.text}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="border-t border-border p-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => { setInput(s); }}
              className="rounded-full border border-border bg-white/5 px-2.5 py-1 text-xs text-muted hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={t("coach.placeholder", "Ask your coach…")}
            className="flex-1 rounded-xl border border-border bg-white/5 px-3.5 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          />
          <button
            onClick={send}
            className="grid size-10 shrink-0 place-items-center rounded-xl bg-lime-400/15 ring-1 ring-inset ring-lime-400/30 text-white active:scale-90"
          >
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
