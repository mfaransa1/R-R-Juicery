"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowDown } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";

import type { Ingredient } from "@/data/ingredients";

type Props = {
  ingredient: Ingredient;
};

export default function IngredientDetailHero({
  ingredient,
}: Props) {
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

  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [1.05, 1.15],
  );

  const titleY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "35%"],
  );

  return (
    <section
      ref={ref}
      className="relative h-[90svh] min-h-[650px] overflow-hidden bg-black text-white"
    >
      <motion.div
        style={{
          y: imageY,
          scale,
        }}
        className="absolute inset-0"
      >
        <Image
          src={ingredient.image}
          alt={ingredient.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {ingredient.video && (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={ingredient.image}
            className="absolute inset-0 h-full w-full object-cover opacity-50"
          >
            <source
              src={ingredient.video}
              type="video/mp4"
            />
          </video>
        )}

        <div className="absolute inset-0 bg-black/35" />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
      </motion.div>

      <motion.div
        style={{ y: titleY }}
        className="relative z-10 flex h-full items-end"
      >
        <div className="rr-container w-full pb-12 sm:pb-16 lg:pb-20">
          <Link
            href="/ingredients"
            className="mb-10 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/55 transition-colors hover:text-white"
          >
            <ArrowLeft size={14} strokeWidth={1.2} />
            All ingredients
          </Link>

          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">
              {ingredient.category}
            </span>

            <h1 className="rr-editorial mt-5 max-w-6xl text-[clamp(5rem,14vw,12rem)] leading-[0.72] tracking-[-0.05em]">
              {ingredient.name}
            </h1>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
              <p className="max-w-lg text-sm leading-7 text-white/65 sm:text-base">
                {ingredient.shortDescription}
              </p>

              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/45">
                Scroll
                <ArrowDown
                  size={14}
                  strokeWidth={1.2}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}