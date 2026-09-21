"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";

export default function ProcessHero() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.16]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[680px] overflow-hidden bg-black text-white"
    >
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0"
      >
        <Image
          src="/images/process/process-hero.jpg"
          alt="Fresh ingredients being prepared at Rook & Reed Juicery"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <video
          className="absolute inset-0 h-full w-full object-cover opacity-55"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/process/process-hero.jpg"
        >
          <source
            src="/videos/process/process-hero.mp4"
            type="video/mp4"
          />
        </video>

        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/30" />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 flex h-full flex-col justify-end"
      >
        <div className="rr-container pb-12 sm:pb-16 lg:pb-20">
          <div className="max-w-6xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/65">
              THE ROOK & REED JUICERY / PROCESS
            </span>

            <h1 className="rr-editorial mt-6 max-w-5xl text-[clamp(4.5rem,12vw,11rem)] leading-[0.78] tracking-[-0.045em]">
              How we
              <br />
              <em>make it.</em>
            </h1>

            <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-md text-sm leading-7 text-white/70 sm:text-base">
                From the first piece of fruit to the final pour, every move
                is visible. Nothing unnecessary. Nothing hidden.
              </p>

              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/55">
                Scroll to explore
                <ArrowDown size={15} strokeWidth={1.2} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}