"use client";

import { motion } from "framer-motion";
import { Check, Swords, Trophy } from "lucide-react";
import type { GameState } from "@/lib/types";
import { challengeProgress, generateDailyChallenges } from "@/lib/challenges";
import { dateKey } from "@/lib/utils";

export function FriendChallenges({
  state,
  onClaim,
}: {
  state: GameState;
  onClaim: (id: string, rewardXp: number) => void;
}) {
  const challenges = generateDailyChallenges();
  const today = dateKey();
  const todayXp = state.xpHistory[today] ?? 0;
  const questsCompletedToday = state.quests.filter((q) => q.completed).length;

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5">
      <div className="mb-3 flex items-center gap-2">
        <Swords className="size-5 text-violet-300" />
        <h3 className="font-display font-bold">Friend Challenges</h3>
      </div>
      <div className="space-y-3">
        {challenges.map((c) => {
          const progress = challengeProgress(c, { todayXp, questsCompletedToday });
          const won = progress >= 1;
          const claimed = state.claimedChallenges.includes(c.id);
          const current = c.metric === "todayXp" ? todayXp : questsCompletedToday;
          return (
            <div key={c.id} className="rounded-xl border border-border bg-white/5 p-3">
              <div className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/5 text-lg">{c.avatar}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">
                    <span className="font-semibold">{c.friend}</span>{" "}
                    <span className="text-muted">challenges you</span>
                  </p>
                  <p className="truncate text-xs text-muted">{c.title}</p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-gold">+{c.rewardXp}</span>
              </div>

              <div className="mt-2.5 flex items-center gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className={`h-full rounded-full ${won ? "bg-gradient-to-r from-emerald-400 to-green-500" : "bg-gradient-to-r from-violet-500 to-blue-500"}`}
                    animate={{ width: `${progress * 100}%` }}
                  />
                </div>
                <span className="w-12 shrink-0 text-right text-[11px] tabular-nums text-muted">
                  {Math.min(current, c.target)}/{c.target}
                </span>
              </div>

              {claimed ? (
                <div className="mt-2.5 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/10 py-1.5 text-xs font-semibold text-emerald-300">
                  <Check className="size-3.5" /> Claimed · you beat {c.friend}!
                </div>
              ) : won ? (
                <button
                  onClick={() => onClaim(c.id, c.rewardXp)}
                  className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-300 to-amber-500 py-1.5 text-xs font-bold text-amber-950 active:scale-95"
                >
                  <Trophy className="size-3.5" /> Claim +{c.rewardXp} XP
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
