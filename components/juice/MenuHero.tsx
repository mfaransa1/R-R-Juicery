"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";

export default function MenuHero() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1.08, 1]
  );

  const titleY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "35%"]
  );

  return (
    <section
      ref={ref}
      className="relative min-h-[82svh] overflow-hidden bg-black text-white"
    >
      <motion.div
        style={{ scale: imageScale }}
        className="absolute inset-0"
      >
        <Image
          src="/images/products/menu-hero.jpg"
          alt="Fresh Rook & Reed juice"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      <video
        className="absolute inset-0 h-full w-full object-cover opacity-20"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source
          src="/videos/juice/menu-pour.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/30" />

      <motion.div
        style={{ y: titleY }}
        className="rr-container relative flex min-h-[82svh] items-end pb-14 pt-32 sm:pb-20"
      >
        <div className="w-full">
          <div className="mb-8 flex items-center justify-between">
            <span className="rr-kicker text-white/60">
              THE R&R MENU
            </span>

            <span className="font-mono text-xs text-white/40">
              FRESH / DAILY
            </span>
          </div>

          <h1 className="rr-editorial max-w-6xl text-[17vw] leading-[0.78] tracking-[-0.055em] sm:text-[13vw] lg:text-[10.5vw]">
            GOOD
            <br />
            <em>JUICE.</em>
          </h1>

          <div className="mt-10 flex items-end justify-between gap-8">
            <p className="max-w-md text-sm leading-7 text-white/65 sm:text-base">
              Fresh combinations, pressed and blended with ingredients you
              can actually see.
            </p>

            <a
              href="#discover"
              className="hidden items-center gap-3 text-xs uppercase tracking-[0.16em] sm:flex"
            >
              Discover
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30">
                <ArrowDown size={15} />
              </span>
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}