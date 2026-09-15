import { NextRequest, NextResponse } from "next/server";
import { listSets, createSet } from "@/lib/sets-service";
import { MODULE_CONFIG } from "@/lib/modules";
import { createSetSchema } from "@/lib/validation";
import type { ModuleId } from "@/lib/types";

const VALID_MODULE_IDS = new Set(Object.keys(MODULE_CONFIG));

function isModuleId(value: string): value is ModuleId {
  return VALID_MODULE_IDS.has(value);
}

/** GET /api/sets?moduleId=wat — lists every shared set for one module,
 *  newest first, so the "browse existing sets" screen has something to show. */
export async function GET(request: NextRequest) {
  const moduleId = request.nextUrl.searchParams.get("moduleId");

  if (!moduleId || !isModuleId(moduleId)) {
    return NextResponse.json(
      { error: `moduleId must be one of: ${[...VALID_MODULE_IDS].join(", ")}` },
      { status: 400 }
    );
  }

  const sets = await listSets(moduleId);
  return NextResponse.json({ sets });
}

/** POST /api/sets — saves a new shared set. Expects items to already be
 *  AI-extracted (and, for Lecturette, difficulty-tagged) by the caller —
 *  this route only validates shape and the module's max-item cap. */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = createSetSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 }
    );
  }

  const { moduleId, items } = parsed.data;
  const maxItems = MODULE_CONFIG[moduleId].maxItems;

  if (maxItems !== undefined && items.length > maxItems) {
    return NextResponse.json(
      { error: `${MODULE_CONFIG[moduleId].label} sets can have at most ${maxItems} items.` },
      { status: 400 }
    );
  }

  const set = await createSet(parsed.data);
  return NextResponse.json({ set }, { status: 201 });
}
