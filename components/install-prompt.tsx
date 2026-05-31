"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { useT } from "@/lib/i18n";

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const { t } = useT();
  const [evt, setEvt] = useState<BIPEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setEvt(e as BIPEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setEvt(null));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!evt) return null;

  return (
    <button
      onClick={async () => {
        await evt.prompt();
        await evt.userChoice;
        setEvt(null);
      }}
      className="inline-flex items-center gap-1.5 rounded-xl border border-lime-400/40 bg-lime-400/10 px-3 py-2 text-sm font-semibold text-lime-200 transition hover:bg-lime-400/15 active:scale-95"
    >
      <Download className="size-3.5" /> {t("install", "Install app")}
    </button>
  );
}
