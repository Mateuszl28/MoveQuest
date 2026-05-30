"use client";

import { useT } from "@/lib/i18n";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useT();
  return (
    <div className={`inline-flex rounded-lg border border-border bg-white/5 p-0.5 text-xs font-semibold ${className}`}>
      {(["en", "pl"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`rounded-md px-2 py-1 uppercase transition-colors ${
            lang === l ? "bg-lime-300 text-[#15200a]" : "text-muted hover:text-foreground"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
