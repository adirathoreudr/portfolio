"use client";

import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";

const navLinks = [
  { label: "About", target: "#top" },
  { label: "Work", target: "#works" },
  { label: "Stack", target: "#record" },
  { label: "Contact", target: "#epilogue" },
];

function useClock(timeZone: string) {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, [timeZone]);
  return time;
}

export default function Navbar() {
  const lenis = useLenis();
  const ist = useClock("Asia/Kolkata");
  const nyc = useClock("America/New_York");

  const go = (target: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (target === "#top") {
      if (lenis) lenis.scrollTo(0, { force: true });
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.querySelector(target);
    if (!el) return;
    const currentScroll = lenis ? lenis.scroll : window.scrollY;
    const top = el.getBoundingClientRect().top + currentScroll - 56;
    if (lenis) lenis.scrollTo(top, { force: true, duration: 1.3 });
    else window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-paper/10 bg-ink/70 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-5 sm:px-10">
        <a
          href="#top"
          onClick={go("#top")}
          className="flex shrink-0 items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-paper transition-opacity hover:opacity-70"
        >
          <span className="size-2 rounded-full bg-crimson" />
          AR<span className="text-crimson">.</span>dev
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.target}
              onClick={go(l.target)}
              className="font-mono text-[11px] uppercase tracking-[0.25em] text-paper/60 transition-colors hover:text-paper"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2.5 font-mono text-[10px] tracking-[0.2em] text-paper/60 sm:gap-3 sm:text-[11px]">
          <span>
            IST <span className="text-paper/85">{ist}</span>
          </span>
          <span className="text-paper/25">/</span>
          <span>
            EDT <span className="text-paper/85">{nyc}</span>
          </span>
          <span className="size-1.5 animate-pulse rounded-full bg-crimson" />
        </div>
      </nav>
    </header>
  );
}
