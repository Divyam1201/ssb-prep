import Link from "next/link";
import type { ModuleConfig } from "@/lib/modules";
import type { PracticeSet } from "@/lib/types";
import { SetCompletenessBadge } from "@/components/ui/set-completeness-badge";

interface SetListProps {
  moduleConfig: ModuleConfig;
  sets: PracticeSet[];
}

export function SetList({ moduleConfig, sets }: SetListProps) {
  if (sets.length === 0) {
    return (
      <p className="font-sans text-sm text-muted">
        No {moduleConfig.label} sets yet — be the first to submit one below.
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-gold/10 rounded-md border border-gold/15 bg-ink-2">
      {sets.map((set) => (
        <li key={set.id}>
          <Link
            href={`${moduleConfig.route}/${set.id}`}
            className="flex items-center justify-between gap-4 px-5 py-4 transition-colors duration-150 hover:bg-[#1d242c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-parchment focus-visible:outline-offset-2"
          >
            <div>
              <p className="text-parchment">{set.name}</p>
              <p className="mt-0.5 font-sans text-xs text-muted">
                {set.items.length} item{set.items.length === 1 ? "" : "s"}
              </p>
            </div>
            <SetCompletenessBadge isComplete={set.isComplete} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
