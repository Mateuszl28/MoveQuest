import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
  {
    variants: {
      variant: {
        default: "bg-lime-400/15 text-lime-200 ring-lime-400/30",
        easy: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30",
        medium: "bg-amber-500/15 text-amber-300 ring-amber-400/30",
        hard: "bg-rose-500/15 text-rose-300 ring-rose-400/30",
        gold: "bg-amber-400/15 text-amber-200 ring-amber-300/40",
        success: "bg-green-500/15 text-green-300 ring-green-400/30",
        muted: "bg-white/5 text-muted ring-white/10",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
