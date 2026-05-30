export type CosmeticType = "title" | "avatar";
export type CosmeticTier = "common" | "rare" | "epic" | "legendary";

export interface ShopItem {
  id: string;
  type: CosmeticType;
  /** for titles: the display text; for avatars: the emoji */
  value: string;
  label: string;
  cost: number;
  tier: CosmeticTier;
}

export const SHOP_ITEMS: ShopItem[] = [
  // ---- titles ----
  { id: "t-earlybird", type: "title", value: "🌅 The Early Bird", label: "The Early Bird", cost: 150, tier: "common" },
  { id: "t-ironwill", type: "title", value: "💪 Iron Will", label: "Iron Will", cost: 250, tier: "rare" },
  { id: "t-streakmaster", type: "title", value: "🔥 Streak Master", label: "Streak Master", cost: 400, tier: "rare" },
  { id: "t-bossbane", type: "title", value: "⚔️ Bane of Bosses", label: "Bane of Bosses", cost: 600, tier: "epic" },
  { id: "t-unstoppable", type: "title", value: "⚡ Unstoppable", label: "Unstoppable", cost: 900, tier: "epic" },
  { id: "t-mythic", type: "title", value: "🌟 Mythic Mover", label: "Mythic Mover", cost: 1500, tier: "legendary" },
  // ---- premium avatars ----
  { id: "a-dragon", type: "avatar", value: "🐉", label: "Dragon", cost: 300, tier: "rare" },
  { id: "a-phoenix", type: "avatar", value: "🦅", label: "Phoenix", cost: 300, tier: "rare" },
  { id: "a-robot", type: "avatar", value: "🤖", label: "Mecha", cost: 450, tier: "epic" },
  { id: "a-alien", type: "avatar", value: "👽", label: "Cosmic", cost: 450, tier: "epic" },
  { id: "a-unicorn", type: "avatar", value: "🦄", label: "Unicorn", cost: 700, tier: "epic" },
  { id: "a-crown", type: "avatar", value: "🫅", label: "Royalty", cost: 1200, tier: "legendary" },
];

export const TIER_STYLE: Record<CosmeticTier, { ring: string; text: string; label: string }> = {
  common: { ring: "ring-slate-300/40", text: "text-slate-300", label: "Common" },
  rare: { ring: "ring-sky-400/50", text: "text-sky-300", label: "Rare" },
  epic: { ring: "ring-fuchsia-400/50", text: "text-fuchsia-300", label: "Epic" },
  legendary: { ring: "ring-amber-300/60", text: "text-amber-300", label: "Legendary" },
};

export function shopItemById(id: string): ShopItem | undefined {
  return SHOP_ITEMS.find((i) => i.id === id);
}

export const COINS_BY_DIFFICULTY = { easy: 5, medium: 10, hard: 20 } as const;
export const DAILY_REWARD = { coins: 50, xp: 30 } as const;
