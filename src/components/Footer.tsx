"use client";

import { motion } from "framer-motion";
import { links } from "@/data/links";

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
};

const channels = [
  { k: "01", label: "Email", value: "adirathoreudr@gmail.com", href: `mailto:${links.email}` },
  { k: "02", label: "GitHub", value: "@adirathoreudr", href: links.github },
  { k: "03", label: "LinkedIn", value: "in/adityarathoreudr", href: links.linkedin },
  { k: "04", label: "Twitter", value: "@adirathoreudr", href: links.twitter },
];

export default function Footer() {
  return (
    <footer
      id="epilogue"
      className="grain scroll-mt-14 relative overflow-hidden bg-blood px-5 pb-16 pt-24 text-paper sm:px-10 sm:pt-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-masthead text-[11.5vw] leading-none text-ink/10 sm:-bottom-8 sm:text-[13.5vw]"
      >
        TUTTO PASSA
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px]">
        <motion.header {...reveal}>
          <div className="flex items-baseline justify-between text-[10px] font-bold uppercase tracking-[0.3em] text-paper/60 sm:text-xs">
            <span>Section IV</span>
            <span>The epilogue</span>
          </div>
          <h2 className="font-masthead mt-4 text-[clamp(2.6rem,9vw,8rem)] leading-[0.85] text-ink">
            EVERY STORY
            <br />
            <span className="text-paper">NEEDS A SEQUEL.</span>
          </h2>
          <p className="mt-8 max-w-2xl font-serif text-xl italic leading-snug text-paper/85 sm:text-2xl">
            Yours could use a full-stack developer with a taste for quiet
            infrastructure and loud typography. Thirty minutes. No obligations.
            No spoilers.
          </p>
        </motion.header>

        <motion.div {...reveal} className="mt-12">
          <a
            href={links.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-baseline gap-2.5 border-2 border-ink bg-ink px-5 py-3 transition-colors duration-300 hover:bg-transparent sm:px-6 sm:py-3.5"
          >
            <span className="font-masthead text-lg text-paper transition-colors duration-300 group-hover:text-ink sm:text-xl">
              Book a 30-min call
            </span>
            <span
              aria-hidden
              className="font-serif text-sm italic text-crimson transition-transform duration-300 group-hover:translate-x-1 sm:text-base"
            >
              via Calendly →
            </span>
          </a>
        </motion.div>

        <motion.ul
          {...reveal}
          className="mt-20 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {channels.map((c) => (
            <li key={c.k} className="border-t-2 border-paper/25">
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col py-5"
              >
                <span className="flex items-baseline justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-paper/60">
                    {c.label}
                  </span>
                  <span className="font-serif text-sm italic text-ink">
                    {c.k}
                  </span>
                </span>
                <span className="mt-2 font-serif text-lg italic text-paper transition-colors group-hover:text-ink sm:text-xl">
                  {c.value}
                </span>
              </a>
            </li>
          ))}
        </motion.ul>

        <motion.div
          {...reveal}
          className="mt-24 flex flex-wrap items-end justify-between gap-6 border-t-2 border-ink pt-6"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-paper/70 sm:text-xs">
            © MMXXVI Aditya Rathore — The Developer Issue, № 001
          </p>
          <p className="max-w-xs text-right font-serif text-sm italic text-ink sm:text-base">
            Set in Playfair Display &amp; Inter. No Vogue magazines were
            harmed in the making of this portfolio.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
