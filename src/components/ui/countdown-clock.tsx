import { formatClock } from "@/lib/timing";
import { cn } from "@/lib/cn";

interface CountdownClockProps {
  remainingSeconds: number;
  /** "large" for a centered, full-attention clock (TAT/WAT/Lecturette).
   *  "corner" for the small persistent badge used by SRT. */
  size?: "large" | "corner";
  className?: string;
}

export function CountdownClock({
  remainingSeconds,
  size = "large",
  className,
}: CountdownClockProps) {
  const isLarge = size === "large";
  return (
    <div
      className={cn(
        "font-sans tabular-nums text-gold tracking-wide",
        isLarge ? "text-6xl" : "text-2xl",
        className
      )}
    >
      {formatClock(remainingSeconds)}
    </div>
  );
}
