import type { ModuleId } from "./types";

export interface ModuleConfig {
  id: ModuleId;
  /** Short label used in nav/cards, e.g. "WAT". */
  label: string;
  /** Full name shown on the module's own pages. */
  fullName: string;
  route: `/${ModuleId}`;
  /** One-line description for the home page card. */
  description: string;
  /** Max items a set may contain. `undefined` means uncapped (Lecturette —
   *  the AI curator works with whatever spread of topics it's given). */
  maxItems?: number;
  /** Whether items are shown one-at-a-time (TAT/WAT) or all at once with a
   *  single running clock (SRT). Lecturette is its own flow: the user picks
   *  one topic from the set, then runs a fixed two-phase timer on it. */
  displayMode: "sequential" | "static" | "single-pick";
}

export const MODULE_CONFIG: Record<ModuleId, ModuleConfig> = {
  tat: {
    id: "tat",
    label: "TAT",
    fullName: "Thematic Apperception Test",
    route: "/tat",
    description: "Picture story-writing — 30s to view, 4 minutes to write, per image.",
    maxItems: 11,
    displayMode: "sequential",
  },
  wat: {
    id: "wat",
    label: "WAT",
    fullName: "Word Association Test",
    route: "/wat",
    description: "Rapid word response — one word at a time, 15 seconds each.",
    maxItems: 60,
    displayMode: "sequential",
  },
  srt: {
    id: "srt",
    label: "SRT",
    fullName: "Situation Reaction Test",
    route: "/srt",
    description: "A full page of situations, one running clock for the whole set.",
    maxItems: 60,
    displayMode: "static",
  },
  lecturette: {
    id: "lecturette",
    label: "Lecturette",
    fullName: "Lecturette",
    route: "/lecturette",
    description: "Draw a topic, prepare for 3 minutes, then speak for 3 minutes.",
    displayMode: "single-pick",
  },
};

export const MODULE_LIST: ModuleConfig[] = Object.values(MODULE_CONFIG);

/** A set counts as "Complete" once it reaches the module's max item count.
 *  Modules with no max (Lecturette) are always treated as complete — there's
 *  no fuller state to compare against. */
export function isSetComplete(moduleId: ModuleId, itemCount: number): boolean {
  const max = MODULE_CONFIG[moduleId].maxItems;
  return max === undefined ? true : itemCount >= max;
}
