"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";

export default function IngredientsHero() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  return (
    <section
      ref={ref}
      className="relative h-[90svh] min-h-[650px] overflow-hidden bg-black text-white"
    >
      <motion.div
        style={{ y: imageY, scale }}
        className="absolute inset-0"
      >
        <Image
          src="/images/ingredients/ingredients-hero.jpg"
          alt="Fresh ingredients at The Rook & Reed Juicery"
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
          poster="/images/ingredients/ingredients-hero.jpg"
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        >
          <source
            src="/videos/ingredients/ingredients-hero.mp4"
            type="video/mp4"
          />
        </video>

        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/30" />
      </motion.div>

      <motion.div
        style={{ y: titleY }}
        className="relative z-10 flex h-full items-end"
      >
        <div className="rr-container w-full pb-14 sm:pb-20">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">
            THE INGREDIENT LIBRARY
          </span>

          <h1 className="rr-editorial mt-6 max-w-6xl text-[clamp(4.5rem,13vw,11rem)] leading-[0.76] tracking-[-0.05em]">
            Know what
            <br />
            <em>goes in.</em>
          </h1>

          <div className="mt-10 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/55">
            Explore the ingredients
            <ArrowDown size={15} strokeWidth={1.2} />
          </div>
        </div>
      </motion.div>
    </section>
  );
}