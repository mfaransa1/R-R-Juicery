"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

import type { Product } from "@/data/products";

type Props = {
  products: Product[];
};

const toneStyles: Record<string, string> = {
  pineapple: "bg-[#d9b84a]",
  cucumber: "bg-[#aebc8b]",
  beet: "bg-[#8d4c50]",
  mango: "bg-[#e0a13a]",
  watermelon: "bg-[#d97970]",
  passion: "bg-[#c7a44a]",
  cane: "bg-[#b8a56d]",
  mint: "bg-[#a8b69a]",
};

export default function IngredientProducts({
  products,
}: Props) {
  return (
    <section className="bg-white">
      <div className="rr-container py-24 sm:py-32">
        <div className="flex flex-col justify-between gap-6 border-b border-black/10 pb-6 sm:flex-row sm:items-end">
          <div>
            <span className="rr-kicker">
              ON THE MENU
            </span>

            <h2 className="rr-editorial mt-4 text-5xl leading-[0.85] sm:text-7xl">
              Find it
              <br />
              <em>in these moves.</em>
            </h2>
          </div>

          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-black/35">
            {products.length.toString().padStart(2, "0")} PRODUCTS
          </span>
        </div>

        {products.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {products.map((product) => (
              <motion.div
                key={product.slug}
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.15,
                }}
                transition={{
                  duration: 0.5,
                }}
              >
                <Link
                  href={`/menu/${product.slug}`}
                  className="group block"
                >
                  <div
                    className={`relative aspect-[16/9] overflow-hidden ${
                      toneStyles[product.tone] ??
                      "bg-[#d8d2c7]"
                    }`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                      <h3 className="rr-editorial text-center text-5xl leading-[0.82] text-black sm:text-6xl">
                        {product.name}
                      </h3>
                    </div>

                    <div className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                      <ArrowUpRight
                        size={16}
                        strokeWidth={1.2}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b border-black/10 py-4">
                    <div>
                      <p className="text-xs text-black/50">
                        {product.ingredients
                          .slice(0, 4)
                          .map(
                            (ingredient) =>
                              ingredient.name,
                          )
                          .join(" · ")}
                      </p>

                      <p className="mt-2 font-mono text-xs">
                        KSh {product.price}
                      </p>
                    </div>

                    <span className="text-[10px] uppercase tracking-[0.16em] text-black/35">
                      Explore
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-sm text-black/40">
              This ingredient is not currently attached
              to a menu item.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}