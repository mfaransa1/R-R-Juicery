"use client";

import { motion } from "motion/react";
import { QrCode, ArrowRight } from "lucide-react";

import type { Ingredient } from "@/data/ingredients";

type Props = {
  ingredient: Ingredient;
};

export default function IngredientTraceability({
  ingredient,
}: Props) {
  return (
    <section className="bg-[#111111] text-white">
      <div className="rr-container py-24 sm:py-32 lg:py-40">
        <div className="grid gap-14 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">
              FUTURE TRACEABILITY
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
              className="rr-editorial mt-6 max-w-4xl text-6xl leading-[0.8] sm:text-8xl"
            >
              Follow the
              <br />
              <em>journey.</em>
            </motion.h2>

            <p className="mt-9 max-w-xl text-sm leading-8 text-white/50 sm:text-base">
              R&R is designed to make ingredient and batch
              information increasingly transparent. Future QR
              traceability can connect a drink to its production
              date, ingredients, source and preparation details.
            </p>

            <div className="mt-10 flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-white/35">
              <ArrowRight size={15} strokeWidth={1.2} />
              {ingredient.name} / traceability
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="flex aspect-square w-56 items-center justify-center border border-white/15 sm:w-72">
              <div className="flex aspect-square w-32 items-center justify-center border border-white/20 sm:w-44">
                <QrCode
                  size={90}
                  strokeWidth={0.8}
                  className="text-white/70 sm:h-[120px] sm:w-[120px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}