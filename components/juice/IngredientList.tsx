"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Ingredient } from "@/data/ingredients";

type IngredientListProps = {
  ingredients: Ingredient[];
};

const toneClasses: Record<string, string> = {
  pineapple: "bg-[#e7b83c]",
  orange: "bg-[#f29a24]",
  ginger: "bg-[#d89a42]",
  cucumber: "bg-[#5d8062]",
  apple: "bg-[#9bb34a]",
  spinach: "bg-[#527553]",
  lemon: "bg-[#ead34c]",
  mint: "bg-[#86a982]",
  beet: "bg-[#7d2638]",
  mango: "bg-[#d99b28]",
  passion: "bg-[#c96a3d]",
  watermelon: "bg-[#d85c55]",
  lime: "bg-[#a6b93b]",
  cane: "bg-[#78905a]",
};

export default function IngredientList({
  ingredients,
}: IngredientListProps) {
  if (ingredients.length === 0) {
    return (
      <div className="border-t border-black/10 py-16 text-center">
        <p className="rr-editorial text-3xl">
          No ingredients found.
        </p>

        <p className="mt-3 text-sm text-black/45">
          Try another ingredient.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-x-4 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {ingredients.map((ingredient, index) => (
        <motion.article
          key={ingredient.slug}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{
            duration: 0.5,
            delay: Math.min(index * 0.04, 0.2),
          }}
        >
          <Link
            href={`/ingredients/${ingredient.slug}`}
            className="group block"
          >
            <div
              className={`relative aspect-[4/3] overflow-hidden ${
                toneClasses[ingredient.tone] ??
                "bg-[#d8d2c7]"
              }`}
            >
              <div className="absolute inset-0">
                <div className="absolute left-[12%] top-[18%] h-28 w-28 rounded-full border border-black/10" />

                <div className="absolute right-[15%] top-[28%] h-20 w-20 rounded-full border border-black/10" />

                <div className="absolute bottom-[10%] left-[30%] h-36 w-36 rounded-full border border-black/10" />
              </div>

              <div className="absolute left-5 top-5">
                <span className="text-[9px] font-bold tracking-[0.15em] text-black/40">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="absolute right-5 top-5">
                <span className="text-[8px] font-bold uppercase tracking-[0.13em] text-black/40">
                  Ingredient
                </span>
              </div>

              <div className="absolute inset-0 flex items-center justify-center px-5">
                <span className="rr-editorial text-center text-5xl font-medium leading-[0.9] tracking-[-0.045em] text-black/80 transition-transform duration-500 group-hover:scale-[1.04] sm:text-6xl">
                  {ingredient.name}
                </span>
              </div>

              <div className="absolute bottom-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-black/20 text-black/60 transition-transform duration-300 group-hover:translate-x-1">
                →
              </div>
            </div>

            <div className="border-b border-black/10 py-5">
              <div className="flex items-start justify-between gap-5">
                <h3 className="rr-editorial text-3xl font-medium leading-none tracking-[-0.025em]">
                  {ingredient.name}
                </h3>

                <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-black/30">
                  {formatStatus(ingredient.organicStatus)}
                </span>
              </div>

              <p className="mt-3 line-clamp-2 text-sm leading-6 text-black/50">
                {ingredient.description}
              </p>

              <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.12em] text-black/35">
                Explore ingredient →
              </p>
            </div>
          </Link>
        </motion.article>
      ))}
    </div>
  );
}

function formatStatus(
  status: Ingredient["organicStatus"],
) {
  switch (status) {
    case "verified_organic":
      return "Organic";

    case "supplier_claimed":
      return "Claimed";

    case "conventional":
      return "Conventional";

    default:
      return "To verify";
  }
}