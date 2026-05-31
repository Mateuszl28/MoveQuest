import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "MoveQuest — Turn Real-Life Movement Into Epic Adventures";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const ink = "#0a0b0d";
  const lime = "#bef264";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 28,
          background: ink,
          backgroundImage: "linear-gradient(135deg, #0c1206 0%, #0a0b0d 45%, #0a0d0b 100%)",
          borderTop: `10px solid ${lime}`,
          padding: 80,
          fontFamily: "sans-serif",
          color: "#eceef1",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 18,
              background: lime,
              color: ink,
              fontSize: 40,
              fontWeight: 800,
            }}
          >
            ⚔
          </div>
          <span style={{ fontSize: 40, fontWeight: 800 }}>
            Move<span style={{ color: lime }}>Quest</span>
          </span>
        </div>
        <span style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, maxWidth: 980 }}>
          Turn real-life movement into{" "}
          <span style={{ color: lime }}>epic adventures</span>
        </span>
        <span style={{ fontSize: 30, color: "#868d97", maxWidth: 900 }}>
          Complete quests, earn XP, defeat bosses, and level up your real life.
        </span>
      </div>
    ),
    size,
  );
}
