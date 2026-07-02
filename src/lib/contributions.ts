export type ContributionDay = {
  date: string;
  count: number;
  level: number;
};

const WEEKS = 52;
const DAYS = WEEKS * 7;

function fallbackDays(): ContributionDay[] {
  let s = 42;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  const days: ContributionDay[] = [];
  const now = new Date();
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const weekday = d.getDay();
    const heat = weekday === 0 || weekday === 6 ? 0.35 : 0.75;
    const r = rand() * heat + Math.sin(i / 9) * 0.18;
    const level = r > 0.72 ? 4 : r > 0.55 ? 3 : r > 0.38 ? 2 : r > 0.22 ? 1 : 0;
    days.push({
      date: d.toISOString().slice(0, 10),
      count: level * 3,
      level,
    });
  }
  return days;
}

export async function getContributions(): Promise<{
  days: ContributionDay[];
  total: number;
  live: boolean;
}> {
  try {
    const res = await fetch(
      "https://github-contributions-api.jogruber.de/v4/adirathoreudr?y=last",
      { next: { revalidate: 3600 }, signal: AbortSignal.timeout(6000) }
    );
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    const data: { contributions: ContributionDay[] } = await res.json();
    const days = data.contributions.slice(-DAYS);
    if (days.length < 7) throw new Error("empty payload");
    return {
      days,
      total: days.reduce((n, d) => n + d.count, 0),
      live: true,
    };
  } catch {
    const days = fallbackDays();
    return { days, total: days.reduce((n, d) => n + d.count, 0), live: false };
  }
}
