import { levelFromXp } from "./utils";

export interface LeaderboardEntry {
  id: string;
  username: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  isPlayer?: boolean;
  isFriend?: boolean;
}

const NPCS: Omit<LeaderboardEntry, "level">[] = [
  { id: "n1", username: "IronWolf", avatar: "🐺", xp: 8420, streak: 23, isFriend: true },
  { id: "n2", username: "ZenPanda", avatar: "🐼", xp: 6310, streak: 41 },
  { id: "n3", username: "BlazeRunner", avatar: "🔥", xp: 5290, streak: 12, isFriend: true },
  { id: "n4", username: "MightyMango", avatar: "🥭", xp: 4730, streak: 8 },
  { id: "n5", username: "CaptainCardio", avatar: "🫀", xp: 3980, streak: 15, isFriend: true },
  { id: "n6", username: "StretchGoblin", avatar: "👺", xp: 3120, streak: 5 },
  { id: "n7", username: "SquatSorcerer", avatar: "🧙", xp: 2540, streak: 19 },
  { id: "n8", username: "HydroHero", avatar: "💧", xp: 1870, streak: 7, isFriend: true },
  { id: "n9", username: "DawnStrider", avatar: "🌅", xp: 1240, streak: 3 },
  { id: "n10", username: "PixelPacer", avatar: "🎮", xp: 760, streak: 2 },
];

export type SortKey = "xp" | "level" | "streak";

export function buildLeaderboard(player: {
  username: string;
  avatar: string;
  xp: number;
  streak: number;
}): LeaderboardEntry[] {
  const npcs = NPCS.map((n) => ({ ...n, level: levelFromXp(n.xp) }));
  const me: LeaderboardEntry = {
    id: "me",
    username: player.username || "You",
    avatar: player.avatar || "🧑",
    xp: player.xp,
    level: levelFromXp(player.xp),
    streak: player.streak,
    isPlayer: true,
    isFriend: true,
  };
  return [...npcs, me];
}

export function sortLeaderboard(
  entries: LeaderboardEntry[],
  key: SortKey,
): LeaderboardEntry[] {
  return [...entries].sort((a, b) => b[key] - a[key] || b.xp - a.xp);
}
