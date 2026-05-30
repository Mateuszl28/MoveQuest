"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Crown, Flame, Star, TrendingUp } from "lucide-react";
import { buildLeaderboard, sortLeaderboard, type SortKey } from "@/lib/leaderboard";
import { useT } from "@/lib/i18n";

const SORTS: { key: SortKey; label: string; icon: typeof Star }[] = [
  { key: "xp", label: "XP", icon: Star },
  { key: "level", label: "Level", icon: TrendingUp },
  { key: "streak", label: "Streak", icon: Flame },
];

const MEDAL = ["🥇", "🥈", "🥉"];

export function Leaderboard({
  player,
  scope: initialScope = "global",
  limit,
  showControls = true,
}: {
  player: { username: string; avatar: string; xp: number; streak: number };
  scope?: "global" | "friends";
  limit?: number;
  showControls?: boolean;
}) {
  const { t } = useT();
  const [sort, setSort] = useState<SortKey>("xp");
  const [scope, setScope] = useState<"global" | "friends">(initialScope);

  const rows = useMemo(() => {
    let entries = buildLeaderboard(player);
    if (scope === "friends") entries = entries.filter((e) => e.isFriend || e.isPlayer);
    const sorted = sortLeaderboard(entries, sort);
    return limit ? sorted.slice(0, limit) : sorted;
  }, [player, sort, scope, limit]);

  return (
    <div>
      {showControls && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-1 rounded-xl border border-border bg-white/5 p-1">
            {(["global", "friends"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setScope(s)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                  scope === s ? "bg-lime-300 text-[#15200a]" : "text-muted hover:text-foreground"
                }`}
              >
                {t(`lb.${s}`, s)}
              </button>
            ))}
          </div>
          <div className="flex gap-1 rounded-xl border border-border bg-white/5 p-1">
            {SORTS.map((s) => (
              <button
                key={s.key}
                onClick={() => setSort(s.key)}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  sort === s.key ? "bg-white/10 text-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                <s.icon className="size-3.5" /> {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {rows.map((e, i) => (
          <motion.div
            key={e.id}
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center gap-3 rounded-xl border p-2.5 ${
              e.isPlayer
                ? "border-lime-400/50 bg-lime-400/15 ring-1 ring-lime-400/30"
                : "border-border bg-white/5"
            }`}
          >
            <span className="w-7 text-center font-display text-sm font-bold">
              {i < 3 ? MEDAL[i] : <span className="text-muted">{i + 1}</span>}
            </span>
            <span className="grid size-9 place-items-center rounded-full bg-white/5 text-lg">{e.avatar}</span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 truncate text-sm font-semibold">
                {e.username}
                {e.isPlayer && <span className="text-[10px] text-lime-300">{t("lb.you", "(you)")}</span>}
                {i === 0 && <Crown className="size-3.5 text-gold" />}
              </p>
              <p className="text-xs text-muted">Lvl {e.level} · {e.streak}🔥</p>
            </div>
            <span className="font-display text-sm font-bold text-gold tabular-nums">
              {e.xp.toLocaleString()}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
