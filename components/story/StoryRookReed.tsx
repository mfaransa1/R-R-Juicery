"use client";

import Image from "next/image";
import { motion } from "motion/react";

export default function StoryRookReed() {
  return (
    <section className="bg-black text-white">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[600px] overflow-hidden lg:min-h-[800px]">
          <Image
            src="/images/story/rook-reed-symbol.jpg"
            alt="Rook and Reed"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />

          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/images/story/rook-reed-symbol.jpg"
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          >
            <source
              src="/videos/story/rook-reed-symbol.mp4"
              type="video/mp4"
            />
          </video>

          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="flex items-center px-6 py-20 sm:px-10 sm:py-28 lg:px-16 xl:px-24">
          <div className="max-w-xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">
              THE NAME
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
              className="rr-editorial mt-6 text-6xl leading-[0.78] sm:text-8xl"
            >
              ROOK
            </motion.h2>

            <p className="mt-7 text-sm leading-8 text-white/50 sm:text-base">
              The rook represents the mind — chess, strategy, thought,
              patience and the beauty of a considered move.
            </p>

            <div className="my-14 h-px w-full bg-white/10" />

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
              className="rr-editorial text-6xl leading-[0.78] sm:text-8xl"
            >
              REED
            </motion.h2>

            <p className="mt-7 text-sm leading-8 text-white/50 sm:text-base">
              The reed represents the soul — the saxophone, jazz,
              expression, rhythm and the emotional language of music.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}