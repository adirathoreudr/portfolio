export type SpotifyTrack = {
  title: string;
  artist: string;
  album: string;
  art: string;
  url: string;
};

export type SpotifyAlbum = {
  name: string;
  artist: string;
  art: string;
  url: string;
  plays?: number;
};

export type SpotifyPayload = {
  configured: boolean;
  isPlaying: boolean;
  nowPlaying: SpotifyTrack | null;
  recents: SpotifyTrack[];
  onRepeat: SpotifyTrack[];
  favAlbums: SpotifyAlbum[];
};

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API = "https://api.spotify.com/v1";

export const SPOTIFY_SCOPES =
  "user-read-currently-playing user-read-recently-played user-top-read";

function art(seed: string, fg: string, bg: string) {
  const letter = seed.slice(0, 2).toUpperCase();
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'><rect width='80' height='80' fill='${bg}'/><circle cx='40' cy='40' r='26' fill='none' stroke='${fg}' stroke-width='1.5' opacity='0.5'/><text x='40' y='47' font-family='Georgia,serif' font-size='22' font-style='italic' fill='${fg}' text-anchor='middle'>${letter}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function mockPayload(): SpotifyPayload {
  const t = (title: string, artist: string, album: string, fg: string, bg: string): SpotifyTrack => ({
    title,
    artist,
    album,
    art: art(title, fg, bg),
    url: "https://open.spotify.com",
  });
  return {
    configured: true,
    isPlaying: true,
    nowPlaying: t("The Night We Met", "Lord Huron", "Strange Trails", "#f4f1ea", "#7a0e12"),
    recents: [
      t("The Night We Met", "Lord Huron", "Strange Trails", "#f4f1ea", "#7a0e12"),
      t("Karma Police", "Radiohead", "OK Computer", "#0a0a09", "#e8e4da"),
      t("The Man Who Sold the World", "Nirvana", "MTV Unplugged", "#f4f1ea", "#3a3936"),
      t("Piano Man", "Billy Joel", "Piano Man", "#7a0e12", "#f4f1ea"),
      t("Black Hole Sun", "Soundgarden", "Superunknown", "#f4f1ea", "#0a0a09"),
    ],
    onRepeat: [
      t("Nayaab", "Seedhe Maut", "Nayaab", "#f4f1ea", "#b1121b"),
      t("101", "Seedhe Maut", "Lunch Break", "#0a0a09", "#e8e4da"),
      t("City of Stars", "Justin Hurwitz", "La La Land", "#f4f1ea", "#3a3936"),
      t("Kshama", "Seedhe Maut", "Kshama", "#7a0e12", "#f4f1ea"),
      t("Everlong", "Foo Fighters", "The Colour and the Shape", "#f4f1ea", "#0a0a09"),
    ],
    favAlbums: [
      { name: "Nayaab", artist: "Seedhe Maut", art: art("Na", "#f4f1ea", "#7a0e12"), url: "https://open.spotify.com", plays: 1128 },
      { name: "Lunch Break", artist: "Seedhe Maut", art: art("Lb", "#0a0a09", "#e8e4da"), url: "https://open.spotify.com", plays: 1100 },
      { name: "La La Land (OST)", artist: "Justin Hurwitz", art: art("Ll", "#f4f1ea", "#3a3936"), url: "https://open.spotify.com", plays: 746 },
      { name: "Kshama", artist: "Seedhe Maut", art: art("Ks", "#7a0e12", "#f4f1ea"), url: "https://open.spotify.com", plays: 491 },
    ],
  };
}

async function getAccessToken(): Promise<string | null> {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!id || !secret || !refresh) return null;
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh,
    }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token ?? null;
}

type RawTrack = {
  name: string;
  external_urls?: { spotify?: string };
  artists?: { name: string }[];
  album?: {
    name: string;
    images?: { url: string }[];
    external_urls?: { spotify?: string };
    artists?: { name: string }[];
  };
};

function toTrack(item: RawTrack): SpotifyTrack {
  return {
    title: item.name,
    artist: (item.artists ?? []).map((a) => a.name).join(", "),
    album: item.album?.name ?? "",
    art: item.album?.images?.[1]?.url ?? item.album?.images?.[0]?.url ?? "",
    url: item.external_urls?.spotify ?? "https://open.spotify.com",
  };
}

async function sGet(token: string, path: string, revalidate?: number) {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    ...(revalidate ? { next: { revalidate } } : { cache: "no-store" as const }),
  });
  if (res.status === 204) return null;
  if (!res.ok) return null;
  return res.json();
}

export async function getSpotifyPayload(): Promise<SpotifyPayload> {
  if (process.env.SPOTIFY_MOCK === "1") return mockPayload();

  const empty: SpotifyPayload = {
    configured: false,
    isPlaying: false,
    nowPlaying: null,
    recents: [],
    onRepeat: [],
    favAlbums: [],
  };

  try {
    const token = await getAccessToken();
    if (!token) return empty;

    const [current, recent, short, medium] = await Promise.all([
      sGet(token, "/me/player/currently-playing"),
      sGet(token, "/me/player/recently-played?limit=12", 120),
      sGet(token, "/me/top/tracks?time_range=short_term&limit=10", 300),
      sGet(token, "/me/top/tracks?time_range=medium_term&limit=50", 3600),
    ]);

    const recents: SpotifyTrack[] = [];
    const seen = new Set<string>();
    for (const it of recent?.items ?? []) {
      const t = toTrack(it.track);
      const key = `${t.title}·${t.artist}`;
      if (seen.has(key)) continue;
      seen.add(key);
      recents.push(t);
      if (recents.length >= 5) break;
    }

    const onRepeat: SpotifyTrack[] = (short?.items ?? [])
      .slice(0, 5)
      .map((it: RawTrack) => toTrack(it));

    const albumCount = new Map<string, { album: SpotifyAlbum; n: number }>();
    for (const it of medium?.items ?? []) {
      const al = (it as RawTrack).album;
      if (!al?.name) continue;
      const key = al.name;
      const entry = albumCount.get(key) ?? {
        album: {
          name: al.name,
          artist: (al.artists ?? []).map((a) => a.name).join(", "),
          art: al.images?.[1]?.url ?? al.images?.[0]?.url ?? "",
          url: al.external_urls?.spotify ?? "https://open.spotify.com",
        },
        n: 0,
      };
      entry.n += 1;
      albumCount.set(key, entry);
    }
    const favAlbums = [...albumCount.values()]
      .sort((a, b) => b.n - a.n)
      .slice(0, 4)
      .map((e) => e.album);

    const playingItem = current?.item ? toTrack(current.item) : null;
    return {
      configured: true,
      isPlaying: Boolean(current?.is_playing && playingItem),
      nowPlaying: playingItem ?? recents[0] ?? null,
      recents,
      onRepeat,
      favAlbums,
    };
  } catch {
    return empty;
  }
}
