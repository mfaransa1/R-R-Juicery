"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useRef } from "react";

type ProcessStageProps = {
  number: string;
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  video: string;
  caption: string;
  reverse?: boolean;
};

export default function ProcessStage({
  number,
  title,
  eyebrow,
  description,
  image,
  video,
  caption,
  reverse = false,
}: ProcessStageProps) {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    reverse ? ["-7%", "7%"] : ["7%", "-7%"],
  );

  const numberY = useTransform(scrollYProgress, [0, 1], ["30%", "-30%"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-black/10 bg-[#f5f1e8]"
    >
      <div className="rr-container py-20 sm:py-28 lg:py-36">
        <div
          className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-20 ${
            reverse ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          {/* MEDIA */}
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden bg-black sm:aspect-[5/6]">
              <motion.div
                style={{ y: imageY }}
                className="absolute -inset-[7%]"
              >
                <Image
                  src={image}
                  alt={title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />

                <video
                  className="absolute inset-0 h-full w-full object-cover opacity-45"
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={image}
                >
                  <source src={video} type="video/mp4" />
                </video>
              </motion.div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <span className="max-w-xs text-[10px] uppercase tracking-[0.16em] text-white/70">
                  {caption}
                </span>

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 text-white">
                  <ArrowUpRight size={15} strokeWidth={1.2} />
                </span>
              </div>
            </div>
          </div>

          {/* COPY */}
          <div className="relative">
            <motion.div
              style={{ y: numberY }}
              className="absolute -top-16 right-0 font-mono text-[7rem] leading-none text-black/[0.045] sm:-top-24 sm:text-[11rem]"
            >
              {number}
            </motion.div>

            <span className="rr-kicker">{eyebrow}</span>

            <h2 className="rr-editorial relative mt-5 text-6xl leading-[0.82] sm:text-8xl">
              {title}
            </h2>

            <p className="relative mt-8 max-w-lg text-sm leading-8 text-black/55 sm:text-base">
              {description}
            </p>

            <div className="relative mt-10 flex items-center gap-3 border-t border-black/10 pt-5 text-[10px] uppercase tracking-[0.18em] text-black/40">
              <ArrowDown size={14} strokeWidth={1.2} />
              <span>One move at a time</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}