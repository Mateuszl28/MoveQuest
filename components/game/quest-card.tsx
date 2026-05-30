"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, Pause, Play, Swords, Timer, X } from "lucide-react";
import type { Quest } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { useGame } from "@/lib/game-store";
import { playSfx } from "@/lib/sound";
import { Icon } from "./icon";

const CATEGORY_COLOR: Record<Quest["category"], string> = {
  strength: "text-rose-300 bg-rose-500/15",
  cardio: "text-pink-300 bg-pink-500/15",
  mobility: "text-sky-300 bg-sky-500/15",
  wellness: "text-emerald-300 bg-emerald-500/15",
};

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export function QuestCard({
  quest,
  onComplete,
}: {
  quest: Quest;
  onComplete: (id: string) => void;
}) {
  const { state } = useGame();
  const sound = state.soundEnabled;
  const [remaining, setRemaining] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && remaining !== null) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r === null) return r;
          if (r <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setRunning(false);
            playSfx("tickDone", sound);
            setTimeout(() => onComplete(quest.id), 150);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, remaining, onComplete, quest.id, sound]);

  const startTimer = () => {
    setRemaining(quest.durationSec ?? 0);
    setRunning(true);
  };
  const cancelTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setRemaining(null);
  };
  const finishNow = () => {
    playSfx("complete", sound);
    onComplete(quest.id);
  };

  const timing = remaining !== null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl border p-3.5 transition-colors ${
        quest.completed
          ? "border-emerald-500/30 bg-emerald-500/10"
          : timing
            ? "border-lime-400/50 bg-lime-400/10"
            : "border-border bg-card/60 hover:border-lime-400/40"
      }`}
    >
      <div
        className={`grid size-11 shrink-0 place-items-center rounded-xl ${
          quest.completed ? "bg-emerald-500/20 text-emerald-300" : CATEGORY_COLOR[quest.category]
        }`}
      >
        <Icon name={quest.icon} className="size-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className={`truncate font-semibold ${quest.completed ? "text-emerald-200 line-through" : ""}`}>
          {quest.title}
        </p>
        {timing ? (
          <p className="mt-0.5 font-display text-lg font-extrabold tabular-nums text-lime-200">
            {fmt(remaining!)}
          </p>
        ) : (
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <Badge variant={quest.difficulty}>{quest.difficulty}</Badge>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-gold">+{quest.xpReward} XP</span>
            <span className="inline-flex items-center gap-1 text-xs text-rose-300/80">
              <Swords className="size-3" /> {quest.damage}
            </span>
            {quest.durationSec && !quest.completed && (
              <span className="inline-flex items-center gap-1 text-xs text-muted">
                <Timer className="size-3" /> {fmt(quest.durationSec)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* actions */}
      {quest.completed ? (
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-500/20 text-emerald-300">
          <Check className="size-5" />
        </span>
      ) : timing ? (
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={() => setRunning((r) => !r)}
            aria-label={running ? "Pause" : "Resume"}
            className="grid size-10 place-items-center rounded-xl border border-border bg-white/5 text-lime-200 active:scale-90"
          >
            {running ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
          <button
            onClick={cancelTimer}
            aria-label="Cancel timer"
            className="grid size-10 place-items-center rounded-xl border border-border bg-white/5 text-muted hover:text-rose-300 active:scale-90"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : quest.durationSec ? (
        <button
          onClick={startTimer}
          className="flex shrink-0 items-center gap-1.5 rounded-xl border border-lime-400/40 bg-lime-400/15 px-3 py-2 text-sm font-semibold text-lime-200 transition active:scale-90"
        >
          <Play className="size-4" /> Start
        </button>
      ) : (
        <button
          onClick={finishNow}
          aria-label={`Complete ${quest.title}`}
          className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-white/5 text-muted transition-all hover:border-emerald-400/50 hover:bg-emerald-500/15 hover:text-emerald-300 active:scale-90"
        >
          <Check className="size-5" />
        </button>
      )}
    </motion.div>
  );
}
