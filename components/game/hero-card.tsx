"use client";

import { useState } from "react";
import { Download, Share2, Check } from "lucide-react";
import { cardQuery, type CardFields } from "@/lib/share";

export function HeroCard({ fields }: { fields: CardFields }) {
  const [copied, setCopied] = useState(false);
  const query = cardQuery(fields);
  const imgUrl = `/api/card?${query}`;

  const share = async () => {
    const shareUrl = `${window.location.origin}/card?${query}`;
    const text = `I'm a level ${fields.level} ${fields.cls} on MoveQuest — ${fields.streak}-day streak! 💪`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "MoveQuest", text, url: shareUrl });
        return;
      } catch {
        /* user cancelled — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5">
      <div className="mb-3 flex items-center gap-2">
        <Share2 className="size-5 text-lime-300" />
        <h3 className="font-display font-bold">Share your hero</h3>
      </div>

      {/* live preview of the exact image that gets shared */}
      <div className="overflow-hidden rounded-xl border border-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imgUrl} alt="Your MoveQuest hero card" className="w-full" />
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={share}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-lime-300 py-2.5 text-sm font-bold text-[#15200a] active:scale-95"
        >
          {copied ? <><Check className="size-4" /> Link copied!</> : <><Share2 className="size-4" /> Share</>}
        </button>
        <a
          href={imgUrl}
          download="movequest-hero.png"
          className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-white/5 px-4 py-2.5 text-sm font-semibold hover:bg-white/10 active:scale-95"
        >
          <Download className="size-4" /> PNG
        </a>
      </div>
    </div>
  );
}
