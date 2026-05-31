"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  Achievement,
  CharacterStats,
  Difficulty,
  FitnessLevel,
  GameState,
  Profile,
  Quest,
} from "./types";
import { customToQuest, generateDailyQuests } from "./quests";
import { generateDailyBoss } from "./bosses";
import { generateRaid } from "./raid";
import { weekId } from "./weekly";

const PERFECT_DAY_XP = 100;
const PERFECT_DAY_COINS = 50;
import { evaluateAchievements, initialAchievements } from "./achievements";
import { dateKey, daysBetween, levelFromXp } from "./utils";
import { COINS_BY_DIFFICULTY, DAILY_REWARD, shopItemById } from "./shop";
import { classXpMultiplier, heroClassDef } from "./classes";
import { COMBO_WINDOW_MS, comboMultiplier } from "./combo";
import {
  eventCoinMultiplier,
  eventDamageMultiplier,
  eventXpMultiplier,
  generateDailyEvent,
} from "./events";

const STREAK_FREEZE_COST = 200;
const REROLL_COST = 15;

const STORAGE_KEY = "movequest:v1";

function emptyStats(): CharacterStats {
  return { strength: 0, endurance: 0, agility: 0, consistency: 0 };
}

function freshState(): GameState {
  return {
    version: 1,
    profile: null,
    totalXp: 0,
    stats: emptyStats(),
    streak: { current: 0, best: 0, lastActiveDate: null, activeDays: [] },
    achievements: initialAchievements(),
    quests: [],
    questsDate: null,
    boss: null,
    bossDate: null,
    counters: { questsCompleted: 0, squats: 0, bossesDefeated: 0, minutesStretched: 0, dailyClaims: 0 },
    xpHistory: {},
    claimedChallenges: [],
    coins: 0,
    ownedCosmetics: [],
    equippedTitle: null,
    lastRewardDate: null,
    soundEnabled: true,
    streakFreezes: 0,
    notificationsEnabled: false,
    steps: {},
    comboCount: 0,
    comboLastTs: 0,
    companion: "drake",
    claimedWeeks: [],
    customQuests: [],
    lastSpinDate: null,
    raid: null,
    raidWeek: null,
    lastPerfectDate: null,
    lang: "en",
  };
}

function load(): GameState {
  if (typeof window === "undefined") return freshState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const newUserLang =
      typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("pl") ? "pl" : "en";
    if (!raw) return { ...freshState(), lang: newUserLang };
    const parsed = JSON.parse(raw) as GameState;
    // merge achievements in case new ones were added
    const base = freshState();
    const byId = new Map(parsed.achievements?.map((a) => [a.id, a]));
    parsed.achievements = base.achievements.map((a) => byId.get(a.id) ?? a);
    // deep-merge nested objects so new fields (added in later versions) get defaults
    const detected =
      typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("pl") ? "pl" : "en";
    return {
      ...base,
      ...parsed,
      counters: { ...base.counters, ...(parsed.counters ?? {}) },
      steps: parsed.steps ?? {},
      lang: parsed.lang ?? detected,
    };
  } catch {
    return freshState();
  }
}

/** Ensure today's quests + boss exist; roll the streak if a day was missed. */
function withDailyRollover(state: GameState): GameState {
  const profile = state.profile;
  if (!profile) return state;
  const today = dateKey();
  let next = state;

  const favored = heroClassDef(profile.heroClass).favored;

  if (next.questsDate !== today) {
    const generated = generateDailyQuests({
      level: profile.fitnessLevel,
      preference: profile.difficultyPreference,
      streak: next.streak.current,
      favored,
    });
    const custom = next.customQuests.map((cq) => customToQuest(cq, today));
    next = { ...next, quests: [...generated, ...custom], questsDate: today };
  }

  const level = levelFromXp(next.totalXp);
  if (next.bossDate !== today) {
    next = { ...next, boss: generateDailyBoss(level), bossDate: today };
  }

  const wid = weekId();
  if (next.raidWeek !== wid) {
    next = { ...next, raid: generateRaid(level, wid), raidWeek: wid };
  }

  // streak: if a day was missed, a streak freeze can save it
  if (next.streak.lastActiveDate) {
    const gap = daysBetween(next.streak.lastActiveDate, today);
    if (gap >= 2) {
      if (next.streakFreezes > 0 && next.streak.current > 0) {
        // consume one freeze; keep the streak alive as if yesterday was active
        const y = new Date();
        y.setDate(y.getDate() - 1);
        next = {
          ...next,
          streakFreezes: next.streakFreezes - 1,
          streak: { ...next.streak, lastActiveDate: dateKey(y) },
        };
      } else {
        next = { ...next, streak: { ...next.streak, current: 0 } };
      }
    }
  }

  return next;
}

interface GameContextValue {
  state: GameState;
  ready: boolean;
  level: number;
  toast: Achievement | null;
  /** set to the new level when the player just levelled up */
  levelUp: number | null;
  dismissLevelUp: () => void;
  /** true right after clearing every quest in a day */
  perfectDay: boolean;
  dismissPerfectDay: () => void;
  createProfile: (p: Profile) => void;
  updateProfile: (p: Partial<Profile>) => void;
  logout: () => void;
  completeQuest: (id: string) => void;
  regenerateQuests: () => void;
  resetProgress: () => void;
  /** claim a friend challenge reward (idempotent per id) */
  claimChallenge: (id: string, rewardXp: number) => void;
  /** claim the once-per-day reward chest */
  claimDailyReward: () => void;
  /** buy a shop cosmetic with coins */
  buyCosmetic: (id: string) => void;
  /** equip a title cosmetic (null = level rank) */
  equipTitle: (id: string | null) => void;
  /** toggle sound effects */
  toggleSound: () => void;
  /** reroll a single quest for coins */
  rerollQuest: (id: string) => void;
  /** buy a streak freeze (max 3) */
  buyStreakFreeze: () => void;
  rerollCost: number;
  streakFreezeCost: number;
  /** enable/disable browser reminders */
  setNotifications: (on: boolean) => void;
  /** log steps for today */
  addSteps: (n: number) => void;
  /** choose a companion species */
  setCompanion: (id: string) => void;
  /** claim the weekly challenge reward */
  claimWeekly: (id: string, rewardCoins: number, rewardXp: number) => void;
  /** add a user-defined quest */
  addCustomQuest: (data: { title: string; category: Quest["category"]; difficulty: Difficulty }) => void;
  /** remove a custom quest */
  removeCustomQuest: (id: string) => void;
  /** apply the fortune-wheel prize (once per day) */
  spinWheel: (prize: { coins?: number; xp?: number; freeze?: number }) => void;
  /** set the UI language */
  setLang: (lang: GameState["lang"]) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(freshState);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<Achievement | null>(null);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const [perfectDay, setPerfectDay] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // hydrate from localStorage on mount, then roll over to today.
  // Intentional: we start from a stable SSR-safe default and load client state
  // after mount to avoid hydration mismatches.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(withDailyRollover(load()));
    setReady(true);
  }, []);

  // persist on every change (after hydration)
  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore quota errors */
    }
  }, [state, ready]);

  const flashToast = (ach: Achievement | null) => {
    if (!ach) return;
    setToast(ach);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4200);
  };

  const createProfile = (p: Profile) => {
    setState((prev) => {
      // keep the visitor's language + sound preference chosen before signing up
      const base = {
        ...freshState(),
        profile: p,
        lang: prev.lang,
        soundEnabled: prev.soundEnabled,
      };
      return withDailyRollover(base);
    });
  };

  const updateProfile = (patch: Partial<Profile>) => {
    setState((prev) => {
      if (!prev.profile) return prev;
      const profile = { ...prev.profile, ...patch };
      // regenerate quests if the inputs that drive them changed
      const regen =
        patch.fitnessLevel !== undefined ||
        patch.difficultyPreference !== undefined ||
        patch.heroClass !== undefined;
      const next = { ...prev, profile };
      return regen
        ? {
            ...next,
            quests: generateDailyQuests({
              level: profile.fitnessLevel,
              preference: profile.difficultyPreference,
              streak: next.streak.current,
              favored: heroClassDef(profile.heroClass).favored,
            }),
            questsDate: dateKey(),
          }
        : next;
    });
  };

  const logout = () => setState((prev) => ({ ...freshState(), lang: prev.lang }));
  const resetProgress = () => {
    setState((prev) => {
      if (!prev.profile) return { ...freshState(), lang: prev.lang };
      // wipe progress but keep the profile and personal preferences/content
      return withDailyRollover({
        ...freshState(),
        profile: prev.profile,
        lang: prev.lang,
        soundEnabled: prev.soundEnabled,
        notificationsEnabled: prev.notificationsEnabled,
        companion: prev.companion,
        customQuests: prev.customQuests,
      });
    });
  };

  const regenerateQuests = () => {
    setState((prev) => {
      if (!prev.profile) return prev;
      // shuffle with a salted seed by appending a counter to the date
      const salt = String(Object.keys(prev.xpHistory).length + Math.floor(prev.totalXp));
      const quests = generateDailyQuests({
        level: prev.profile.fitnessLevel,
        preference: prev.profile.difficultyPreference,
        streak: prev.streak.current,
        favored: heroClassDef(prev.profile.heroClass).favored,
        date: new Date(),
      }).map((q, i) => ({ ...q, id: `${q.id}-${salt}-${i}` }));
      return { ...prev, quests, questsDate: dateKey() };
    });
  };

  const rerollQuest = (id: string) => {
    setState((prev) => {
      if (!prev.profile || prev.coins < REROLL_COST) return prev;
      const target = prev.quests.find((q) => q.id === id);
      if (!target || target.completed) return prev;
      // build a pool of candidates and pick one not already shown
      const salt = String(prev.coins + prev.quests.length);
      const candidates = generateDailyQuests({
        level: prev.profile.fitnessLevel,
        preference: prev.profile.difficultyPreference,
        streak: prev.streak.current,
        favored: heroClassDef(prev.profile.heroClass).favored,
        date: new Date(),
      });
      const titles = new Set(prev.quests.map((q) => q.title));
      const fresh = candidates.find((c) => !titles.has(c.title));
      if (!fresh) return prev;
      const replacement = { ...fresh, id: `${fresh.id}-reroll-${salt}` };
      return {
        ...prev,
        coins: prev.coins - REROLL_COST,
        quests: prev.quests.map((q) => (q.id === id ? replacement : q)),
      };
    });
  };

  const buyStreakFreeze = () => {
    setState((prev) =>
      prev.coins < STREAK_FREEZE_COST || prev.streakFreezes >= 3
        ? prev
        : { ...prev, coins: prev.coins - STREAK_FREEZE_COST, streakFreezes: prev.streakFreezes + 1 },
    );
  };

  const completeQuest = (id: string) => {
    setState((prev) => {
      const quest = prev.quests.find((q) => q.id === id);
      if (!quest || quest.completed) return prev;
      const today = dateKey();

      // mark complete
      const quests = prev.quests.map((q) => (q.id === id ? { ...q, completed: true } : q));

      // combo: consecutive completions within the window stack a multiplier
      const now = Date.now();
      const comboCount = now - prev.comboLastTs <= COMBO_WINDOW_MS ? prev.comboCount + 1 : 1;
      const event = generateDailyEvent();

      // XP + per-day history (hero class + combo + daily event boost the reward)
      const mult =
        classXpMultiplier(prev.profile?.heroClass, quest.category) *
        comboMultiplier(comboCount) *
        eventXpMultiplier(event, quest.category);
      const reward = Math.round(quest.xpReward * mult);

      // coins reward (daily event can boost)
      let coins = prev.coins + Math.round(COINS_BY_DIFFICULTY[quest.difficulty] * eventCoinMultiplier(event));

      // stat gains by category
      const stats = { ...prev.stats };
      const gain = quest.difficulty === "hard" ? 3 : quest.difficulty === "medium" ? 2 : 1;
      if (quest.category === "strength") stats.strength += gain;
      else if (quest.category === "cardio") stats.endurance += gain;
      else if (quest.category === "mobility") stats.agility += gain;
      stats.consistency += 1;

      // counters for achievements
      const counters = { ...prev.counters, questsCompleted: prev.counters.questsCompleted + 1 };
      if (quest.reps) counters.squats += quest.reps;
      if (quest.category === "mobility") counters.minutesStretched += 10;

      // streak: count today as active (first completion of the day)
      let streak = prev.streak;
      if (streak.lastActiveDate !== today) {
        const gap = streak.lastActiveDate ? daysBetween(streak.lastActiveDate, today) : 99;
        const current = gap === 1 ? streak.current + 1 : 1;
        const activeDays = [...streak.activeDays.filter((d) => d !== today), today].slice(-30);
        streak = {
          current,
          best: Math.max(streak.best, current),
          lastActiveDate: today,
          activeDays,
        };
      }

      // damage dealt (daily event can boost it) — hits both daily boss and weekly raid
      const dmg = Math.round(quest.damage * eventDamageMultiplier(event));
      let bonusXp = 0;

      // daily boss
      let boss = prev.boss;
      let bossesDefeated = counters.bossesDefeated;
      if (boss && !boss.defeated) {
        const hp = Math.max(0, boss.hp - dmg);
        const defeated = hp === 0;
        boss = { ...boss, hp, defeated };
        if (defeated) {
          bonusXp += boss.bonusXp;
          bossesDefeated += 1;
          coins += 40;
        }
      }

      // weekly raid boss
      let raid = prev.raid;
      if (raid && !raid.defeated) {
        const hp = Math.max(0, raid.hp - dmg);
        const defeated = hp === 0;
        raid = { ...raid, hp, defeated };
        if (defeated) {
          bonusXp += raid.bonusXp;
          coins += raid.bonusCoins;
        }
      }

      // perfect day: clearing every quest grants a one-time daily bonus
      const allCleared = quests.length > 0 && quests.every((q) => q.completed);
      const isPerfect = allCleared && prev.lastPerfectDate !== today;
      if (isPerfect) {
        bonusXp += PERFECT_DAY_XP;
        coins += PERFECT_DAY_COINS;
        setTimeout(() => setPerfectDay(true), 0);
      }

      const dayXp = reward + bonusXp;
      let next: GameState = {
        ...prev,
        quests,
        totalXp: prev.totalXp + dayXp,
        xpHistory: { ...prev.xpHistory, [today]: (prev.xpHistory[today] ?? 0) + dayXp },
        coins,
        stats,
        counters: { ...counters, bossesDefeated },
        streak,
        boss,
        raid,
        comboCount,
        comboLastTs: now,
        lastPerfectDate: isPerfect ? today : prev.lastPerfectDate,
      };

      // achievements
      const { achievements, newlyUnlocked } = evaluateAchievements(next, today);
      next = { ...next, achievements };
      if (newlyUnlocked.length) {
        // defer toast out of the setState updater
        setTimeout(() => flashToast(newlyUnlocked[0]), 0);
      }

      // level-up celebration
      const newLevel = levelFromXp(next.totalXp);
      if (newLevel > levelFromXp(prev.totalXp)) {
        setTimeout(() => setLevelUp(newLevel), 0);
      }
      return next;
    });
  };

  const claimChallenge = (id: string, rewardXp: number) => {
    setState((prev) => {
      if (prev.claimedChallenges.includes(id)) return prev;
      const today = dateKey();
      const totalXp = prev.totalXp + rewardXp;
      const newLevel = levelFromXp(totalXp);
      if (newLevel > levelFromXp(prev.totalXp)) setTimeout(() => setLevelUp(newLevel), 0);
      return {
        ...prev,
        totalXp,
        xpHistory: { ...prev.xpHistory, [today]: (prev.xpHistory[today] ?? 0) + rewardXp },
        claimedChallenges: [...prev.claimedChallenges, id],
      };
    });
  };

  const dismissLevelUp = () => setLevelUp(null);
  const dismissPerfectDay = () => setPerfectDay(false);

  const claimDailyReward = () => {
    setState((prev) => {
      const today = dateKey();
      if (prev.lastRewardDate === today) return prev;
      const totalXp = prev.totalXp + DAILY_REWARD.xp;
      if (levelFromXp(totalXp) > levelFromXp(prev.totalXp)) {
        setTimeout(() => setLevelUp(levelFromXp(totalXp)), 0);
      }
      return {
        ...prev,
        coins: prev.coins + DAILY_REWARD.coins,
        totalXp,
        xpHistory: { ...prev.xpHistory, [today]: (prev.xpHistory[today] ?? 0) + DAILY_REWARD.xp },
        lastRewardDate: today,
        counters: { ...prev.counters, dailyClaims: prev.counters.dailyClaims + 1 },
      };
    });
  };

  const toggleSound = () => setState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));

  const setNotifications = (on: boolean) =>
    setState((prev) => ({ ...prev, notificationsEnabled: on }));

  const setLang = (lang: GameState["lang"]) => setState((prev) => ({ ...prev, lang }));

  const addSteps = (n: number) =>
    setState((prev) => {
      const today = dateKey();
      return { ...prev, steps: { ...prev.steps, [today]: Math.max(0, (prev.steps[today] ?? 0) + n) } };
    });

  const setCompanion = (id: string) => setState((prev) => ({ ...prev, companion: id }));

  const addCustomQuest = (data: { title: string; category: Quest["category"]; difficulty: Difficulty }) =>
    setState((prev) => {
      const title = data.title.trim();
      if (!title || prev.customQuests.length >= 8) return prev;
      const cq = { id: `${Date.now()}-${prev.customQuests.length}`, title, category: data.category, difficulty: data.difficulty };
      const today = dateKey();
      // also drop it into today's list immediately
      const liveInstance = prev.questsDate === today ? [customToQuest(cq, today)] : [];
      return {
        ...prev,
        customQuests: [...prev.customQuests, cq],
        quests: [...prev.quests, ...liveInstance],
      };
    });

  const removeCustomQuest = (id: string) =>
    setState((prev) => {
      const instanceId = `${dateKey()}-custom-${id}`;
      return {
        ...prev,
        customQuests: prev.customQuests.filter((c) => c.id !== id),
        // remove today's instance unless it was already completed
        quests: prev.quests.filter((q) => !(q.id === instanceId && !q.completed)),
      };
    });

  const spinWheel = (prize: { coins?: number; xp?: number; freeze?: number }) =>
    setState((prev) => {
      const today = dateKey();
      if (prev.lastSpinDate === today) return prev;
      const totalXp = prev.totalXp + (prize.xp ?? 0);
      if (prize.xp && levelFromXp(totalXp) > levelFromXp(prev.totalXp)) {
        setTimeout(() => setLevelUp(levelFromXp(totalXp)), 0);
      }
      return {
        ...prev,
        lastSpinDate: today,
        coins: prev.coins + (prize.coins ?? 0),
        totalXp,
        streakFreezes: Math.min(3, prev.streakFreezes + (prize.freeze ?? 0)),
        xpHistory: prize.xp
          ? { ...prev.xpHistory, [today]: (prev.xpHistory[today] ?? 0) + prize.xp }
          : prev.xpHistory,
      };
    });

  const claimWeekly = (id: string, rewardCoins: number, rewardXp: number) =>
    setState((prev) => {
      if (prev.claimedWeeks.includes(id)) return prev;
      const today = dateKey();
      const totalXp = prev.totalXp + rewardXp;
      if (levelFromXp(totalXp) > levelFromXp(prev.totalXp)) {
        setTimeout(() => setLevelUp(levelFromXp(totalXp)), 0);
      }
      return {
        ...prev,
        coins: prev.coins + rewardCoins,
        totalXp,
        xpHistory: { ...prev.xpHistory, [today]: (prev.xpHistory[today] ?? 0) + rewardXp },
        claimedWeeks: [...prev.claimedWeeks, id],
      };
    });

  const buyCosmetic = (id: string) => {
    setState((prev) => {
      const item = shopItemById(id);
      if (!item || prev.ownedCosmetics.includes(id) || prev.coins < item.cost) return prev;
      return {
        ...prev,
        coins: prev.coins - item.cost,
        ownedCosmetics: [...prev.ownedCosmetics, id],
        // auto-equip titles on purchase
        equippedTitle: item.type === "title" ? id : prev.equippedTitle,
      };
    });
  };

  const equipTitle = (id: string | null) => {
    setState((prev) =>
      id === null || prev.ownedCosmetics.includes(id) ? { ...prev, equippedTitle: id } : prev,
    );
  };

  const level = useMemo(() => levelFromXp(state.totalXp), [state.totalXp]);

  const value: GameContextValue = {
    state,
    ready,
    level,
    toast,
    levelUp,
    dismissLevelUp,
    perfectDay,
    dismissPerfectDay,
    createProfile,
    updateProfile,
    logout,
    completeQuest,
    regenerateQuests,
    resetProgress,
    claimChallenge,
    claimDailyReward,
    buyCosmetic,
    equipTitle,
    toggleSound,
    rerollQuest,
    buyStreakFreeze,
    rerollCost: REROLL_COST,
    streakFreezeCost: STREAK_FREEZE_COST,
    setNotifications,
    addSteps,
    setCompanion,
    claimWeekly,
    addCustomQuest,
    removeCustomQuest,
    spinWheel,
    setLang,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}

export type { Difficulty, FitnessLevel, Profile, Quest };
