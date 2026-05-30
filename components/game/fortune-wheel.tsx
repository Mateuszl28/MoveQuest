"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { SLICE_DEG, WHEEL, type WheelPrize } from "@/lib/wheel";
import { useT } from "@/lib/i18n";

const gradient = `conic-gradient(${WHEEL.map(
  (p, i) => `${p.color} ${i * SLICE_DEG}deg ${(i + 1) * SLICE_DEG}deg`,
).join(", ")})`;

export function FortuneWheel({
  canSpin,
  onClaim,
}: {
  canSpin: boolean;
  onClaim: (prize: WheelPrize) => void;
}) {
  const { t } = useT();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [revealed, setRevealed] = useState<number | null>(null);
  const chosen = useRef(0);

  const spin = () => {
    if (!canSpin || spinning) return;
    const idx = Math.floor(Math.random() * WHEEL.length);
    chosen.current = idx;
    setRevealed(null);
    setSpinning(true);
    setRotation(360 * 6 + (360 - idx * SLICE_DEG - SLICE_DEG / 2));
    // result resolves in onAnimationComplete
  };

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="size-5 text-lime-300" />
        <h3 className="font-display font-bold">{t("wheel.title", "Fortune Wheel")}</h3>
        <span className="ml-auto text-xs text-muted">{t("wheel.free", "free daily spin")}</span>
      </div>

      <div className="relative mx-auto aspect-square w-52">
        {/* pointer */}
        <div className="absolute -top-1 left-1/2 z-10 -translate-x-1/2">
          <div className="size-0 border-x-8 border-t-[14px] border-x-transparent border-t-lime-300 drop-shadow" />
        </div>
        <motion.div
          className="size-full rounded-full ring-4 ring-white/10"
          style={{ background: gradient }}
          animate={{ rotate: rotation }}
          transition={{ duration: 3.6, ease: [0.16, 1, 0.3, 1] }}
          onAnimationComplete={() => {
            if (!spinning) return;
            const idx = chosen.current;
            setSpinning(false);
            setRevealed(idx);
            onClaim(WHEEL[idx]);
          }}
        >
          {WHEEL.map((p, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 origin-left"
              style={{ transform: `rotate(${i * SLICE_DEG + SLICE_DEG / 2}deg)` }}
            >
              <span className="block -translate-y-1/2 pl-6 text-[11px] font-bold text-[#15200a]">{p.label}</span>
            </div>
          ))}
        </motion.div>
        {/* hub */}
        <div className="absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background ring-2 ring-white/20" />
      </div>

      <div className="mt-4 text-center">
        {revealed !== null && (
          <p className="mb-2 text-sm font-semibold text-gold">🎉 {t("wheel.won", "You won")} {WHEEL[revealed].label}!</p>
        )}
        <button
          onClick={spin}
          disabled={!canSpin || spinning}
          className="w-full rounded-xl bg-lime-300 py-2.5 text-sm font-bold text-[#15200a] disabled:opacity-40 active:scale-95"
        >
          {spinning ? t("wheel.spinning", "Spinning…") : canSpin ? t("wheel.spin", "Spin the wheel") : t("wheel.tomorrow", "Come back tomorrow")}
        </button>
      </div>
    </div>
  );
}
