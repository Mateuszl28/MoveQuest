"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Swords, Check } from "lucide-react";
import { useGame } from "@/lib/game-store";
import type { Difficulty, FitnessLevel, HeroClass } from "@/lib/types";
import { HERO_CLASSES } from "@/lib/classes";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useT } from "@/lib/i18n";
import { LanguageToggle } from "@/components/language-toggle";

const STEPS = 4;

const AVATARS = ["🦸", "🥷", "🧝", "🧙", "🦊", "🐺", "🐻", "🦉", "🐲", "🦁", "🐯", "🦅"];

const LEVELS: { value: FitnessLevel; label: string; desc: string; emoji: string }[] = [
  { value: "beginner", label: "Beginner", desc: "New to this — start gentle", emoji: "🌱" },
  { value: "intermediate", label: "Intermediate", desc: "I move a few times a week", emoji: "⚡" },
  { value: "advanced", label: "Advanced", desc: "Bring on the challenge", emoji: "🔥" },
];

const DIFFS: { value: Difficulty; label: string; desc: string }[] = [
  { value: "easy", label: "Chill", desc: "Lighter quests, steady wins" },
  { value: "medium", label: "Balanced", desc: "A bit of everything" },
  { value: "hard", label: "Hardcore", desc: "Maximum XP, maximum effort" },
];

export default function Onboarding() {
  const router = useRouter();
  const { state, ready, createProfile } = useGame();
  const { t } = useT();
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [age, setAge] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>("beginner");
  const [difficultyPreference, setDifficultyPreference] = useState<Difficulty>("medium");
  const [heroClass, setHeroClass] = useState<HeroClass>("allrounder");

  // already onboarded → go to dashboard
  useEffect(() => {
    if (ready && state.profile) router.replace("/dashboard");
  }, [ready, state.profile, router]);

  const canContinue =
    (step === 0 && username.trim().length >= 2) ||
    step === 1 ||
    (step === 2 && Number(age) >= 5 && Number(age) <= 120) ||
    step === 3;

  const finish = () => {
    createProfile({
      username: username.trim(),
      avatar,
      age: Number(age) || 18,
      fitnessLevel,
      difficultyPreference,
      heroClass,
    });
    router.push("/dashboard");
  };

  const next = () => (step < STEPS - 1 ? setStep((s) => s + 1) : finish());

  return (
    <main className="flex min-h-dvh flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-md items-center justify-between px-4 py-5">
        <Link href="/" className="flex items-center gap-2 font-display font-extrabold">
          <span className="grid size-8 place-items-center rounded-lg bg-lime-400/15 ring-1 ring-inset ring-lime-400/30">
            <Swords className="size-4 text-white" />
          </span>
          Move<span className="text-gradient">Quest</span>
        </Link>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <span className="text-sm text-muted">{t("ob.step", "Step")} {step + 1} / {STEPS}</span>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-10">
        {/* progress dots */}
        <div className="mb-8 flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-lime-400/15 ring-1 ring-inset ring-lime-400/30" : "bg-white/10"}`}
            />
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1"
        >
          {step === 0 && (
            <div>
              <h1 className="font-display text-3xl font-extrabold">{t("ob.hero.title", "Create your hero")}</h1>
              <p className="mt-2 text-muted">{t("ob.hero.sub", "Pick a name and an avatar for your adventure.")}</p>

              <div className="mt-7 space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  autoFocus
                  placeholder="e.g. ShadowStrider"
                  value={username}
                  maxLength={20}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canContinue && next()}
                />
              </div>

              <div className="mt-6 space-y-2">
                <Label>Avatar</Label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATARS.map((a) => (
                    <button
                      key={a}
                      onClick={() => setAvatar(a)}
                      className={`grid aspect-square place-items-center rounded-xl border text-2xl transition-all ${
                        avatar === a
                          ? "border-lime-400 bg-lime-400/20 scale-105"
                          : "border-border bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h1 className="font-display text-3xl font-extrabold">{t("ob.class.title", "Pick your class")}</h1>
              <p className="mt-2 text-muted">{t("ob.class.sub", "It shapes your daily quests and grants a passive perk.")}</p>

              <div className="mt-7 grid grid-cols-2 gap-2.5">
                {HERO_CLASSES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setHeroClass(c.id)}
                    className={`rounded-2xl border p-4 text-left transition-all ${
                      heroClass === c.id
                        ? "border-lime-400 bg-lime-400/15"
                        : "border-border bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-3xl">{c.emoji}</span>
                    <p className="mt-2 font-display font-bold">{c.name}</p>
                    <p className="text-[11px] text-muted">{c.blurb}</p>
                    <p className={`mt-2 text-[11px] font-semibold ${c.accent}`}>{c.passive}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="font-display text-3xl font-extrabold">{t("ob.about.title", "A bit about you")}</h1>
              <p className="mt-2 text-muted">{t("ob.about.sub", "We tune quest difficulty to your level.")}</p>

              <div className="mt-7 space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  autoFocus
                  placeholder="e.g. 24"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>

              <div className="mt-6 space-y-2">
                <Label>Fitness level</Label>
                <div className="space-y-2">
                  {LEVELS.map((l) => (
                    <button
                      key={l.value}
                      onClick={() => setFitnessLevel(l.value)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                        fitnessLevel === l.value
                          ? "border-lime-400 bg-lime-400/15"
                          : "border-border bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-2xl">{l.emoji}</span>
                      <span className="flex-1">
                        <span className="block font-semibold">{l.label}</span>
                        <span className="block text-xs text-muted">{l.desc}</span>
                      </span>
                      {fitnessLevel === l.value && <Check className="size-5 text-lime-300" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="font-display text-3xl font-extrabold">{t("ob.pace.title", "Choose your pace")}</h1>
              <p className="mt-2 text-muted">{t("ob.pace.sub", "How hard should your daily quests hit?")}</p>

              <div className="mt-7 space-y-2">
                {DIFFS.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDifficultyPreference(d.value)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                      difficultyPreference === d.value
                        ? "border-lime-400 bg-lime-400/15"
                        : "border-border bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <span className="flex-1">
                      <span className="block font-semibold">{d.label}</span>
                      <span className="block text-xs text-muted">{d.desc}</span>
                    </span>
                    {difficultyPreference === d.value && <Check className="size-5 text-lime-300" />}
                  </button>
                ))}
              </div>

              <div className="mt-7 rounded-2xl border border-border bg-card/60 p-4">
                <p className="text-sm text-muted">Your hero</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-xl bg-lime-400/15 ring-1 ring-inset ring-lime-400/30 text-2xl">{avatar}</span>
                  <div>
                    <p className="font-display font-bold">{username || "Adventurer"}</p>
                    <p className="text-xs text-muted capitalize">
                      {HERO_CLASSES.find((c) => c.id === heroClass)?.name} · {fitnessLevel} · {difficultyPreference} pace
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        <div className="mt-8 flex items-center gap-3">
          {step > 0 && (
            <Button variant="outline" size="lg" onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft />
            </Button>
          )}
          <Button size="lg" className="flex-1 group" disabled={!canContinue} onClick={next}>
            {step === STEPS - 1 ? t("ob.start", "Start Your Quest") : t("ob.continue", "Continue")}
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </main>
  );
}
