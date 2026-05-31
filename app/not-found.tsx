import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="text-7xl">🗺️</div>
      <div>
        <p className="font-display text-6xl font-extrabold text-gradient">404</p>
        <h1 className="mt-2 font-display text-2xl font-bold">This path leads off the map</h1>
        <p className="mt-2 text-muted">
          The quest you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back on the trail.
        </p>
      </div>
      <div className="flex gap-3">
        <Link
          href="/dashboard"
          className="rounded-xl bg-lime-300 px-6 py-3 font-display font-bold text-[#15200a] shadow-[0_10px_30px_-12px_rgba(163,230,53,0.7)] active:scale-95"
        >
          To the dashboard
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-border bg-white/5 px-6 py-3 font-semibold hover:bg-white/10"
        >
          Home
        </Link>
      </div>
    </main>
  );
}
