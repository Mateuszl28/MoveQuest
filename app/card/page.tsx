import Link from "next/link";
import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://212.132.124.0:3000";

type SP = Promise<Record<string, string | string[] | undefined>>;

function toQuery(params: Record<string, string | string[] | undefined>): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (typeof v === "string") p.set(k, v);
    else if (Array.isArray(v) && v[0]) p.set(k, v[0]);
  }
  return p.toString();
}

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const sp = await searchParams;
  const qs = toQuery(sp);
  const name = (typeof sp.u === "string" ? sp.u : "An adventurer");
  const title = `${name} on MoveQuest`;
  const description = `Level ${sp.lvl ?? 1} ${sp.cls ?? "hero"} · ${sp.streak ?? 0}-day streak. Turn real-life movement into epic adventures.`;
  const image = `/api/card?${qs}`;
  return {
    metadataBase: new URL(SITE),
    title,
    description,
    openGraph: { title, description, images: [{ url: image, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function CardPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const qs = toQuery(sp);
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-1 flex-col items-center justify-center gap-7 px-4 py-12 text-center">
      <div className="w-full overflow-hidden rounded-2xl border border-border shadow-2xl shadow-black/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/api/card?${qs}`} alt="MoveQuest hero card" className="w-full" />
      </div>
      <div>
        <h1 className="font-display text-3xl font-extrabold md:text-4xl">
          This is my <span className="text-gradient">MoveQuest</span> hero
        </h1>
        <p className="mt-3 text-muted">
          Complete real-world movement quests, earn XP, defeat bosses and level up your real life.
        </p>
      </div>
      <Link
        href="/login"
        className="rounded-2xl bg-lime-300 px-8 py-3 font-display text-base font-bold text-[#15200a] shadow-[0_10px_30px_-12px_rgba(163,230,53,0.7)] active:scale-95"
      >
        Start your own quest →
      </Link>
      <Link href="/" className="text-sm text-muted hover:text-foreground">← Back to MoveQuest</Link>
    </main>
  );
}
