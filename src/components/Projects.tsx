"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { projects, type Project } from "@/data/projects";

const accentStyles = {
  crimson: {
    panel: "bg-blood text-paper",
    numeral: "text-ink/15",
    tagline: "text-paper/80",
  },
  paper: {
    panel: "bg-paper text-ink",
    numeral: "text-crimson/15",
    tagline: "text-ink/70",
  },
  ink: {
    panel: "bg-ink text-paper border border-smoke",
    numeral: "text-crimson/25",
    tagline: "text-paper/70",
  },
} as const;

function useCanHover() {
  const [canHover, setCanHover] = useState(false);
  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover)").matches);
  }, []);
  return canHover;
}

function TiltPanel({ project }: { project: Project }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const canHover = useCanHover();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [8, -8]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-10, 10]), {
    stiffness: 150,
    damping: 20,
  });

  const s = accentStyles[project.accent];

  return (
    <div style={{ perspective: 1200 }}>
      <motion.a
        ref={ref}
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.name} on GitHub`}
        style={canHover ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
        onPointerMove={(e) => {
          if (!canHover || !ref.current) return;
          const r = ref.current.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        whileTap={{ scale: 0.98 }}
        className={`grain relative flex aspect-[4/3] flex-col justify-between overflow-hidden p-6 sm:p-10 ${s.panel}`}
      >
        <div
          aria-hidden
          className={`pointer-events-none absolute -bottom-16 -right-4 select-none font-masthead text-[16rem] leading-none sm:text-[24rem] ${s.numeral}`}
        >
          {project.index}
        </div>
        <div className="flex items-start justify-between text-[10px] font-bold uppercase tracking-[0.3em] sm:text-xs">
          <span>{project.category}</span>
          <span>{project.year}</span>
        </div>
        <div className="relative">
          <h3 className="font-masthead text-[clamp(2.8rem,7.5vw,7rem)] leading-[0.85]">
            {project.name}
          </h3>
          <p className={`mt-4 max-w-md font-serif text-base italic sm:text-xl ${s.tagline}`}>
            {project.tagline}
          </p>
        </div>
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.3em] sm:text-xs">
          <span>View the case file</span>
          <span aria-hidden>→</span>
        </div>
      </motion.a>
    </div>
  );
}

function Spread({ project, i }: { project: Project; i: number }) {
  const flipped = i % 2 === 1;
  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12"
    >
      <div className={`lg:col-span-7 ${flipped ? "lg:order-2" : ""}`}>
        <TiltPanel project={project} />
      </div>

      <div className={`lg:col-span-5 ${flipped ? "lg:order-1" : ""}`}>
        <div className="flex items-baseline gap-4 border-b-2 border-paper/20 pb-3">
          <span className="font-serif text-2xl italic text-crimson">
            No. {project.index}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-ash">
            {project.category}
          </span>
        </div>

        <p className="mt-6 font-serif text-xl italic leading-snug text-paper sm:text-2xl">
          {project.description}
        </p>

        <ul className="mt-8 space-y-4">
          {project.bullets.map((b, j) => (
            <li key={j} className="flex gap-4 border-t border-paper/15 pt-4">
              <span className="font-serif text-sm italic text-crimson">
                0{j + 1}
              </span>
              <p className="text-sm leading-relaxed text-paper/75">{b}</p>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-2">
          {project.stack.map((t) => (
            <span
              key={t}
              className="border border-paper/25 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/80"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-8 flex gap-6 text-xs font-bold uppercase tracking-[0.25em]">
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b-2 border-crimson pb-1 text-paper transition-colors hover:text-crimson"
          >
            Source
          </a>
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b-2 border-paper/30 pb-1 text-paper/70 transition-colors hover:text-crimson"
            >
              Live
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  return (
    <section id="works" className="relative bg-ink px-5 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-[1600px]">
        <motion.header
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 sm:mb-24"
        >
          <div className="flex items-baseline justify-between text-[10px] font-bold uppercase tracking-[0.3em] text-ash sm:text-xs">
            <span>Section II</span>
            <span>Four exhibits, admitted into evidence</span>
          </div>
          <h2 className="font-masthead mt-4 text-[clamp(3.5rem,12vw,11rem)] leading-[0.85] text-paper">
            THE <span className="text-outline">FEATURES</span>
          </h2>
        </motion.header>

        <div className="space-y-24 sm:space-y-36">
          {projects.map((p, i) => (
            <Spread key={p.name} project={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
