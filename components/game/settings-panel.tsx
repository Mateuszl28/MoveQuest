"use client";

import { useState } from "react";
import { AlertTriangle, Check, Volume2, VolumeX } from "lucide-react";
import { useGame } from "@/lib/game-store";
import type { Difficulty, FitnessLevel } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { shopItemById } from "@/lib/shop";

const BASE_AVATARS = ["🦸", "🥷", "🧝", "🧙", "🦊", "🐺", "🐻", "🦉", "🐲", "🦁", "🐯", "🦅"];
const LEVELS: FitnessLevel[] = ["beginner", "intermediate", "advanced"];
const DIFFS: Difficulty[] = ["easy", "medium", "hard"];

export function SettingsPanel() {
  const { state, updateProfile, resetProgress, toggleSound } = useGame();
  const p = state.profile;
  const [confirmReset, setConfirmReset] = useState(false);
  if (!p) return null;

  const ownedAvatars = state.ownedCosmetics
    .map((id) => shopItemById(id))
    .filter((i) => i && i.type === "avatar")
    .map((i) => i!.value);
  const avatars = [...BASE_AVATARS, ...ownedAvatars];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card/60 p-5">
        <h3 className="mb-4 font-display font-bold">Avatar</h3>
        <div className="grid grid-cols-6 gap-2 sm:grid-cols-12">
          {avatars.map((a) => (
            <button
              key={a}
              onClick={() => updateProfile({ avatar: a })}
              className={`grid aspect-square place-items-center rounded-xl border text-2xl transition-all ${
                p.avatar === a ? "border-violet-400 bg-violet-500/20 scale-105" : "border-border bg-white/5 hover:bg-white/10"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card/60 p-5">
          <h3 className="mb-1 font-display font-bold">Fitness level</h3>
          <p className="mb-4 text-xs text-muted">Scales quest targets. Changing it regenerates today&apos;s quests.</p>
          <div className="space-y-2">
            {LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => updateProfile({ fitnessLevel: l })}
                className={`flex w-full items-center justify-between rounded-xl border p-3 text-left capitalize transition-all ${
                  p.fitnessLevel === l ? "border-violet-400 bg-violet-500/15" : "border-border bg-white/5 hover:bg-white/10"
                }`}
              >
                {l}
                {p.fitnessLevel === l && <Check className="size-4 text-violet-300" />}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-5">
          <h3 className="mb-1 font-display font-bold">Difficulty pace</h3>
          <p className="mb-4 text-xs text-muted">Biases the daily quest mix. Also regenerates quests.</p>
          <div className="space-y-2">
            {DIFFS.map((d) => (
              <button
                key={d}
                onClick={() => updateProfile({ difficultyPreference: d })}
                className={`flex w-full items-center justify-between rounded-xl border p-3 text-left capitalize transition-all ${
                  p.difficultyPreference === d ? "border-violet-400 bg-violet-500/15" : "border-border bg-white/5 hover:bg-white/10"
                }`}
              >
                {d === "easy" ? "Chill" : d === "hard" ? "Hardcore" : "Balanced"}
                {p.difficultyPreference === d && <Check className="size-4 text-violet-300" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-border bg-card/60 p-5">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-white/5">
            {state.soundEnabled ? <Volume2 className="size-5 text-violet-300" /> : <VolumeX className="size-5 text-muted" />}
          </span>
          <div>
            <h3 className="font-display font-bold">Sound effects</h3>
            <p className="text-xs text-muted">Cues for quests, coins and level-ups.</p>
          </div>
        </div>
        <button
          onClick={toggleSound}
          role="switch"
          aria-checked={state.soundEnabled}
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${state.soundEnabled ? "bg-violet-500" : "bg-white/15"}`}
        >
          <span
            className={`absolute top-1 size-5 rounded-full bg-white transition-transform ${state.soundEnabled ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
      </div>

      <div className="rounded-2xl border border-rose-400/30 bg-rose-500/5 p-5">
        <h3 className="flex items-center gap-2 font-display font-bold text-rose-300">
          <AlertTriangle className="size-4" /> Danger zone
        </h3>
        <p className="mt-1 text-xs text-muted">
          Reset wipes all XP, levels, stats, streaks and achievements. Your hero profile stays.
        </p>
        {confirmReset ? (
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => { resetProgress(); setConfirmReset(false); }}
            >
              Yes, reset everything
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setConfirmReset(false)}>Cancel</Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" className="mt-4 border-rose-400/40 text-rose-300" onClick={() => setConfirmReset(true)}>
            Reset progress
          </Button>
        )}
      </div>
    </div>
  );
}
