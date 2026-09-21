"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useRef } from "react";

export default function HouseHero() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "45%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[92svh] overflow-hidden bg-black text-white"
    >
      {/* Background image */}
      <motion.div
        style={{ y: imageY }}
        className="absolute inset-[-10%]"
      >
        <Image
          src="/images/house/house-hero.jpg"
          alt="The Rook & Reed House"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Atmospheric video */}
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-55 mix-blend-screen"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/videos/hero/house.mp4" type="video/mp4" />
      </video>

      {/* Cinematic treatment */}
      <div className="absolute inset-0 bg-black/45" />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/30" />

      {/* Architectural lines */}
      <div className="absolute left-[12%] top-0 h-full w-px bg-white/10" />
      <div className="absolute right-[12%] top-0 h-full w-px bg-white/10" />

      <motion.div
        style={{ opacity: titleOpacity }}
        className="rr-container relative flex min-h-[92svh] items-end pb-16 pt-32 sm:pb-20 lg:pb-28"
      >
        <div className="w-full">
          <div className="mb-10 flex items-center justify-between">
            <span className="rr-kicker text-white/65">
              THE ROOK & REED HOUSE
            </span>

            <span className="hidden font-mono text-xs text-white/45 sm:block">
              01 / 07
            </span>
          </div>

          <motion.div style={{ y: titleY }}>
            <h1 className="rr-editorial max-w-6xl text-[18vw] leading-[0.78] tracking-[-0.06em] sm:text-[13vw] lg:text-[11vw]">
              THE
              <br />
              <em>HOUSE.</em>
            </h1>
          </motion.div>

          <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-md text-sm leading-7 text-white/65 sm:text-base">
              Juice, jazz, books, chess and conversation — brought together
              under one roof.
            </p>

            <Link
              href="#inside"
              className="group flex w-fit items-center gap-3 text-xs uppercase tracking-[0.18em]"
            >
              Enter the House
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 transition-all duration-300 group-hover:bg-white group-hover:text-black">
                <ArrowDown size={15} />
              </span>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}