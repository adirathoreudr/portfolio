import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Projects from "@/components/Projects";
import TornEdge from "@/components/TornEdge";

export default function Home() {
  return (
    <main className="bg-ink">
      <Hero />
      <Marquee />
      <TornEdge fill="#f4f1ea" underFill="#7a0e12" />
      <Projects />
    </main>
  );
}
