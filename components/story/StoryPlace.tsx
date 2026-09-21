"use client";

import Image from "next/image";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function StoryPlace() {
  return (
    <section className="bg-[#ded8cd]">
      <div className="rr-container py-24 sm:py-32 lg:py-40">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <span className="rr-kicker">THE PLACE</span>

            <h2 className="rr-editorial mt-5 max-w-4xl text-5xl leading-[0.84] sm:text-7xl lg:text-8xl">
              Made for
              <br />
              <em>staying.</em>
            </h2>

            <p className="mt-9 max-w-xl text-sm leading-8 text-black/55 sm:text-base">
              Rook & Reed is designed as more than a stop for a drink.
              It is a place to sit, listen, read, play, talk and spend
              time.
            </p>

            <Link
              href="/house"
              className="group mt-10 inline-flex items-center gap-4 border-b border-black/20 pb-4 text-[10px] uppercase tracking-[0.18em]"
            >
              Explore The House

              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-black/15 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                <ArrowUpRight
                  size={14}
                  strokeWidth={1.2}
                />
              </span>
            </Link>
          </div>

          <motion.div
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
              duration: 0.8,
            }}
            className="relative aspect-[4/5] overflow-hidden"
          >
            <Image
              src="/images/story/kilimani-life.jpg"
              alt="Rook & Reed in Kilimani"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover transition-transform duration-1000 hover:scale-105"
            />

            <div className="absolute bottom-5 left-5 bg-black/75 px-4 py-3 text-white backdrop-blur-sm">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em]">
                KILIMANI / NAIROBI
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}