"use client";

import { motion } from "framer-motion";
import { marqueeItems } from "@/data/skills";

function Track() {
  return (
    <div className="flex shrink-0 items-baseline">
      {marqueeItems.map((item, i) => (
        <span key={i} className="flex shrink-0 items-baseline whitespace-nowrap">
          <span
            className={
              item.featured
                ? "font-serif text-3xl font-black italic text-crimson sm:text-5xl"
                : "text-2xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl"
            }
          >
            {item.text}
          </span>
          <span aria-hidden className="mx-5 text-xl text-crimson sm:mx-8 sm:text-2xl">
            ✦
          </span>
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <section
      aria-label="Skills and certifications"
      className="relative overflow-hidden border-y-2 border-ink bg-paper py-5 sm:py-7"
    >
      <motion.div
        className="flex w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
      >
        <Track />
        <Track />
      </motion.div>
    </section>
  );
}
