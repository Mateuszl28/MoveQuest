"use client";

import { useEffect } from "react";
import { useGame } from "@/lib/game-store";
import { dateKey } from "@/lib/utils";

const LAST_KEY = "movequest:lastNotif";

/** Fires an opt-in browser reminder when the streak is at risk or quests remain. */
export function NotificationManager() {
  const { state, ready } = useGame();

  useEffect(() => {
    if (!ready || !state.profile || !state.notificationsEnabled) return;
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const today = dateKey();
    if (localStorage.getItem(LAST_KEY) === today) return; // one reminder per day

    const activeToday = state.streak.lastActiveDate === today;
    const pending = state.quests.filter((q) => !q.completed).length;

    let title = "";
    let body = "";
    if (!activeToday && state.streak.current > 0) {
      title = `🔥 Your ${state.streak.current}-day streak is at risk!`;
      body = "Complete one quest today to keep it alive.";
    } else if (!activeToday && pending > 0) {
      title = "⚔️ Your daily quests await";
      body = `${pending} quest${pending > 1 ? "s" : ""} left — and a boss to defeat.`;
    }
    if (!title) return;

    // small delay so it doesn't fire the instant the page loads
    const t = setTimeout(() => {
      try {
        new Notification(title, { body, icon: "/icon.svg", badge: "/icon.svg", tag: "movequest-daily" });
        localStorage.setItem(LAST_KEY, today);
      } catch {
        /* ignore */
      }
    }, 4000);
    return () => clearTimeout(t);
  }, [ready, state.notificationsEnabled, state.profile, state.streak, state.quests]);

  return null;
}
