import { cn } from "@/lib/cn";

export function SetCompletenessBadge({ isComplete }: { isComplete: boolean }) {
  return (
    <span
      className={cn(
        "font-sans text-[10px] uppercase tracking-[1.5px] px-2 py-0.5 rounded-sm",
        isComplete
          ? "bg-tier-veasy/20 text-tier-veasy"
          : "bg-tier-moderate/20 text-tier-moderate"
      )}
    >
      {isComplete ? "Complete Set" : "Partial Set"}
    </span>
  );
}
