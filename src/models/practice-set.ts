import { Schema, model, models, type InferSchemaType, type HydratedDocument } from "mongoose";
import type { ModuleId, PracticeSet, DifficultyTier } from "@/lib/types";

const MODULE_IDS: ModuleId[] = ["tat", "wat", "srt", "lecturette"];
const DIFFICULTY_TIERS: DifficultyTier[] = ["veasy", "easy", "moderate", "high"];

const setItemSchema = new Schema(
  {
    content: { type: String, required: true },
    tier: { type: String, enum: DIFFICULTY_TIERS, required: false },
  },
  { _id: true }
);

const practiceSetSchema = new Schema(
  {
    moduleId: { type: String, enum: MODULE_IDS, required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    items: { type: [setItemSchema], required: true, validate: (v: unknown[]) => v.length > 0 },
    isComplete: { type: Boolean, required: true, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export type PracticeSetDocument = HydratedDocument<InferSchemaType<typeof practiceSetSchema>>;

// `models.PracticeSet` check avoids Next.js's hot-reload recompiling the
// model (and throwing "OverwriteModelError") on every file change in dev.
export const PracticeSetModel =
  models.PracticeSet ?? model("PracticeSet", practiceSetSchema);

/** Converts a Mongoose document into the plain `PracticeSet` shape the rest
 *  of the app (client components, API responses) works with. */
export function toPracticeSet(doc: PracticeSetDocument): PracticeSet {
  return {
    id: doc._id.toString(),
    moduleId: doc.moduleId as ModuleId,
    name: doc.name,
    items: doc.items.map((item) => ({
      id: item._id!.toString(),
      content: item.content,
      tier: item.tier as DifficultyTier | undefined,
    })),
    isComplete: doc.isComplete,
    createdAt: doc.createdAt!.toISOString(),
  };
}
