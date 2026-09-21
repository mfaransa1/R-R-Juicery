"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function HouseReed() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-3, 3]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[var(--rr-paper)] py-24 sm:py-32 lg:py-40"
    >
      <motion.div
        style={{ x, rotate }}
        className="pointer-events-none absolute -right-20 top-10 h-[500px] w-[500px] rounded-full border border-black/10 sm:h-[700px] sm:w-[700px]"
      />

      <div className="rr-container relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="relative aspect-[16/10] overflow-hidden bg-black">
            <Image
              src="/images/jazz/jazz-room.jpg"
              alt="The Reed jazz space"
              fill
              sizes="(max-width: 1024px) 100vw, 65vw"
              className="object-cover"
            />

            <video
              className="absolute inset-0 h-full w-full object-cover opacity-25"
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
            >
              <source src="/videos/jazz/the-reed.mp4" type="video/mp4" />
            </video>

            <div className="absolute bottom-5 left-5 font-mono text-[10px] text-white/60">
              NOW PLAYING / THE REED
            </div>
          </div>

          <div>
            <span className="rr-kicker">THE REED</span>

            <h2 className="rr-editorial mt-6 text-6xl leading-[0.85] sm:text-8xl">
              Listen.
              <br />
              <em>Slowly.</em>
            </h2>

            <p className="mt-8 max-w-md text-base leading-8 text-black/60">
              Jazz listening, vinyl evenings, featured artists and music
              chosen to give the room its own pulse.
            </p>

            <Link
              href="/jazz"
              className="rr-button mt-8 inline-flex items-center gap-3"
            >
              Explore The Reed
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}