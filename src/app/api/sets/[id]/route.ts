import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { getSetById } from "@/lib/sets-service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid set id." }, { status: 400 });
  }

  const set = await getSetById(id);

  if (!set) {
    return NextResponse.json({ error: "Set not found." }, { status: 404 });
  }

  return NextResponse.json({ set });
}
