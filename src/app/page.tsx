import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Projects from "@/components/Projects";
import Footprint from "@/components/Footprint";
import TornEdge from "@/components/TornEdge";
import { getContributions } from "@/lib/contributions";

export const revalidate = 3600;

export default async function Home() {
  const contributions = await getContributions();
  return (
    <main className="bg-ink">
      <Hero />
      <Marquee />
      <TornEdge fill="#f4f1ea" underFill="#7a0e12" />
      <Projects />
      <TornEdge fill="#0a0a09" bg="#e8e4da" />
      <Footprint
        days={contributions.days}
        total={contributions.total}
        live={contributions.live}
      />
    </main>
  );
}
