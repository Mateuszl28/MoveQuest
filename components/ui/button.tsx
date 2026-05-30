import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold tracking-tight transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:translate-y-px [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // signature: solid lime, ink text
        default:
          "bg-lime-300 text-[#15200a] shadow-[0_10px_30px_-12px_rgba(163,230,53,0.7)] hover:bg-lime-200",
        gold:
          "bg-amber-300 text-amber-950 shadow-[0_10px_30px_-12px_rgba(245,183,60,0.7)] hover:bg-amber-200",
        success:
          "bg-emerald-400 text-emerald-950 hover:bg-emerald-300",
        outline:
          "border border-border bg-white/[0.03] text-foreground hover:border-lime-400/40 hover:bg-white/[0.06]",
        ghost: "text-muted hover:bg-white/5 hover:text-foreground",
        secondary: "bg-surface-2 text-foreground hover:bg-surface-2/70 border border-border",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 px-3.5 text-xs",
        lg: "h-13 px-8 text-base rounded-2xl",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  ),
);
Button.displayName = "Button";

export { Button, buttonVariants };
