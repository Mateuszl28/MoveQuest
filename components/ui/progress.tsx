"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number; // 0..100
  className?: string;
  barClassName?: string;
  /** show an accent glow on the bar */
  glow?: boolean;
}

export function Progress({ value, className, barClassName, glow }: ProgressProps) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-full bg-white/[0.06] ring-1 ring-inset ring-white/[0.04]",
        className,
      )}
    >
      <motion.div
        className={cn(
          "h-full rounded-full bg-gradient-to-r from-lime-400 to-lime-300",
          glow && "shadow-[0_0_16px_-2px_rgba(163,230,53,0.85)]",
          barClassName,
        )}
        initial={{ width: 0 }}
        animate={{ width: `${v}%` }}
        transition={{ type: "spring", stiffness: 90, damping: 18 }}
      />
    </div>
  );
}
