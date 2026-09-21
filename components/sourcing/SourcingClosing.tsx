"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function SourcingClosing() {
  return (
    <section className="bg-[#f5f1e8]">
      <div className="rr-container py-24 sm:py-32 lg:py-44">
        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <span className="rr-kicker">
              KEEP EXPLORING
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
              className="rr-editorial mt-6 max-w-5xl text-6xl leading-[0.8] sm:text-8xl lg:text-[9rem]"
            >
              Know the
              <br />
              <em>story.</em>
            </motion.h2>
          </div>

          <Link
            href="/story"
            className="group inline-flex w-fit items-center gap-5 border-b border-black/25 pb-4 text-[10px] uppercase tracking-[0.2em] transition-colors hover:border-black"
          >
            Discover R&R

            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/20 transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight
                size={15}
                strokeWidth={1.2}
              />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}