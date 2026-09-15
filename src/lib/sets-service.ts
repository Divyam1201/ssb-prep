import { connectToDatabase } from "@/lib/db";
import { PracticeSetModel, toPracticeSet, type PracticeSetDocument } from "@/models/practice-set";
import { isSetComplete } from "@/lib/modules";
import type { CreateSetInput } from "@/lib/validation";
import type { ModuleId, PracticeSet } from "@/lib/types";

export async function listSets(moduleId: ModuleId): Promise<PracticeSet[]> {
  await connectToDatabase();
  const docs = (await PracticeSetModel.find({ moduleId }).sort({
    createdAt: -1,
  })) as PracticeSetDocument[];
  return docs.map(toPracticeSet);
}

export async function getSetById(id: string): Promise<PracticeSet | null> {
  await connectToDatabase();
  const doc = (await PracticeSetModel.findById(id)) as PracticeSetDocument | null;
  return doc ? toPracticeSet(doc) : null;
}

export async function createSet(input: CreateSetInput): Promise<PracticeSet> {
  await connectToDatabase();
  const doc = await PracticeSetModel.create({
    ...input,
    isComplete: isSetComplete(input.moduleId, input.items.length),
  });
  return toPracticeSet(doc);
}
