"use client";

import Image from "next/image";
import { ArrowDown } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";

export default function SourcingHero() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "18%"],
  );

  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1.05, 1.16],
  );

  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "35%"],
  );

  return (
    <section
      ref={ref}
      className="relative h-[92svh] min-h-[680px] overflow-hidden bg-black text-white"
    >
      <motion.div
        style={{
          y: imageY,
          scale: imageScale,
        }}
        className="absolute inset-0"
      >
        <Image
          src="/images/sourcing/sourcing-hero.jpg"
          alt="Fresh produce being sourced for Rook & Reed"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/sourcing/sourcing-hero.jpg"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        >
          <source
            src="/videos/sourcing/sourcing-hero.mp4"
            type="video/mp4"
          />
        </video>

        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/25" />
      </motion.div>

      <motion.div
        style={{ y: contentY }}
        className="relative z-10 flex h-full items-end"
      >
        <div className="rr-container w-full pb-14 sm:pb-20 lg:pb-24">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">
            THE JOURNEY
          </span>

          <h1 className="rr-editorial mt-6 max-w-6xl text-[clamp(4.5rem,13vw,11rem)] leading-[0.74] tracking-[-0.05em]">
            From source
            <br />
            <em>to glass.</em>
          </h1>

          <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-xl text-sm leading-7 text-white/65 sm:text-base">
              We want you to understand the journey behind the juice —
              from the ingredient's starting point to the drink in your
              hands.
            </p>

            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/45">
              Follow the journey
              <ArrowDown size={15} strokeWidth={1.2} />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}