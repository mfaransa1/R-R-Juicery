"use client";

import { motion } from "motion/react";

const standards = [
  {
    number: "01",
    title: "SOURCE",
    description:
      "Where the ingredient comes from should be identifiable when the information is available.",
  },
  {
    number: "02",
    title: "ORGANIC STATUS",
    description:
      "We distinguish between verified organic, supplier-claimed, conventional and unknown status.",
  },
  {
    number: "03",
    title: "PREPARATION",
    description:
      "Ingredients should have a clear preparation method before becoming part of a drink.",
  },
  {
    number: "04",
    title: "FRESHNESS",
    description:
      "Freshness information should describe how the drink is prepared and handled.",
  },
];

export default function SourcingStandards() {
  return (
    <section className="bg-[#ded8cd]">
      <div className="rr-container py-24 sm:py-32 lg:py-40">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <span className="rr-kicker">
              OUR STANDARD
            </span>

            <h2 className="rr-editorial mt-5 text-5xl leading-[0.84] sm:text-7xl lg:text-8xl">
              Make
              <br />
              information
              <br />
              <em>visible.</em>
            </h2>
          </div>

          <div className="border-t border-black/15">
            {standards.map((standard, index) => (
              <motion.div
                key={standard.number}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                }}
                className="grid gap-5 border-b border-black/15 py-8 sm:grid-cols-[60px_180px_1fr] sm:items-start"
              >
                <span className="font-mono text-[10px] text-black/35">
                  {standard.number}
                </span>

                <h3 className="text-xs tracking-[0.16em]">
                  {standard.title}
                </h3>

                <p className="max-w-lg text-sm leading-7 text-black/50">
                  {standard.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}