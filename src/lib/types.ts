/**
 * Core domain types for the SSB prep app.
 *
 * The four practice modules (TAT, WAT, SRT, Lecturette) share the same
 * high-level shape — a named, community-submitted "set" made up of items —
 * but differ in what an "item" is and how it's timed. Keeping that shared
 * shape here lets the rest of the app (DB layer, API routes, timer engine)
 * stay module-agnostic.
 */

export type ModuleId = "tat" | "wat" | "srt" | "lecturette";

export type DifficultyTier = "veasy" | "easy" | "moderate" | "high";

/** A single item within a set. The `content` shape depends on the module:
 *  - TAT: an image URL (stored in Cloudflare R2)
 *  - WAT: a single word
 *  - SRT: a single situation (sentence/paragraph)
 *  - Lecturette: a topic, tagged with a difficulty tier by the AI curator
 */
export interface SetItem {
  id: string;
  content: string;
  tier?: DifficultyTier; // only populated for Lecturette
}

/** A community-submitted, shared practice set for one module. */
export interface PracticeSet {
  id: string;
  moduleId: ModuleId;
  name: string;
  items: SetItem[];
  /** Whether `items.length` reached the module's max item count. */
  isComplete: boolean;
  createdAt: string;
}

/** One phase of a timed run — e.g. "show image" or "write your story".
 *  The timer engine only cares about duration and an identifying label;
 *  what happens on screen during a phase is up to the calling component.
 */
export interface TimerPhase {
  id: string;
  label: string;
  durationSeconds: number;
  /** Index into the set's items this phase corresponds to, if any. Lets a
   *  sequential module (TAT/WAT) know which item to render for this phase. */
  itemIndex?: number;
}
