"use client";

import { motion } from "motion/react";

const principles = [
  "Come for the juice.",
  "Stay for the music.",
  "Read something.",
  "Play a game.",
  "Meet someone.",
  "Take your time.",
];

export default function HouseManifesto() {
  return (
    <section className="overflow-hidden bg-[var(--rr-brass)] text-black">
      <div className="rr-container py-24 sm:py-32 lg:py-44">
        <div className="grid gap-16 lg:grid-cols-[0.6fr_1.4fr]">
          <div>
            <span className="rr-kicker">THE RHYTHM</span>

            <p className="mt-6 max-w-xs text-sm leading-7 text-black/60">
              There is no single way to experience the House.
            </p>
          </div>

          <div>
            {principles.map((principle, index) => (
              <motion.div
                key={principle}
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.07,
                }}
                className="group flex items-center justify-between border-b border-black/20 py-5 sm:py-7"
              >
                <span className="rr-editorial text-4xl leading-none sm:text-6xl">
                  {principle}
                </span>

                <span className="font-mono text-xs text-black/35 transition-transform duration-300 group-hover:translate-x-2">
                  0{index + 1}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}