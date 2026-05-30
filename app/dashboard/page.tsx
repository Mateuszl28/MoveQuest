"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Swords, Dumbbell, Trophy, Users, MessageCircle,
  LogOut, RefreshCw, Star, Sparkles, Flame, Settings, ShoppingBag, Coins,
} from "lucide-react";
import { useGame } from "@/lib/game-store";
import { levelFromXp, levelProgress, xpForNextLevel, xpIntoLevel, XP_PER_LEVEL } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { QuestCard } from "@/components/game/quest-card";
import { BossBattle } from "@/components/game/boss-battle";
import { StreakWidget } from "@/components/game/streak-widget";
import { CharacterCard } from "@/components/game/character-card";
import { AchievementsGallery } from "@/components/game/achievements-gallery";
import { Leaderboard } from "@/components/game/leaderboard";
import { Coach } from "@/components/game/coach";
import { XpChart } from "@/components/game/xp-chart";
import { FriendChallenges } from "@/components/game/friend-challenges";
import { SettingsPanel } from "@/components/game/settings-panel";
import { StatsPanel } from "@/components/game/stats-panel";
import { Shop } from "@/components/game/shop";
import { DailyReward } from "@/components/game/daily-reward";
import { SupportFoundation } from "@/components/foundation/support-foundation";
import { rankForLevel } from "@/lib/ranks";
import { shopItemById } from "@/lib/shop";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const TABS = [
  { value: "overview", label: "Overview", icon: <LayoutDashboard className="size-4" /> },
  { value: "quests", label: "Quests", icon: <Swords className="size-4" /> },
  { value: "hero", label: "Hero", icon: <Dumbbell className="size-4" /> },
  { value: "achievements", label: "Badges", icon: <Trophy className="size-4" /> },
  { value: "leaderboard", label: "Ranks", icon: <Users className="size-4" /> },
  { value: "coach", label: "Coach", icon: <MessageCircle className="size-4" /> },
  { value: "shop", label: "Shop", icon: <ShoppingBag className="size-4" /> },
  { value: "settings", label: "Settings", icon: <Settings className="size-4" /> },
];

function SectionTitle({ icon, children, action }: { icon: React.ReactNode; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="flex items-center gap-2 font-display text-lg font-bold">
        {icon} {children}
      </h2>
      {action}
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const {
    state, ready, level, completeQuest, regenerateQuests, logout,
    claimChallenge, claimDailyReward, buyCosmetic, equipTitle,
  } = useGame();
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    if (ready && !state.profile) router.replace("/login");
  }, [ready, state.profile, router]);

  const todayXp = useMemo(() => {
    const key = new Date().toISOString().slice(0, 10);
    return state.xpHistory[key] ?? 0;
  }, [state.xpHistory]);

  if (!ready || !state.profile) {
    return (
      <div className="grid flex-1 place-items-center">
        <div className="flex items-center gap-3 text-muted">
          <Sparkles className="size-5 animate-pulse text-lime-400" /> Loading your quest…
        </div>
      </div>
    );
  }

  const p = state.profile;
  const remaining = state.quests.filter((q) => !q.completed);
  const completed = state.quests.filter((q) => q.completed);
  const unlocked = state.achievements.filter((a) => a.unlocked).length;
  const playerLb = { username: p.username, avatar: p.avatar, xp: state.totalXp, streak: state.streak.current };
  const rank = rankForLevel(level);
  const equippedTitle = state.equippedTitle ? shopItemById(state.equippedTitle)?.value : null;
  const titleText = equippedTitle ?? `${rank.emoji} ${rank.name}`;

  const QuestsBlock = (
    <div className="rounded-2xl border border-border bg-card/60 p-5">
      <SectionTitle
        icon={<Swords className="size-5 text-lime-300" />}
        action={
          <Button variant="ghost" size="sm" onClick={regenerateQuests}>
            <RefreshCw className="size-3.5" /> New set
          </Button>
        }
      >
        Daily Quests
      </SectionTitle>
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="text-muted">{completed.length}/{state.quests.length} completed</span>
        <span className="font-semibold text-gold">+{todayXp} XP today</span>
      </div>
      <div className="space-y-2.5">
        {remaining.map((q) => (
          <QuestCard key={q.id} quest={q} onComplete={completeQuest} />
        ))}
        {completed.map((q) => (
          <QuestCard key={q.id} quest={q} onComplete={completeQuest} />
        ))}
      </div>
      {remaining.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-sm text-emerald-300"
        >
          🎉 All quests cleared! Come back tomorrow or generate a fresh set.
        </motion.p>
      )}
    </div>
  );

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-5">
      {/* HEADER */}
      <div className="rounded-3xl border border-border bg-gradient-to-br from-lime-500/10 via-card/70 to-emerald-500/10 p-5 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative grid size-16 place-items-center rounded-2xl bg-lime-400/15 ring-1 ring-inset ring-lime-400/30 text-3xl shadow-lg shadow-lime-400/30"
            >
              {p.avatar}
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-gold px-2 py-0.5 text-[10px] font-extrabold text-amber-950 shadow">
                LVL {level}
              </span>
            </motion.span>
            <div>
              <p className="text-sm text-muted">{greeting()},</p>
              <h1 className="font-display text-2xl font-extrabold leading-tight">{p.username}</h1>
              <p className="text-xs font-semibold text-lime-300">{titleText}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <Badge variant="muted" className="capitalize">{p.fitnessLevel}</Badge>
                <Badge variant="gold"><Flame className="size-3" /> {state.streak.current} day streak</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-xl bg-amber-400/15 px-3 py-2 font-display font-bold text-gold ring-1 ring-inset ring-amber-300/30">
              <Coins className="size-4" /> {state.coins.toLocaleString()}
            </span>
            <Button variant="outline" size="sm" onClick={() => { logout(); router.replace("/"); }}>
              <LogOut className="size-3.5" /> Log out
            </Button>
          </div>
        </div>

        {/* XP BAR */}
        <div className="mt-5">
          <div className="mb-1.5 flex items-end justify-between">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-gold">
              <Star className="size-4" /> {state.totalXp.toLocaleString()} XP
            </span>
            <span className="text-xs text-muted">
              {xpIntoLevel(state.totalXp)}/{XP_PER_LEVEL} · {xpForNextLevel(state.totalXp)} to Lvl {level + 1}
            </span>
          </div>
          <Progress value={levelProgress(state.totalXp)} glow className="h-3.5" />
        </div>
      </div>

      {/* TABS */}
      <div className="sticky top-2 z-30 mt-4">
        <Tabs tabs={TABS} value={tab} onChange={setTab} />
      </div>

      {/* CONTENT */}
      <div className="mt-5">
        {tab === "overview" && (
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="space-y-5 lg:col-span-2">
              {QuestsBlock}
              <XpChart xpHistory={state.xpHistory} />
              <div>
                <SectionTitle icon={<Trophy className="size-5 text-gold" />} action={
                  <Button variant="ghost" size="sm" onClick={() => setTab("achievements")}>View all</Button>
                }>
                  Achievements <span className="text-sm font-normal text-muted">({unlocked}/{state.achievements.length})</span>
                </SectionTitle>
                <AchievementsGallery state={state} limit={4} />
              </div>
            </div>
            <div className="space-y-5">
              <DailyReward lastRewardDate={state.lastRewardDate} onClaim={claimDailyReward} />
              <BossBattle boss={state.boss} />
              <StreakWidget streak={state.streak} />
              <FriendChallenges state={state} onClaim={claimChallenge} />
              <div className="rounded-2xl border border-border bg-card/60 p-5">
                <SectionTitle icon={<Users className="size-5 text-emerald-300" />} action={
                  <Button variant="ghost" size="sm" onClick={() => setTab("leaderboard")}>Full</Button>
                }>
                  Leaderboard
                </SectionTitle>
                <Leaderboard player={playerLb} limit={5} showControls={false} />
              </div>
              <SupportFoundation variant="card" />
            </div>
          </div>
        )}

        {tab === "quests" && (
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2">{QuestsBlock}</div>
            <BossBattle boss={state.boss} />
          </div>
        )}

        {tab === "hero" && (
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="space-y-5 lg:col-span-2">
              <div>
                <SectionTitle icon={<Dumbbell className="size-5 text-rose-300" />}>Character Progression</SectionTitle>
                <CharacterCard stats={state.stats} />
              </div>
              <XpChart xpHistory={state.xpHistory} />
            </div>
            <div className="space-y-5">
              <StreakWidget streak={state.streak} />
              <StatsPanel state={state} />
            </div>
          </div>
        )}

        {tab === "shop" && (
          <div>
            <SectionTitle icon={<ShoppingBag className="size-5 text-gold" />}>Reward Shop</SectionTitle>
            <Shop state={state} onBuy={buyCosmetic} onEquip={equipTitle} />
          </div>
        )}

        {tab === "settings" && (
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SectionTitle icon={<Settings className="size-5 text-lime-300" />}>Settings</SectionTitle>
              <SettingsPanel />
            </div>
            <SupportFoundation variant="card" />
          </div>
        )}

        {tab === "achievements" && (
          <div>
            <SectionTitle icon={<Trophy className="size-5 text-gold" />}>
              Achievement Gallery <span className="text-sm font-normal text-muted">({unlocked}/{state.achievements.length})</span>
            </SectionTitle>
            <AchievementsGallery state={state} />
          </div>
        )}

        {tab === "leaderboard" && (
          <div className="rounded-2xl border border-border bg-card/60 p-5">
            <SectionTitle icon={<Users className="size-5 text-emerald-300" />}>Leaderboard</SectionTitle>
            <Leaderboard player={playerLb} />
          </div>
        )}

        {tab === "coach" && (
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SectionTitle icon={<MessageCircle className="size-5 text-lime-300" />}>AI Coach</SectionTitle>
              <Coach state={state} />
            </div>
            <BossBattle boss={state.boss} />
          </div>
        )}
      </div>
    </main>
  );
}
