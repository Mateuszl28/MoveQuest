"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Tab {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export function Tabs({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: Tab[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-1 overflow-x-auto rounded-2xl border border-border bg-surface/60 p-1.5 backdrop-blur",
        className,
      )}
    >
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={cn(
              "relative flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors",
              active ? "text-white" : "text-muted hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/90 to-blue-500/90 shadow-lg shadow-violet-500/25"
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {t.icon}
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
