"use client";

import { motion } from "framer-motion";
import { Check, Coins, Lock } from "lucide-react";
import type { GameState } from "@/lib/types";
import { SHOP_ITEMS, TIER_STYLE } from "@/lib/shop";
import { playSfx } from "@/lib/sound";

export function Shop({
  state,
  onBuy,
  onEquip,
}: {
  state: GameState;
  onBuy: (id: string) => void;
  onEquip: (id: string | null) => void;
}) {
  const titles = SHOP_ITEMS.filter((i) => i.type === "title");
  const avatars = SHOP_ITEMS.filter((i) => i.type === "avatar");

  const Card = ({ item }: { item: (typeof SHOP_ITEMS)[number] }) => {
    const owned = state.ownedCosmetics.includes(item.id);
    const equipped = item.type === "title" && state.equippedTitle === item.id;
    const affordable = state.coins >= item.cost;
    const tier = TIER_STYLE[item.tier];
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex flex-col rounded-2xl border p-4 ${owned ? `border-transparent bg-white/5 ring-1 ${tier.ring}` : "border-border bg-card/60"}`}
      >
        <div className="flex items-center gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/5 text-2xl">
            {item.type === "avatar" ? item.value : "🏷️"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{item.type === "avatar" ? item.label : item.value}</p>
            <p className={`text-[11px] font-semibold uppercase tracking-wider ${tier.text}`}>{tier.label}</p>
          </div>
        </div>

        <div className="mt-3">
          {owned ? (
            item.type === "title" ? (
              <button
                onClick={() => onEquip(equipped ? null : item.id)}
                className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-bold transition active:scale-95 ${
                  equipped
                    ? "bg-violet-500/20 text-violet-200 ring-1 ring-inset ring-violet-400/40"
                    : "border border-border bg-white/5 hover:bg-white/10"
                }`}
              >
                {equipped ? <><Check className="size-4" /> Equipped</> : "Equip"}
              </button>
            ) : (
              <div className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-500/10 py-2 text-sm font-semibold text-emerald-300">
                <Check className="size-4" /> Owned · pick in Settings
              </div>
            )
          ) : (
            <button
              onClick={() => { playSfx("coin", state.soundEnabled); onBuy(item.id); }}
              disabled={!affordable}
              className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-bold transition active:scale-95 ${
                affordable
                  ? "bg-gradient-to-r from-amber-300 to-amber-500 text-amber-950 shadow-lg shadow-amber-500/20"
                  : "cursor-not-allowed bg-white/5 text-muted"
              }`}
            >
              {affordable ? <Coins className="size-4" /> : <Lock className="size-4" />} {item.cost}
            </button>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-amber-300/30 bg-amber-400/5 p-4">
        <div>
          <p className="font-display font-bold">Reward Shop</p>
          <p className="text-xs text-muted">Spend coins earned from quests, bosses & daily rewards.</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-xl bg-amber-400/15 px-3 py-2 font-display text-lg font-extrabold text-gold ring-1 ring-inset ring-amber-300/30">
          <Coins className="size-5" /> {state.coins.toLocaleString()}
        </span>
      </div>

      <div>
        <h3 className="mb-3 font-display font-bold">Titles</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {titles.map((i) => (
            <Card key={i.id} item={i} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-display font-bold">Premium Avatars</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {avatars.map((i) => (
            <Card key={i.id} item={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
