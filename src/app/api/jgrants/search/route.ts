import { NextRequest, NextResponse } from "next/server";
import { searchSubsidies } from "@/lib/jgrants";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword") ?? "補助金";
  const acceptance = searchParams.get("acceptance") as "1" | "2" | null;
  const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;

  try {
    const results = await searchSubsidies(keyword, {
      acceptance: acceptance ?? undefined,
      limit,
    });
    return NextResponse.json(results);
  } catch (err) {
    console.error("JGrants search error:", err);
    return NextResponse.json([], { status: 502 });
  }
}
