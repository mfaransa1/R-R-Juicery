"use client";

import { motion } from "motion/react";

import type { Ingredient } from "@/data/ingredients";

type Props = {
  ingredient: Ingredient;
};

export default function IngredientDetails({
  ingredient,
}: Props) {
  const details = [
    {
      label: "Organic status",
      value: ingredient.organicStatus.replaceAll(
        "_",
        " ",
      ),
    },
    {
      label: "Source",
      value: ingredient.source,
    },
    {
      label: "Origin",
      value: ingredient.origin,
    },
    {
      label: "Seasonality",
      value: ingredient.seasonality.months,
    },
    {
      label: "Preparation",
      value: ingredient.preparation,
    },
    {
      label: "Storage",
      value: ingredient.storage,
    },
  ];

  return (
    <section className="bg-[#f5f1e8]">
      <div className="rr-container py-24 sm:py-32 lg:py-40">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <span className="rr-kicker">
              KNOW YOUR INGREDIENT
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
              className="rr-editorial mt-6 text-5xl leading-[0.85] sm:text-7xl"
            >
              What's
              <br />
              behind
              <br />
              <em>the pour?</em>
            </motion.h2>

            <p className="mt-8 max-w-md text-sm leading-8 text-black/55 sm:text-base">
              {ingredient.description}
            </p>
          </div>

          <div>
            <div className="border-t border-black/15">
              {details.map((detail, index) => (
                <motion.div
                  key={detail.label}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.04,
                  }}
                  className="grid gap-3 border-b border-black/15 py-6 sm:grid-cols-[180px_1fr]"
                >
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-black/35">
                    {detail.label}
                  </span>

                  <span className="text-sm leading-7 text-black/70">
                    {detail.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}