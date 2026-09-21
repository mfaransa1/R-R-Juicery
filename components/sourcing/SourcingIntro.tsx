"use client";

import { motion } from "motion/react";

export default function SourcingIntro() {
  return (
    <section className="bg-[#f5f1e8]">
      <div className="rr-container py-24 sm:py-32 lg:py-44">
        <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <span className="rr-kicker">
              WHY SOURCING MATTERS
            </span>
          </div>

          <div>
            <motion.h2
              initial={{
                opacity: 0,
                y: 35,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.3,
              }}
              transition={{
                duration: 0.7,
              }}
              className="rr-editorial max-w-5xl text-5xl leading-[0.88] sm:text-7xl lg:text-8xl"
            >
              The juice begins
              <br />
              <em>long before the pour.</em>
            </motion.h2>

            <motion.p
              initial={{
                opacity: 0,
                y: 25,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.7,
                delay: 0.12,
              }}
              className="mt-10 max-w-2xl text-sm leading-8 text-black/55 sm:text-base"
            >
              Ingredients have a journey before they become part of a
              Rook & Reed drink. Our sourcing system is designed to make
              that journey visible and easier to understand.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}