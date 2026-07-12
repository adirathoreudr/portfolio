"use client";

import { motion } from "framer-motion";

const strengths = [
  {
    k: "01",
    t: "Full-stack systems, built end to end",
    d: "Frontend to database, API to edge — every layer written, wired, and shipped by the same hand.",
  },
  {
    k: "02",
    t: "Protocols that keep their promises",
    d: "Smart contracts and on-chain systems — trustless by design, verifiable by anyone.",
  },
  {
    k: "03",
    t: "Infrastructure that runs while the city sleeps",
    d: "CI/CD, containers, cloud — deployment as a quiet, repeatable ritual.",
  },
];

const line = {
  hidden: { y: "110%" },
  show: (i: number) => ({
    y: 0,
    transition: { duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.7 + i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

function MastheadLine({
  text,
  className,
  index,
}: {
  text: string;
  className: string;
  index: number;
}) {
  return (
    <div className="overflow-hidden">
      <motion.div
        custom={index}
        variants={line}
        initial="hidden"
        animate="show"
        className={`font-masthead flex w-full justify-between leading-[0.82] ${className}`}
      >
        {text.split("").map((ch, i) => (
          <span key={i}>{ch}</span>
        ))}
      </motion.div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="grain relative min-h-svh overflow-hidden bg-blood text-paper">
      <div className="pointer-events-none absolute -right-24 top-1/3 select-none font-masthead text-[28rem] leading-none text-ink/10 max-lg:hidden">
        №1
      </div>

      <div className="relative z-10 mx-auto flex min-h-svh max-w-[1600px] flex-col px-5 pb-8 pt-[4.5rem] sm:px-10 sm:pt-20">
        <motion.header
          custom={0}
          variants={fade}
          initial="hidden"
          animate="show"
          className="flex items-baseline justify-between border-b border-paper/30 pb-4 text-[10px] font-semibold uppercase tracking-[0.3em] sm:text-xs"
        >
          <span>The Developer Issue</span>
          <span className="max-sm:hidden">Est. MMXXVI</span>
          <span className="font-serif text-sm normal-case italic tracking-normal">
            № 001
          </span>
        </motion.header>

        <div className="mt-6 sm:mt-8">
          <MastheadLine
            text="ADITYA"
            className="text-ink text-[clamp(3.4rem,13vw,11.5rem)]"
            index={0}
          />
          <MastheadLine
            text="RATHORE"
            className="text-paper text-[clamp(2.9rem,11.2vw,10rem)]"
            index={1}
          />
        </div>

        <motion.div
          custom={1}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-y-2 border-ink py-3 text-[11px] font-bold uppercase tracking-[0.25em] text-ink sm:text-sm"
        >
          <span>Full Stack Developer</span>
          <span aria-hidden className="text-paper">✦</span>
          <span>Web3 Developer</span>
          <span aria-hidden className="text-paper">✦</span>
          <span>DevOps Engineer</span>
        </motion.div>

        <div className="mt-8 grid flex-1 gap-8 md:grid-cols-[1.1fr_1fr] lg:mt-10">
          <motion.p
            custom={2}
            variants={fade}
            initial="hidden"
            animate="show"
            className="max-w-xl font-serif text-xl italic leading-snug sm:text-2xl lg:text-3xl"
          >
            Building full-stack systems, trustless protocols, and
            infrastructure that never asks for credit&nbsp;—{" "}
            <span className="text-ink">
              the kind of work you only notice when it isn&apos;t there.
            </span>
          </motion.p>

          <ul className="space-y-0 self-end">
            {strengths.map((s, i) => (
              <motion.li
                key={s.k}
                custom={3 + i}
                variants={fade}
                initial="hidden"
                animate="show"
                className="border-t border-paper/25 py-3 first:border-t-0"
              >
                <div className="flex gap-4">
                  <span className="font-serif text-sm italic text-ink">
                    {s.k}
                  </span>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider">
                      {s.t}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-paper/70">
                      {s.d}
                    </p>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.footer
          custom={8}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-6 flex items-end justify-end sm:mt-8"
        >
          <p className="mr-14 max-w-[240px] text-right font-serif text-sm italic leading-snug text-ink sm:mr-24 sm:max-w-xs sm:text-base">
            &ldquo;The first rule of good infrastructure&nbsp;— it never
            speaks of itself.&rdquo;
          </p>
        </motion.footer>
      </div>
    </section>
  );
}
