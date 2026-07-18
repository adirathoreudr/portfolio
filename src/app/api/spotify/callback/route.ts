

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (process.env.SPOTIFY_REFRESH_TOKEN) {
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  }
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) {
    return new NextResponse(
      "Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first.",
      { status: 428 }
    );
  }
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return new NextResponse("Missing authorization code.", { status: 400 });
  }
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: `${url.origin}/api/spotify/callback`,
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    return new NextResponse(`Token exchange failed (${res.status}).`, {
      status: 502,
    });
  }
  const data = await res.json();
  const html = `<!doctype html><html><body style="background:#0a0a09;color:#f4f1ea;font-family:monospace;padding:48px;line-height:1.8">
<h1 style="color:#b1121b">Spotify connected — one last step</h1>
<p>Add this environment variable in Vercel (Project → Settings → Environment Variables), then redeploy:</p>
<p style="margin-top:24px;color:#8a8a86">SPOTIFY_REFRESH_TOKEN=</p>
<textarea readonly style="width:100%;height:120px;background:#1a1918;color:#f4f1ea;border:1px solid #3a3936;padding:12px;font-family:monospace">${data.refresh_token ?? "(no refresh token returned — retry /api/spotify/login)"}</textarea>
<p style="color:#8a8a86;margin-top:24px">This page never stores the token. Once the variable is set, this route disables itself.</p>
</body></html>`;
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html", "Cache-Control": "no-store" },
  });
}
