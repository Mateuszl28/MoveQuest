import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:brightness-110",
        gold:
          "bg-gradient-to-r from-amber-300 to-amber-500 text-amber-950 shadow-lg shadow-amber-500/25 hover:brightness-105",
        success:
          "bg-gradient-to-r from-emerald-400 to-green-500 text-emerald-950 shadow-lg shadow-emerald-500/25 hover:brightness-105",
        outline:
          "border border-border bg-white/5 text-foreground hover:bg-white/10",
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
