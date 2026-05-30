"use client";

import { useGame } from "./game-store";
import type { Lang } from "./types";

/** Polish strings keyed by a stable id. English is supplied inline at call sites
 *  as the fallback, so any missing key simply renders English — never broken. */
const PL: Record<string, string> = {
  // nav / landing
  "nav.how": "Jak to działa",
  "nav.features": "Funkcje",
  "nav.bosses": "Bossowie",
  "nav.support": "Wsparcie",
  "nav.faq": "FAQ",
  "cta.start": "Zacznij swoją wyprawę",
  "hero.badge": "Duolingo dla aktywności fizycznej",
  "hero.title.a": "Zamień ruch w realnym życiu w",
  "hero.title.b": "epickie przygody",
  "hero.sub": "Wykonuj zadania, zdobywaj XP, pokonuj bossów i podnoś poziom swojego życia. RPG, które nagradza Cię za każdy ruch.",
  "hero.how": "Zobacz, jak to działa",
  "stat.quests": "wariantów zadań",
  "stat.bosses": "dziennych bossów",
  "stat.streak": "potencjał serii",
  "how.title": "Jak to działa",
  "how.sub": "Trzy proste kroki dzielą Cię od kolejnego poziomu.",
  "how.s1.t": "Ruszaj się w realu",
  "how.s1.d": "Spacer, przysiady, rozciąganie, woda — małe akcje, realny postęp.",
  "how.s2.t": "Wykonuj zadania",
  "how.s2.d": "Odhaczaj, zgarniaj XP, buduj statystyki i raź bossa.",
  "how.s3.t": "Podnoś poziom życia",
  "how.s3.d": "Zdobywaj osiągnięcia, utrzymuj serię i wspinaj się w rankingu.",
  "feat.title.a": "Pełny",
  "feat.title.b": "system progresji RPG",
  "feat.sub": "Wszystko, co kochasz w grach, zastosowane do ruszania ciałem.",
  "ach.title.a": "Zbieraj",
  "ach.title.b": "legendarne",
  "ach.title.c": "osiągnięcia",
  "ach.sub": "Odznaki za każdy kamień milowy — od pierwszego zadania po 5000 XP.",
  "bosses.badge": "Dzienna walka z bossem",
  "bosses.title": "Każde zadanie to broń",
  "bosses.sub": "Każdego dnia pojawia się nowy boss. Wykonuj zadania, by zadawać obrażenia — pokonaj go przed północą po wielką premię XP.",
  "testi.title": "Gracze kochają ten grind",
  "faq.title": "Najczęściej zadawane pytania",
  "final.title": "Twoja wyprawa zaczyna się dziś",
  "final.sub": "Dołącz do przygody. Podnoś poziom swojego życia — jedno zadanie na raz.",
  "footer.tag": "Stworzone dla ruchu.",
  // onboarding
  "ob.step": "Krok",
  "ob.continue": "Dalej",
  "ob.start": "Zacznij wyprawę",
  "ob.hero.title": "Stwórz bohatera",
  "ob.hero.sub": "Wybierz imię i avatar dla swojej przygody.",
  "ob.username": "Nazwa",
  "ob.avatar": "Avatar",
  "ob.class.title": "Wybierz klasę",
  "ob.class.sub": "Kształtuje Twoje dzienne zadania i daje pasywny bonus.",
  "ob.about.title": "Trochę o Tobie",
  "ob.about.sub": "Dopasowujemy trudność zadań do Twojego poziomu.",
  "ob.age": "Wiek",
  "ob.level": "Poziom sprawności",
  "ob.pace.title": "Wybierz tempo",
  "ob.pace.sub": "Jak mocno mają uderzać Twoje dzienne zadania?",
  "ob.yourhero": "Twój bohater",
  // dashboard chrome
  "greet.morning": "Dzień dobry",
  "greet.afternoon": "Dzień dobry",
  "greet.evening": "Dobry wieczór",
  "tab.overview": "Przegląd",
  "tab.quests": "Zadania",
  "tab.hero": "Bohater",
  "tab.achievements": "Odznaki",
  "tab.leaderboard": "Ranking",
  "tab.coach": "Trener",
  "tab.shop": "Sklep",
  "tab.settings": "Ustawienia",
  "common.logout": "Wyloguj",
  "common.viewall": "Zobacz wszystkie",
  "common.full": "Pełny",
  "loading": "Ładowanie Twojej wyprawy…",
  "quests.title": "Dzienne zadania",
  "quests.newset": "Nowy zestaw",
  "quests.completed": "ukończono",
  "quests.xptoday": "XP dziś",
  "quests.allcleared": "🎉 Wszystkie zadania ukończone! Wróć jutro lub wygeneruj nowy zestaw.",
  "sec.achievements": "Osiągnięcia",
  "sec.leaderboard": "Ranking",
  "sec.character": "Progresja postaci",
  "sec.settings": "Ustawienia",
  "sec.shop": "Sklep z nagrodami",
  "next.lvl": "do poz.",
  // widgets
  "boss.daily": "Dzienny boss",
  "boss.ondefeat": "XP za pokonanie",
  "boss.hint": "Wykonuj zadania, by zadawać obrażenia ⚔️",
  "boss.defeated": "Boss pokonany!",
  "streak.day": "dni serii",
  "streak.best": "rekord",
  "streak.nextreward": "Następna nagroda",
  "weekly.title": "Tygodniowe wyzwanie",
  "event.today": "Dzisiejsze wydarzenie",
  "wheel.title": "Koło Fortuny",
  "wheel.free": "darmowe dzienne losowanie",
  "wheel.spin": "Zakręć kołem",
  "wheel.spinning": "Kręci się…",
  "wheel.tomorrow": "Wróć jutro",
  "wheel.won": "Wygrałeś",
  "reward.title": "Dzienna nagroda",
  "reward.claim": "Odbierz dzienną nagrodę",
  "reward.claimed": "Odebrane — wróć jutro",
  "steps.title": "Kroki dziś",
  "steps.goal": "cel",
  "steps.simulate": "Symuluj spacer",
  "lang.label": "Język",
};

export function useT() {
  const { state, setLang } = useGame();
  const lang = state.lang;
  const t = (key: string, en: string) => (lang === "pl" && PL[key] !== undefined ? PL[key] : en);
  return { t, lang, setLang };
}

export function detectLang(): Lang {
  if (typeof navigator === "undefined") return "en";
  return navigator.language?.toLowerCase().startsWith("pl") ? "pl" : "en";
}
