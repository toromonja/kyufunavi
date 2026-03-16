import { NextRequest, NextResponse } from "next/server";
import { searchSubsidies } from "@/lib/jgrants";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword") ?? "補助金";
  const acceptance = searchParams.get("acceptance") as "0" | "1" | null;
  const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;

  try {
    const results = await searchSubsidies(keyword, {
      acceptance: (acceptance as "0" | "1") ?? "0",
      limit,
    });
    return NextResponse.json(results, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" },
    });
  } catch (err) {
    console.error("JGrants search error:", err);
    return NextResponse.json([], { status: 502 });
  }
}
