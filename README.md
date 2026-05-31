# ⚔️ MoveQuest

**Turn real-life movement into epic adventures.** MoveQuest is a "Duolingo for physical
activity" — complete real-world movement quests, earn XP, level up your character, defeat
daily bosses, and climb the leaderboard. A fitness app that feels like an RPG.

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8)

---

## ✨ Features

**Core RPG loop**
- **Adaptive quest engine** — daily quests from your fitness level, class, difficulty preference
  and streak (deterministic per-day). Time-based quests have a built-in **timer**; step quests
  link to a **steps widget**; you can **reroll** a quest for coins or add your **own quests**.
- **XP, levels & ranks** — `level = floor(totalXP / 500) + 1`. Easy 25 · Medium 50 · Hard 100 XP.
  Seven ranks from Novice to Legend.
- **Hero classes** — Warrior / Runner / Yogi / All-Rounder, each biasing the daily mix and
  granting an XP passive.
- **Character progression** — Strength, Endurance, Agility & Consistency on an animated radar
  chart, plus a lifetime stats panel and a 12-week **activity heatmap**.

**Gamification**
- **XP combo multiplier** — back-to-back completions stack up to ×1.5 with a live combo meter.
- **Daily events** — rotating modifiers (category XP boost / boss frenzy / coin rush) with real effects.
- **Daily boss + weekly raid** — every quest damages both; defeat them for big rewards.
- **Perfect Day** — clear every quest for a confetti celebration and bonus.
- **Streaks** — current/best, weekly grid, milestone rewards, and buyable **streak freezes**.
- **Achievements** — collectible badges with live progress and unlock toasts.
- **Coins economy** — earn coins; spend them in the **reward shop** (titles + premium avatars),
  on rerolls/freezes, or via the **daily reward** and the **fortune wheel**.
- **Companion pet** — pick a species that evolves through four stages as you level.
- **Friend challenges, weekly challenge & leaderboard** (global/friends, sortable).
- **AI Coach (Coach Quill)** — a context-aware chat coach.

**Platform & polish**
- **Bilingual (EN / 🇵🇱 PL)** — full UI + content translation, auto-detected, live toggle, no progress loss.
- **Shareable hero card** — server-rendered OG image + share page for link previews.
- **Installable PWA** — offline service worker, install prompt, web manifest.
- **Opt-in reminders** (Notification API), **sound effects** (Web Audio) and **haptics**.
- **Premium gaming UI** — ink theme with a single lime accent, gold for XP, film-grain texture,
  Bricolage Grotesque display font, mobile-first, Framer Motion animations.

## 🧱 Tech stack

| | |
|---|---|
| Framework | **Next.js (App Router)** + **TypeScript** |
| Styling | **Tailwind CSS v4** + a small shadcn/ui-style component layer |
| Animation | **Framer Motion** |
| Charts | **Recharts** (radar chart) |
| Icons | **lucide-react** |
| Persistence | **localStorage** (self-contained MVP) — Supabase schema included for production |

## 🚀 Getting started

```bash
npm install
npm run dev     # http://localhost:3000
```

Production:

```bash
npm run build
npm run start   # serves on port 3000
```

## 🗂️ Project structure

```
app/
  layout.tsx            Root layout · fonts · GameProvider · achievement toast
  page.tsx              Landing page (hero, how-it-works, features, bosses, FAQ…)
  login/page.tsx        3-step hero onboarding (local profile)
  dashboard/page.tsx    Main dashboard (tabs: overview, quests, hero, badges, ranks, coach)
components/
  ui/                   button · card · progress · badge · input · tabs
  game/                 quest-card · boss-battle · streak-widget · character-card ·
                        stat-radar · achievements-gallery · leaderboard · coach · icon ·
                        achievement-toast
  landing/              faq
lib/
  types.ts              Domain types (Quest, Boss, CharacterStats, GameState…)
  game-store.tsx        React context + reducer + localStorage persistence + daily rollover
  quests.ts             Quest pool + deterministic daily generator
  bosses.ts             Daily boss roster + HP scaling
  achievements.ts       Achievement definitions + evaluation
  leaderboard.ts        Mock global/friends rankings + sorting
  utils.ts              cn() · XP/level math · seeded PRNG · date helpers
supabase/
  schema.sql            Full PostgreSQL schema + RLS (production blueprint)
public/
  manifest.webmanifest  PWA manifest
  icon.svg              App icon
```

## 🧠 How the "AI" quest generator works

The MVP ships an offline, deterministic quest engine (`lib/quests.ts`) so the demo works with
zero API keys. It seeds a PRNG from `date + fitness level + difficulty preference`, scales
rep/duration targets to the player's level, and assembles a balanced daily set across
cardio / strength / mobility / wellness. A 3-day+ streak unlocks a bonus hard quest.

To switch to a real LLM (Gemini/OpenAI), add an API route that returns the same `Quest[]`
shape and call it from `withDailyRollover` in `lib/game-store.tsx` — the rest of the app is
already written against the schema.

## 🗄️ Going to production with Supabase

1. Create a Supabase project and run `supabase/schema.sql` in the SQL editor.
2. Add to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
3. Replace the localStorage reads/writes in `lib/game-store.tsx` with Supabase queries.
   Tables: `users`, `quests`, `quest_completions`, `achievements`, `bosses`, `boss_damage`,
   `streaks`, `character_stats`, and the `leaderboard` view — all with row-level security.

## 🎮 Demo flow

1. Landing → **Start Your Quest**
2. Create your hero (name, avatar, age, fitness level, pace)
3. Land on the dashboard → complete quests → watch XP rise, stats grow, and the boss's HP drop
4. Defeat the boss for bonus XP, build your streak, unlock achievements, climb the leaderboard

---

Built as a polished hackathon MVP. © 2026 MoveQuest.
