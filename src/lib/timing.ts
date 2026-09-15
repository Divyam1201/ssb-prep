import type { ModuleId, SetItem, TimerPhase } from "./types";

/**
 * Base durations, taken from standard SSB timing. Sequential modules
 * (TAT/WAT) apply these per item, so total run time scales with item count
 * automatically. SRT is a single static phase, so its total duration is
 * computed explicitly from the per-situation rate below.
 */
const TAT_IMAGE_VIEW_SECONDS = 30;
const TAT_WRITE_SECONDS = 4 * 60;
const WAT_WORD_SECONDS = 15;
const SRT_SECONDS_PER_SITUATION = 30; // 60 situations -> 1800s (30 min)
const LECTURETTE_PREP_SECONDS = 3 * 60;
const LECTURETTE_NARRATE_SECONDS = 3 * 60;

/**
 * Builds the ordered list of timed phases for a practice run.
 *
 * - TAT: [show, write] pairs, one pair per image.
 * - WAT: one [show] phase per word.
 * - SRT: a single phase covering the whole set, scaled to item count.
 * - Lecturette: exactly one [prep, narrate] pair, for the single topic the
 *   user picked (pass a one-item array as `items`).
 */
export function buildPhases(moduleId: ModuleId, items: SetItem[]): TimerPhase[] {
  switch (moduleId) {
    case "tat":
      return items.flatMap((item, index) => [
        {
          id: `${item.id}-show`,
          label: "Study the image",
          durationSeconds: TAT_IMAGE_VIEW_SECONDS,
          itemIndex: index,
        },
        {
          id: `${item.id}-write`,
          label: "Write your story",
          durationSeconds: TAT_WRITE_SECONDS,
          itemIndex: index,
        },
      ]);

    case "wat":
      return items.map((item, index) => ({
        id: `${item.id}-show`,
        label: "Respond",
        durationSeconds: WAT_WORD_SECONDS,
        itemIndex: index,
      }));

    case "srt":
      return [
        {
          id: "srt-run",
          label: "Answer the situations",
          durationSeconds: items.length * SRT_SECONDS_PER_SITUATION,
        },
      ];

    case "lecturette": {
      const topic = items[0];
      if (!topic) return [];
      return [
        { id: `${topic.id}-prep`, label: "Preparation time", durationSeconds: LECTURETTE_PREP_SECONDS },
        { id: `${topic.id}-narrate`, label: "Narrate", durationSeconds: LECTURETTE_NARRATE_SECONDS },
      ];
    }

    default:
      return [];
  }
}

export function formatClock(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (safeSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}
