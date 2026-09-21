"use client";

import Image from "next/image";
import { motion } from "motion/react";

export default function IngredientPromise() {
  return (
    <section className="bg-black text-white">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[550px] overflow-hidden lg:min-h-[700px]">
          <Image
            src="/images/ingredients/ingredient-preparation.jpg"
            alt="Ingredients being prepared at Rook & Reed"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />

          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/images/ingredients/ingredient-preparation.jpg"
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          >
            <source
              src="/videos/ingredients/ingredient-preparation.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        <div className="flex items-center px-6 py-20 sm:px-10 sm:py-28 lg:px-16 xl:px-24">
          <div className="max-w-xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
              TRANSPARENCY
            </span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rr-editorial mt-6 text-6xl leading-[0.8] sm:text-8xl"
            >
              We don't just
              <br />
              <em>tell you.</em>
            </motion.h2>

            <p className="mt-9 text-sm leading-8 text-white/55 sm:text-base">
              We show you. The ingredient. The preparation. The source.
              The process. The finished drink.
            </p>

            <div className="mt-12 border-t border-white/15 pt-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                KNOW YOUR JUICE
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}