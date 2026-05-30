"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number; // 0..100
  className?: string;
  barClassName?: string;
  /** show an animated shimmer on the bar */
  glow?: boolean;
}

export function Progress({ value, className, barClassName, glow }: ProgressProps) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-full bg-white/8 ring-1 ring-inset ring-white/5",
        className,
      )}
    >
      <motion.div
        className={cn(
          "h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500",
          glow && "shadow-[0_0_18px_-2px_rgba(139,92,246,0.8)]",
          barClassName,
        )}
        initial={{ width: 0 }}
        animate={{ width: `${v}%` }}
        transition={{ type: "spring", stiffness: 90, damping: 18 }}
      />
    </div>
  );
}
