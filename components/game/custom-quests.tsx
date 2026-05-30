"use client";

import { useState } from "react";
import { Plus, Trash2, PencilLine } from "lucide-react";
import type { CustomQuest, Difficulty, Quest } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useT } from "@/lib/i18n";

const CATS: Quest["category"][] = ["strength", "cardio", "mobility", "wellness"];
const DIFFS: Difficulty[] = ["easy", "medium", "hard"];

export function CustomQuests({
  quests,
  onAdd,
  onRemove,
}: {
  quests: CustomQuest[];
  onAdd: (d: { title: string; category: Quest["category"]; difficulty: Difficulty }) => void;
  onRemove: (id: string) => void;
}) {
  const { t } = useT();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Quest["category"]>("strength");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");

  const add = () => {
    if (title.trim().length < 2) return;
    onAdd({ title: title.trim(), category, difficulty });
    setTitle("");
  };

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5">
      <div className="mb-1 flex items-center gap-2">
        <PencilLine className="size-5 text-lime-300" />
        <h3 className="font-display font-bold">{t("custom.title", "Your own quests")}</h3>
        <span className="ml-auto text-xs text-muted">{quests.length}/8</span>
      </div>
      <p className="mb-4 text-xs text-muted">{t("custom.sub", "Add personal quests — they join your daily list every day.")}</p>

      <div className="space-y-3">
        <Input
          placeholder={t("custom.placeholder", "e.g. 30-minute swim")}
          value={title}
          maxLength={40}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <div className="flex flex-wrap gap-1.5">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-lg border px-2.5 py-1 text-xs font-medium capitalize transition ${
                category === c ? "border-lime-400 bg-lime-400/15 text-foreground" : "border-border bg-white/5 text-muted hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
          <span className="mx-1 w-px self-stretch bg-border" />
          {DIFFS.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`rounded-lg border px-2.5 py-1 text-xs font-medium capitalize transition ${
                difficulty === d ? "border-lime-400 bg-lime-400/15 text-foreground" : "border-border bg-white/5 text-muted hover:text-foreground"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <button
          onClick={add}
          disabled={title.trim().length < 2 || quests.length >= 8}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-lime-300 py-2.5 text-sm font-bold text-[#15200a] disabled:opacity-40 active:scale-95"
        >
          <Plus className="size-4" /> {t("custom.add", "Add quest")}
        </button>
      </div>

      {quests.length > 0 && (
        <div className="mt-4 space-y-2">
          {quests.map((q) => (
            <div key={q.id} className="flex items-center gap-2 rounded-xl border border-border bg-white/5 p-2.5">
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{q.title}</span>
              <Badge variant={q.difficulty}>{q.difficulty}</Badge>
              <button
                onClick={() => onRemove(q.id)}
                aria-label="Remove"
                className="grid size-8 place-items-center rounded-lg text-muted hover:text-rose-300"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
