"use client";

import { motion } from "motion/react";
import { QrCode, ArrowRight } from "lucide-react";

export default function SourcingTraceability() {
  return (
    <section className="bg-black text-white">
      <div className="rr-container py-24 sm:py-32 lg:py-44">
        <div className="grid gap-14 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
              THE FUTURE OF R&R
            </span>

            <motion.h2
              initial={{
                opacity: 0,
                y: 30,
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
              }}
              className="rr-editorial mt-6 max-w-5xl text-6xl leading-[0.8] sm:text-8xl lg:text-[8rem]"
            >
              Every batch
              <br />
              <em>has a story.</em>
            </motion.h2>

            <p className="mt-9 max-w-xl text-sm leading-8 text-white/50 sm:text-base">
              The R&R system is designed to support future QR traceability:
              a batch ID can connect a drink to its production date,
              ingredients, source, preparation and storage information.
            </p>

            <div className="mt-10 flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-white/35">
              <ArrowRight size={15} strokeWidth={1.2} />
              Future traceability system
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="flex aspect-square w-60 items-center justify-center border border-white/15 sm:w-72">
              <div className="flex aspect-square w-36 items-center justify-center border border-white/15 sm:w-44">
                <QrCode
                  size={100}
                  strokeWidth={0.7}
                  className="text-white/65 sm:h-[125px] sm:w-[125px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}