import { NextResponse } from "next/server";
import { getSpotifyPayload } from "@/lib/spotify";

export const dynamic = "force-dynamic";

export async function GET() {
  const payload = await getSpotifyPayload();
  return NextResponse.json(payload, {
    headers: { "Cache-Control": "no-store" },
  });
}
