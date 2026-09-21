"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function StoryClosing() {
  return (
    <section className="relative min-h-[80svh] overflow-hidden bg-black text-white">
      <Image
        src="/images/story/story-closing.jpg"
        alt="The Rook & Reed experience"
        fill
        sizes="100vw"
        className="object-cover"
      />

      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/images/story/story-closing.jpg"
        className="absolute inset-0 h-full w-full object-cover opacity-45"
      >
        <source
          src="/videos/story/story-closing.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />

      <div className="relative z-10 flex min-h-[80svh] items-end">
        <div className="rr-container w-full pb-14 sm:pb-20 lg:pb-24">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
            GOOD JUICE. GOOD MUSIC. GOOD COMPANY.
          </span>

          <motion.h2
            initial={{
              opacity: 0,
              y: 35,
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
            className="rr-editorial mt-6 max-w-6xl text-[clamp(4.5rem,12vw,11rem)] leading-[0.72]"
          >
            Come spend
            <br />
            <em>some time.</em>
          </motion.h2>

          <div className="mt-10">
            <Link
              href="/visit"
              className="group inline-flex items-center gap-5 border-b border-white/30 pb-4 text-[10px] uppercase tracking-[0.2em] transition-colors hover:border-white"
            >
              Visit Rook & Reed

              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight
                  size={15}
                  strokeWidth={1.2}
                />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}