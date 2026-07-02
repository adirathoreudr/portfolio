import { NextResponse } from "next/server";
import { SPOTIFY_SCOPES } from "@/lib/spotify";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (process.env.SPOTIFY_REFRESH_TOKEN) {
    return new NextResponse("Spotify is already connected.", { status: 410 });
  }
  const id = process.env.SPOTIFY_CLIENT_ID;
  if (!id) {
    return new NextResponse(
      "Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first.",
      { status: 428 }
    );
  }
  const origin = new URL(request.url).origin;
  const params = new URLSearchParams({
    client_id: id,
    response_type: "code",
    redirect_uri: `${origin}/api/spotify/callback`,
    scope: SPOTIFY_SCOPES,
    show_dialog: "true",
  });
  return NextResponse.redirect(
    `https://accounts.spotify.com/authorize?${params}`
  );
}
