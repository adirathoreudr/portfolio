"use client";

import { motion } from "framer-motion";
import type { ContributionDay } from "@/lib/contributions";
import { stack, currently } from "@/data/skills";

const cellColors = [
  "bg-ink/8",
  "bg-crimson/25",
  "bg-crimson/55",
  "bg-crimson",
  "bg-ink",
];

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
};

function CommitGarden({
  days,
  total,
  live,
}: {
  days: ContributionDay[];
  total: number;
  live: boolean;
}) {
  const weeks: ContributionDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return (
    <motion.div {...reveal}>
      <div className="flex items-baseline justify-between border-b-2 border-ink pb-3">
        <h3 className="font-serif text-2xl italic sm:text-3xl">
          The Commit Garden
        </h3>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-smoke sm:text-xs">
          {total} contributions · one year · {live ? "live record" : "reconstructed from memory"}
        </p>
      </div>
      <div className="mt-8 overflow-x-auto pb-2">
        <div className="flex w-max gap-[3px] sm:gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px] sm:gap-1">
              {week.map((day) => (
                <div
                  key={day.date}
                  title={`${day.date} — ${day.count} contributions`}
                  className={`size-3 sm:size-4 ${cellColors[Math.min(day.level, 4)]}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-smoke">
        <span>Less</span>
        {cellColors.map((c) => (
          <span key={c} className={`size-3 ${c}`} />
        ))}
        <span>More</span>
      </div>
    </motion.div>
  );
}

function Skills() {
  return (
    <motion.div {...reveal} className="mt-20 sm:mt-28">
      <div className="flex items-baseline justify-between border-b-2 border-ink pb-3">
        <h3 className="font-serif text-2xl italic sm:text-3xl">The Arsenal</h3>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-smoke sm:text-xs">
          Tools of the trade
        </p>
      </div>
      <div className="mt-8 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {stack.map((g) => (
          <div key={g.group}>
            <p className="font-serif text-sm italic text-crimson">{g.group}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {g.items.map((item) => (
                <span
                  key={item}
                  className="border border-ink/25 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/80 transition-colors hover:border-crimson hover:text-crimson"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function Currently() {
  return (
    <motion.div {...reveal} className="mt-20 sm:mt-28">
      <div className="flex items-baseline justify-between border-b-2 border-ink pb-3">
        <h3 className="font-serif text-2xl italic sm:text-3xl">
          {currently.title}
        </h3>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-smoke sm:text-xs">
          Dispatch
        </p>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <p className="font-serif text-xl italic leading-relaxed text-ink first-letter:float-left first-letter:mr-3 first-letter:font-masthead first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-crimson sm:text-2xl">
          {currently.paragraphs[0]}
        </p>
        <div>
          <p className="font-serif text-xl italic leading-relaxed text-ink/80 sm:text-2xl">
            {currently.paragraphs[1]}
          </p>
          <p className="mt-6 inline-block border-2 border-ink px-4 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-ink sm:text-xs">
            {currently.status}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Footprint({
  days,
  total,
  live,
}: {
  days: ContributionDay[];
  total: number;
  live: boolean;
}) {
  return (
    <section
      id="record"
      className="grain relative bg-bone px-5 py-24 text-ink sm:px-10 sm:py-32"
    >
      <div className="mx-auto max-w-[1600px]">
        <motion.header {...reveal} className="mb-16 sm:mb-20">
          <div className="flex items-baseline justify-between text-[10px] font-bold uppercase tracking-[0.3em] text-smoke sm:text-xs">
            <span>Section III</span>
            <span>Proof of work, in both senses</span>
          </div>
          <h2 className="font-masthead mt-4 text-[clamp(3.5rem,12vw,11rem)] leading-[0.85] text-ink">
            THE <span className="text-outline-ink">RECORD</span>
          </h2>
        </motion.header>

        <CommitGarden days={days} total={total} live={live} />
        <Skills />
        <Currently />
      </div>
    </section>
  );
}
