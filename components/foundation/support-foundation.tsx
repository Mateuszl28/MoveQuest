"use client";

import { Heart, ExternalLink, HandHeart } from "lucide-react";

const DONATE_URL = "https://cancerfighters.pl/krs-walka-z-rakiem-przekaz-podatek/na-fundacje/";
const SITE_URL = "https://cancerfighters.pl/";
const KRS = "0000581036";

/**
 * A heartfelt, non-commercial shout-out to the Cancer Fighters Foundation.
 * MoveQuest is about real movement and real life — so we use a little of our
 * space to ask players to support people fighting the hardest battle of all.
 */
export function SupportFoundation({ variant = "section" }: { variant?: "section" | "card" }) {
  if (variant === "card") {
    return (
      <div className="rounded-2xl border border-rose-400/30 bg-gradient-to-br from-rose-500/10 to-pink-500/5 p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 shadow-lg shadow-rose-500/30">
            <Heart className="size-5 text-white" />
          </span>
          <div>
            <h3 className="font-display font-bold leading-tight">Beat a real boss</h3>
            <p className="text-xs text-muted">Fundacja Cancer Fighters</p>
          </div>
        </div>
        <p className="text-sm text-muted">
          The toughest boss isn&apos;t in this app. Cancer Fighters supports people fighting
          cancer and their families across Poland. If you can, lend them your strength. 💪
        </p>
        <a
          href={DONATE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 py-2 text-sm font-bold text-white shadow-lg shadow-rose-500/25 active:scale-95"
        >
          <HandHeart className="size-4" /> Support the fighters
        </a>
        <p className="mt-2 text-center text-[11px] text-muted">
          KRS {KRS} · 1.5% podatku ·{" "}
          <a href={SITE_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
            cancerfighters.pl
          </a>
        </p>
      </div>
    );
  }

  return (
    <section id="support" className="mx-auto max-w-6xl px-4 py-20">
      <div className="overflow-hidden rounded-3xl border border-rose-400/25 bg-gradient-to-br from-rose-500/10 via-card/60 to-pink-500/10 p-8 backdrop-blur md:p-12">
        <div className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
          <div className="mx-auto grid size-24 place-items-center rounded-3xl bg-gradient-to-br from-rose-400 to-pink-500 shadow-2xl shadow-rose-500/30 md:size-28">
            <Heart className="size-12 text-white md:size-14" />
          </div>
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold uppercase tracking-wider text-rose-300">
              A real-life quest that matters
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold md:text-4xl">
              Support <span className="text-rose-300">Fundacja Cancer Fighters</span>
            </h2>
            <p className="mt-4 max-w-2xl text-muted">
              MoveQuest is about turning real-life effort into something meaningful — and no
              battle is harder than fighting cancer. The Cancer Fighters Foundation gives
              financial, psychological and organizational support to children, adults and
              families facing cancer across Poland.{" "}
              <span className="text-foreground/90">
                „Nowotwór to wyzwanie, z którym nikt nie powinien zostać sam."
              </span>{" "}
              If you can spare a little strength, please consider helping — this is not an ad,
              just a request from one human to another.
            </p>

            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row md:items-start">
              <a
                href={DONATE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 px-6 py-3 font-display font-bold text-white shadow-lg shadow-rose-500/30 transition hover:brightness-110 active:scale-95"
              >
                <HandHeart className="size-5" /> Donate / Wesprzyj
              </a>
              <a
                href={SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-border bg-white/5 px-6 py-3 font-semibold text-foreground transition hover:bg-white/10"
              >
                cancerfighters.pl <ExternalLink className="size-4" />
              </a>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-muted md:justify-start">
              <span>KRS: <span className="font-semibold text-foreground">{KRS}</span></span>
              <span>Przekaż 1,5% podatku</span>
              <span>Konto: <span className="font-mono text-foreground/90">79 1240 6494 1111 0010 6532 9505</span></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
