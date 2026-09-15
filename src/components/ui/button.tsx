import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "gold" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  gold: "bg-gold text-[#1c1f16] font-semibold hover:bg-[#d4b06e] active:scale-[0.97]",
  ghost:
    "bg-transparent text-muted border border-gold/35 hover:bg-gold/10 hover:text-parchment",
};

/** Base button used across the app — the sizing/shape stays consistent,
 *  only the variant (gold call-to-action vs. quiet ghost) changes. */
export function Button({ variant = "gold", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "font-sans text-sm tracking-wide rounded-[3px] px-5 py-2.5 transition-all duration-150 cursor-pointer",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-parchment focus-visible:outline-offset-2",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-inherit",
        VARIANT_CLASSES[variant],
        className
      )}
      {...props}
    />
  );
}
