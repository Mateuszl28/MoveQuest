"use client";

import {
  createContext,
  useCallback,
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
import { generateDailyQuests } from "./quests";
import { generateDailyBoss } from "./bosses";
import { evaluateAchievements, initialAchievements } from "./achievements";
import { dateKey, daysBetween, levelFromXp } from "./utils";

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
    counters: { questsCompleted: 0, squats: 0, bossesDefeated: 0, minutesStretched: 0 },
    xpHistory: {},
  };
}

function load(): GameState {
  if (typeof window === "undefined") return freshState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw) as GameState;
    // merge achievements in case new ones were added
    const base = freshState();
    const byId = new Map(parsed.achievements?.map((a) => [a.id, a]));
    parsed.achievements = base.achievements.map((a) => byId.get(a.id) ?? a);
    return { ...base, ...parsed };
  } catch {
    return freshState();
  }
}

/** Ensure today's quests + boss exist; roll the streak if a day was missed. */
function withDailyRollover(state: GameState): GameState {
  if (!state.profile) return state;
  const today = dateKey();
  let next = state;

  if (next.questsDate !== today) {
    next = {
      ...next,
      quests: generateDailyQuests({
        level: next.profile.fitnessLevel,
        preference: next.profile.difficultyPreference,
        streak: next.streak.current,
      }),
      questsDate: today,
    };
  }

  const level = levelFromXp(next.totalXp);
  if (next.bossDate !== today) {
    next = { ...next, boss: generateDailyBoss(level), bossDate: today };
  }

  // streak: if last active day was before yesterday, the streak is broken
  if (next.streak.lastActiveDate) {
    const gap = daysBetween(next.streak.lastActiveDate, today);
    if (gap >= 2) next = { ...next, streak: { ...next.streak, current: 0 } };
  }

  return next;
}

interface GameContextValue {
  state: GameState;
  ready: boolean;
  level: number;
  toast: Achievement | null;
  createProfile: (p: Profile) => void;
  updateProfile: (p: Partial<Profile>) => void;
  logout: () => void;
  completeQuest: (id: string) => void;
  regenerateQuests: () => void;
  resetProgress: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(freshState);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<Achievement | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // hydrate from localStorage on mount, then roll over to today
  useEffect(() => {
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
      const base = { ...freshState(), profile: p };
      return withDailyRollover(base);
    });
  };

  const updateProfile = (patch: Partial<Profile>) => {
    setState((prev) => {
      if (!prev.profile) return prev;
      const profile = { ...prev.profile, ...patch };
      // regenerate quests if the inputs that drive them changed
      const regen =
        patch.fitnessLevel !== undefined || patch.difficultyPreference !== undefined;
      const next = { ...prev, profile };
      return regen
        ? {
            ...next,
            quests: generateDailyQuests({
              level: profile.fitnessLevel,
              preference: profile.difficultyPreference,
              streak: next.streak.current,
            }),
            questsDate: dateKey(),
          }
        : next;
    });
  };

  const logout = () => setState(freshState());
  const resetProgress = () => {
    setState((prev) =>
      prev.profile ? withDailyRollover({ ...freshState(), profile: prev.profile }) : freshState(),
    );
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
        date: new Date(),
      }).map((q, i) => ({ ...q, id: `${q.id}-${salt}-${i}` }));
      return { ...prev, quests, questsDate: dateKey() };
    });
  };

  const completeQuest = (id: string) => {
    setState((prev) => {
      const quest = prev.quests.find((q) => q.id === id);
      if (!quest || quest.completed) return prev;
      const today = dateKey();

      // mark complete
      const quests = prev.quests.map((q) => (q.id === id ? { ...q, completed: true } : q));

      // XP + per-day history
      const totalXp = prev.totalXp + quest.xpReward;
      const xpHistory = { ...prev.xpHistory, [today]: (prev.xpHistory[today] ?? 0) + quest.xpReward };

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

      // boss damage
      let boss = prev.boss;
      let bossBonus = 0;
      let bossesDefeated = counters.bossesDefeated;
      if (boss && !boss.defeated) {
        const hp = Math.max(0, boss.hp - quest.damage);
        const defeated = hp === 0;
        boss = { ...boss, hp, defeated };
        if (defeated) {
          bossBonus = boss.bonusXp;
          bossesDefeated += 1;
        }
      }

      let next: GameState = {
        ...prev,
        quests,
        totalXp: totalXp + bossBonus,
        xpHistory: bossBonus
          ? { ...xpHistory, [today]: (xpHistory[today] ?? 0) + bossBonus }
          : xpHistory,
        stats,
        counters: { ...counters, bossesDefeated },
        streak,
        boss,
      };

      // achievements
      const { achievements, newlyUnlocked } = evaluateAchievements(next, today);
      next = { ...next, achievements };
      if (newlyUnlocked.length) {
        // defer toast out of the setState updater
        setTimeout(() => flashToast(newlyUnlocked[0]), 0);
      }
      return next;
    });
  };

  const level = useMemo(() => levelFromXp(state.totalXp), [state.totalXp]);

  const value: GameContextValue = {
    state,
    ready,
    level,
    toast,
    createProfile,
    updateProfile,
    logout,
    completeQuest,
    regenerateQuests,
    resetProgress,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}

export type { Difficulty, FitnessLevel, Profile, Quest };
