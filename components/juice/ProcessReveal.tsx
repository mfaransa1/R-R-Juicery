"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export default function ProcessReveal() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.94]);
  const y = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  return (
    <section
      ref={ref}
      className="relative h-[75svh] min-h-[520px] overflow-hidden bg-black text-white"
    >
      <motion.div
        style={{ scale, y }}
        className="absolute inset-0"
      >
        <Image
          src="/images/process/fresh-pour.jpg"
          alt="Fresh Rook & Reed juice being poured"
          fill
          sizes="100vw"
          className="object-cover"
        />

        <video
          className="absolute inset-0 h-full w-full object-cover opacity-60"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/process/fresh-pour.jpg"
        >
          <source
            src="/videos/process/fresh-pour.mp4"
            type="video/mp4"
          />
        </video>

        <div className="absolute inset-0 bg-black/35" />
      </motion.div>

      <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">
            SEE THE DIFFERENCE
          </span>

          <h2 className="rr-editorial mt-6 max-w-5xl text-6xl leading-[0.82] sm:text-8xl lg:text-[9rem]">
            You should be able
            <br />
            <em>to see your juice.</em>
          </h2>
        </motion.div>
      </div>
    </section>
  );
}