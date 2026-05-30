"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, Sparkles, Swords, Flame, Trophy, Star, Users, Dumbbell,
  Footprints, BrainCircuit, ChartNoAxesColumn, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FAQ } from "@/components/landing/faq";

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

const FEATURES = [
  { icon: BrainCircuit, title: "Adaptive Quests", desc: "A smart engine crafts daily challenges tuned to your level, streak and difficulty preference.", color: "text-violet-300" },
  { icon: Zap, title: "XP & Levels", desc: "Every quest earns XP. Watch your level climb and your progress bar fill with each victory.", color: "text-amber-300" },
  { icon: ChartNoAxesColumn, title: "RPG Stats", desc: "Build Strength, Endurance, Agility and Consistency — visualised on a living radar chart.", color: "text-sky-300" },
  { icon: Flame, title: "Streaks", desc: "Show up daily, build unstoppable streaks, and unlock milestone rewards at 3, 7, 14 & 30 days.", color: "text-orange-300" },
  { icon: Swords, title: "Daily Boss Battles", desc: "Each completed quest deals damage to the day's boss. Defeat it for big bonus XP.", color: "text-rose-300" },
  { icon: Users, title: "Leaderboards", desc: "Climb global and friends rankings by XP, level or streak. Friendly rivalry, real results.", color: "text-emerald-300" },
];

const STEPS = [
  { n: 1, icon: Footprints, title: "Move in real life", desc: "Walk, squat, stretch, hydrate — small actions, real progress." },
  { n: 2, icon: Sparkles, title: "Complete quests", desc: "Tap to claim XP, build stats, and damage the daily boss." },
  { n: 3, icon: Trophy, title: "Level up your life", desc: "Earn achievements, keep your streak, and climb the leaderboard." },
];

const ACHIEVEMENTS = [
  { icon: Footprints, name: "First Steps", tier: "Bronze", color: "from-orange-300 to-amber-600" },
  { icon: Dumbbell, name: "Squat Warrior", tier: "Silver", color: "from-slate-200 to-slate-400" },
  { icon: Flame, name: "7-Day Hero", tier: "Gold", color: "from-amber-300 to-amber-500" },
  { icon: Star, name: "XP Master", tier: "Legendary", color: "from-fuchsia-400 to-violet-600" },
];

const BOSSES = [
  { emoji: "🐉", name: "Sedentary Dragon", hp: "Hoarder of Comfort" },
  { emoji: "👹", name: "Burnout Beast", hp: "Devourer of Motivation" },
  { emoji: "🐲", name: "Hydra of Laziness", hp: "Many-Headed Procrastinator" },
];

const TESTIMONIALS = [
  { q: "I finally stuck to a routine. Defeating the boss every day is weirdly addictive.", n: "Maya R.", r: "Lvl 14 · 28-day streak", a: "🦊" },
  { q: "It's the only fitness app that feels like a game instead of a chore.", n: "Daniel K.", r: "Lvl 9 · Boss Slayer", a: "🐻" },
  { q: "The radar chart leveling up keeps me coming back. 10/10 dopamine.", n: "Priya S.", r: "Lvl 21 · XP Master", a: "🦉" },
];

export default function Landing() {
  return (
    <main className="flex-1">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-extrabold">
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/30">
              <Swords className="size-5 text-white" />
            </span>
            Move<span className="text-gradient">Quest</span>
          </Link>
          <div className="hidden items-center gap-7 text-sm text-muted md:flex">
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#bosses" className="hover:text-foreground">Bosses</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
          </div>
          <Link href="/login">
            <Button size="sm">Start Your Quest</Button>
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative mx-auto max-w-6xl px-4 pt-16 pb-20 text-center md:pt-24">
        <Reveal>
          <Badge variant="gold" className="mx-auto mb-6 px-3 py-1 text-sm">
            <Sparkles className="size-3.5" /> Duolingo for physical activity
          </Badge>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
            Turn Real-Life Movement Into{" "}
            <span className="text-gradient">Epic Adventures</span>
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            Complete quests, earn XP, defeat bosses, and level up your real life. The RPG that
            rewards you every time you move.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/login">
              <Button size="lg" className="group">
                Start Your Quest
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href="#how">
              <Button size="lg" variant="outline">See how it works</Button>
            </a>
          </div>
        </Reveal>

        {/* floating hero mock */}
        <Reveal delay={0.2}>
          <div className="relative mx-auto mt-16 max-w-3xl">
            <div className="animate-float glass glow-primary rounded-3xl p-5 text-left">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 text-2xl">🦸</span>
                  <div>
                    <p className="font-display font-bold">Level 12 Adventurer</p>
                    <p className="text-xs text-muted">5,940 XP · 9-day streak 🔥</p>
                  </div>
                </div>
                <Badge variant="gold"><Star className="size-3.5" /> +75 XP</Badge>
              </div>
              <div className="mb-4 h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 shadow-[0_0_18px_-2px_rgba(139,92,246,0.8)]" />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { t: "Walk 4,000 steps", x: 25, done: true },
                  { t: "Do 20 squats", x: 25, done: true },
                  { t: "10-minute yoga session", x: 50, done: false },
                  { t: "30-minute bike ride", x: 100, done: false },
                ].map((q) => (
                  <div
                    key={q.t}
                    className={`flex items-center justify-between rounded-xl border px-3 py-2.5 ${q.done ? "border-emerald-500/30 bg-emerald-500/10" : "border-border bg-white/5"}`}
                  >
                    <span className={`text-sm ${q.done ? "text-emerald-300 line-through" : ""}`}>{q.t}</span>
                    <span className="text-xs font-semibold text-gold">+{q.x}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -right-2 -top-8 hidden rotate-6 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm backdrop-blur md:block">
              🐉 <span className="font-semibold">Sedentary Dragon</span> · 40 HP
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-14 grid grid-cols-3 gap-4 text-center">
            {[
              { v: "120+", l: "Quest variations" },
              { v: "7", l: "Daily bosses" },
              { v: "∞", l: "Streak potential" },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-display text-3xl font-extrabold text-gradient">{s.v}</p>
                <p className="text-sm text-muted">{s.l}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-20">
        <Reveal>
          <h2 className="text-center font-display text-3xl font-extrabold md:text-4xl">How it works</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted">Three simple steps between you and your next level.</p>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="relative h-full rounded-2xl border border-border bg-card/60 p-6 backdrop-blur">
                <span className="absolute right-5 top-5 font-display text-5xl font-black text-white/5">{s.n}</span>
                <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 ring-1 ring-inset ring-white/10">
                  <s.icon className="size-6 text-violet-300" />
                </div>
                <h3 className="font-display text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-muted">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-20">
        <Reveal>
          <h2 className="text-center font-display text-3xl font-extrabold md:text-4xl">
            A full <span className="text-gradient">RPG progression</span> system
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted">Everything you love about games, applied to moving your body.</p>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.06}>
              <div className="group h-full rounded-2xl border border-border bg-card/60 p-6 backdrop-blur transition-colors hover:border-violet-400/40">
                <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-white/5 ring-1 ring-inset ring-white/10 transition-transform group-hover:scale-110">
                  <f.icon className={`size-6 ${f.color}`} />
                </div>
                <h3 className="font-display text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal>
          <h2 className="text-center font-display text-3xl font-extrabold md:text-4xl">
            Collect <span className="text-gold-gradient">legendary</span> achievements
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted">Badges for every milestone — from your first quest to 5,000 XP.</p>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-4">
          {ACHIEVEMENTS.map((a, i) => (
            <Reveal key={a.name} delay={i * 0.06}>
              <div className="flex flex-col items-center rounded-2xl border border-border bg-card/60 p-6 text-center backdrop-blur">
                <div className={`mb-4 grid size-16 place-items-center rounded-2xl bg-gradient-to-br ${a.color} shadow-lg`}>
                  <a.icon className="size-8 text-white drop-shadow" />
                </div>
                <p className="font-display font-bold">{a.name}</p>
                <p className="text-xs uppercase tracking-wider text-muted">{a.tier}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* BOSSES */}
      <section id="bosses" className="mx-auto max-w-6xl px-4 py-20">
        <div className="overflow-hidden rounded-3xl border border-rose-400/20 bg-gradient-to-br from-rose-500/10 via-card/60 to-violet-500/10 p-8 backdrop-blur md:p-12">
          <Reveal>
            <div className="text-center">
              <Badge variant="hard" className="mx-auto mb-4"><Swords className="size-3.5" /> Daily Boss Battle</Badge>
              <h2 className="font-display text-3xl font-extrabold md:text-4xl">Every quest is a weapon</h2>
              <p className="mx-auto mt-3 max-w-xl text-muted">
                A new boss spawns each day. Complete quests to deal damage — defeat it before midnight for a massive XP bonus.
              </p>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {BOSSES.map((b, i) => (
              <Reveal key={b.name} delay={i * 0.08}>
                <div className="rounded-2xl border border-border bg-background/40 p-6 text-center">
                  <div className="mb-3 text-6xl">{b.emoji}</div>
                  <p className="font-display text-lg font-bold">{b.name}</p>
                  <p className="text-xs text-muted">{b.hp}</p>
                  <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose-500 to-red-600"
                      style={{ width: `${70 - i * 22}%` }}
                    />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal>
          <h2 className="text-center font-display text-3xl font-extrabold md:text-4xl">Adventurers love the grind</h2>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.n} delay={i * 0.08}>
              <figure className="flex h-full flex-col rounded-2xl border border-border bg-card/60 p-6 backdrop-blur">
                <div className="mb-3 flex gap-0.5 text-gold">{"★★★★★"}</div>
                <blockquote className="flex-1 text-foreground/90">“{t.q}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-white/5 text-xl">{t.a}</span>
                  <div>
                    <p className="text-sm font-semibold">{t.n}</p>
                    <p className="text-xs text-muted">{t.r}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-4 py-20">
        <Reveal>
          <h2 className="mb-12 text-center font-display text-3xl font-extrabold md:text-4xl">Frequently asked questions</h2>
        </Reveal>
        <FAQ />
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-violet-400/30 bg-gradient-to-br from-violet-600/30 via-indigo-600/20 to-blue-600/30 p-10 text-center md:p-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40rem_20rem_at_50%_-20%,rgba(255,255,255,0.15),transparent)]" />
          <Reveal>
            <h2 className="font-display text-3xl font-extrabold md:text-5xl">Your quest begins today</h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-foreground/80">
              Join the adventure. Level up your real life — one quest at a time.
            </p>
            <Link href="/login" className="mt-8 inline-block">
              <Button size="lg" variant="gold" className="group">
                Start Your Quest
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/60 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted md:flex-row">
          <div className="flex items-center gap-2 font-display font-bold text-foreground">
            <Swords className="size-4 text-violet-400" /> MoveQuest
          </div>
          <p>Built for movement. © 2026 MoveQuest.</p>
        </div>
      </footer>
    </main>
  );
}
