"use client";

import { motion } from "framer-motion";
import { Footprints, Plus, Activity, Link2 } from "lucide-react";
import type { GameState } from "@/lib/types";
import { dateKey } from "@/lib/utils";
import { useT } from "@/lib/i18n";

export function StepsWidget({
  state,
  onAddSteps,
  onCompleteQuest,
}: {
  state: GameState;
  onAddSteps: (n: number) => void;
  onCompleteQuest: (id: string) => void;
}) {
  const { t } = useT();
  const today = dateKey();
  const steps = state.steps[today] ?? 0;
  const stepQuest = state.quests.find((q) => q.stepGoal);
  const goal = stepQuest?.stepGoal ?? 6000;
  const pct = Math.min(100, (steps / goal) * 100);
  const reached = steps >= goal;
  const claimable = reached && stepQuest && !stepQuest.completed;

  const fit = () => alert("Google Fit / Apple Health sync is coming soon — for now, log steps manually or simulate a walk.");

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Footprints className="size-5 text-pink-300" />
          <h3 className="font-display font-bold">{t("steps.title", "Steps today")}</h3>
        </div>
        <button
          onClick={fit}
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-white/5 px-2 py-1 text-[11px] text-muted hover:text-foreground"
        >
          <Link2 className="size-3" /> {t("steps.connect", "Connect Fit")}
        </button>
      </div>

      <div className="flex items-end justify-between">
        <p className="font-display text-3xl font-extrabold tabular-nums">{steps.toLocaleString()}</p>
        <p className="text-xs text-muted">{t("steps.goal", "goal")} {goal.toLocaleString()}</p>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className={`h-full rounded-full ${reached ? "bg-gradient-to-r from-emerald-400 to-green-500" : "bg-gradient-to-r from-pink-400 to-fuchsia-500"}`}
          animate={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {[500, 2000].map((n) => (
          <button
            key={n}
            onClick={() => onAddSteps(n)}
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-white/5 px-3 py-1.5 text-sm font-medium hover:bg-white/10 active:scale-95"
          >
            <Plus className="size-3.5" /> {n.toLocaleString()}
          </button>
        ))}
        <button
          onClick={() => onAddSteps(800 + Math.floor((steps % 7) * 130))}
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-white/5 px-3 py-1.5 text-sm font-medium hover:bg-white/10 active:scale-95"
        >
          <Activity className="size-3.5" /> {t("steps.simulate", "Simulate walk")}
        </button>
      </div>

      {claimable && (
        <button
          onClick={() => onCompleteQuest(stepQuest!.id)}
          className="mt-3 w-full rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 py-2 text-sm font-bold text-emerald-950 active:scale-95"
        >
          🎉 Goal reached — claim &ldquo;{stepQuest!.title}&rdquo;
        </button>
      )}
      {stepQuest?.completed && (
        <p className="mt-3 text-center text-xs text-emerald-300">Walk quest complete for today ✓</p>
      )}
    </div>
  );
}
