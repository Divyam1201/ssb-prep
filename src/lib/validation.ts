import { z } from "zod";

const MODULE_ID_SCHEMA = z.enum(["tat", "wat", "srt", "lecturette"]);

const DIFFICULTY_TIER_SCHEMA = z.enum(["veasy", "easy", "moderate", "high"]);

/** Body shape for POST /api/sets — the client sends already AI-extracted
 *  item content (plus, for Lecturette, the AI-assigned difficulty tier). */
export const createSetSchema = z.object({
  moduleId: MODULE_ID_SCHEMA,
  name: z.string().trim().min(1, "Set name is required.").max(120),
  items: z
    .array(
      z.object({
        content: z.string().trim().min(1),
        tier: DIFFICULTY_TIER_SCHEMA.optional(),
      })
    )
    .min(1, "A set needs at least one item."),
});

export type CreateSetInput = z.infer<typeof createSetSchema>;
