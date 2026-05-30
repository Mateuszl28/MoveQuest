import { ImageResponse } from "next/og";

export const runtime = "nodejs";

function val(sp: URLSearchParams, k: string, d = "") {
  return sp.get(k) ?? d;
}

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const username = val(sp, "u", "Adventurer").slice(0, 24);
  const avatar = val(sp, "av", "🦸");
  const level = val(sp, "lvl", "1");
  const xp = val(sp, "xp", "0");
  const streak = val(sp, "streak", "0");
  const cls = val(sp, "cls", "All-Rounder");
  const rank = val(sp, "rank", "Novice");
  const badges = val(sp, "badges", "0");

  const ink = "#0a0b0d";
  const lime = "#bef264";
  const gold = "#f5b73c";
  const muted = "#868d97";

  const stat = (label: string, value: string, color: string) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        padding: "18px 26px",
        borderRadius: 20,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid #24272e",
      }}
    >
      <span style={{ fontSize: 40, fontWeight: 800, color }}>{value}</span>
      <span style={{ fontSize: 20, color: muted, textTransform: "uppercase", letterSpacing: 1 }}>{label}</span>
    </div>
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: ink,
          backgroundImage: `linear-gradient(135deg, #0c1206 0%, #0a0b0d 45%, #0a0d0b 100%)`,
          borderTop: `10px solid ${lime}`,
          padding: 64,
          fontFamily: "sans-serif",
          color: "#eceef1",
        }}
      >
        {/* brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 16,
              background: lime,
              color: ink,
              fontSize: 34,
              fontWeight: 800,
            }}
          >
            ⚔
          </div>
          <span style={{ fontSize: 34, fontWeight: 800 }}>
            Move<span style={{ color: lime }}>Quest</span>
          </span>
        </div>

        {/* hero */}
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 180,
              height: 180,
              borderRadius: 36,
              background: "rgba(190,242,100,0.12)",
              border: `2px solid rgba(190,242,100,0.35)`,
              fontSize: 110,
            }}
          >
            {avatar}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05 }}>{username}</span>
            <span style={{ fontSize: 30, color: lime, fontWeight: 700 }}>
              {cls} · {rank}
            </span>
          </div>
        </div>

        {/* stats */}
        <div style={{ display: "flex", gap: 20 }}>
          {stat("Level", level, lime)}
          {stat("Total XP", Number(xp).toLocaleString(), gold)}
          {stat("Streak", `${streak}🔥`, "#fb923c")}
          {stat("Badges", badges, "#34d399")}
        </div>

        {/* footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 26, color: muted }}>Turn real-life movement into epic adventures.</span>
          <span style={{ fontSize: 26, color: lime, fontWeight: 700 }}>Start your quest →</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
