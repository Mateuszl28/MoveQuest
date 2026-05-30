import { dateKey, mulberry32, seedFromString, shuffle } from "./utils";

export interface FriendChallenge {
  id: string;
  friend: string;
  avatar: string;
  title: string;
  /** what the player must reach today */
  metric: "todayXp" | "questsCompleted";
  target: number;
  rewardXp: number;
}

const FRIENDS = [
  { name: "IronWolf", avatar: "🐺" },
  { name: "ZenPanda", avatar: "🐼" },
  { name: "BlazeRunner", avatar: "🔥" },
  { name: "CaptainCardio", avatar: "🫀" },
  { name: "HydroHero", avatar: "💧" },
  { name: "SquatSorcerer", avatar: "🧙" },
];

const TEMPLATES: { title: string; metric: FriendChallenge["metric"]; target: number; rewardXp: number }[] = [
  { title: "Earn 100 XP before me today", metric: "todayXp", target: 100, rewardXp: 60 },
  { title: "Out-earn me — hit 150 XP today", metric: "todayXp", target: 150, rewardXp: 90 },
  { title: "Clear 3 quests before sundown", metric: "questsCompleted", target: 3, rewardXp: 70 },
  { title: "Finish 4 quests today, no excuses", metric: "questsCompleted", target: 4, rewardXp: 110 },
  { title: "Race me to 75 XP", metric: "todayXp", target: 75, rewardXp: 50 },
];

/** Two deterministic friend challenges for the day. */
export function generateDailyChallenges(date?: Date): FriendChallenge[] {
  const day = dateKey(date);
  const rnd = mulberry32(seedFromString(`challenge|${day}`));
  const friends = shuffle(FRIENDS, rnd);
  const templates = shuffle(TEMPLATES, rnd);
  return [0, 1].map((i) => ({
    id: `${day}-ch-${i}`,
    friend: friends[i].name,
    avatar: friends[i].avatar,
    ...templates[i],
  }));
}

export function challengeProgress(
  c: FriendChallenge,
  ctx: { todayXp: number; questsCompletedToday: number },
): number {
  const current = c.metric === "todayXp" ? ctx.todayXp : ctx.questsCompletedToday;
  return Math.min(1, current / c.target);
}
