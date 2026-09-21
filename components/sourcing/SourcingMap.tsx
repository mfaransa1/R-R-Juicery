"use client";

import Image from "next/image";
import { MapPin, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

export default function SourcingMap() {
  return (
    <section className="bg-[#f5f1e8]">
      <div className="rr-container py-24 sm:py-32 lg:py-40">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
          <div>
            <span className="rr-kicker">
              WHERE IT COMES FROM
            </span>

            <h2 className="rr-editorial mt-5 text-5xl leading-[0.84] sm:text-7xl">
              The map
              <br />
              <em>behind the menu.</em>
            </h2>

            <p className="mt-8 max-w-md text-sm leading-8 text-black/50">
              Our sourcing map will show verified ingredient origins and
              supplier relationships as this information is established.
            </p>

            <div className="mt-10 flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-black/40">
              <MapPin size={15} strokeWidth={1.2} />
              Location data / REQUIRED INPUT
            </div>
          </div>

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.97,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
            }}
            className="relative aspect-[4/3] overflow-hidden bg-[#cfc8ba]"
          >
            <Image
              src="/images/sourcing/sourcing-map.jpg"
              alt="Rook & Reed sourcing map"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black/10" />

            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <div className="bg-white/85 px-4 py-3 backdrop-blur-sm">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em]">
                  SOURCING MAP
                </p>

                <p className="mt-1 text-xs text-black/45">
                  Data to be populated
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white">
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.2}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}