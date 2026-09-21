"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    name: "The Presses",
    description: "Fresh pressed combinations.",
    slug: "presses",
  },
  {
    name: "House Compositions",
    description: "The signatures of Rook & Reed.",
    slug: "house-compositions",
  },
  {
    name: "The Cane",
    description: "Sugarcane with a R&R rhythm.",
    slug: "the-cane",
  },
  {
    name: "The Interludes",
    description: "Small pours between moves.",
    slug: "interludes",
  },
  {
    name: "The Blenders",
    description: "Thick, cold and fruit-forward.",
    slug: "blenders",
  },
  {
    name: "Seasonal Records",
    description: "Here for the season.",
    slug: "seasonal-records",
  },
];

export default function MenuCategories() {
  return (
    <section className="bg-[var(--rr-paper)]">
      <div className="rr-container py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <span className="rr-kicker">
              EXPLORE THE RECORDS
            </span>

            <h2 className="rr-editorial mt-5 text-5xl leading-[0.9] sm:text-6xl">
              Find your
              <br />
              <em>rhythm.</em>
            </h2>
          </div>

          <div className="border-t border-black/15">
            {categories.map((category, index) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.04,
                }}
              >
                <Link
                  href={`/menu?category=${category.slug}`}
                  className="group flex items-center justify-between gap-6 border-b border-black/15 py-6 sm:py-8"
                >
                  <div className="flex min-w-0 items-baseline gap-5">
                    <span className="font-mono text-[10px] text-black/30">
                      0{index + 1}
                    </span>

                    <div>
                      <h3 className="rr-editorial text-3xl leading-none sm:text-4xl">
                        {category.name}
                      </h3>

                      <p className="mt-2 text-xs text-black/45 sm:text-sm">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/15 transition-all duration-300 group-hover:bg-black group-hover:text-white">
                    <ArrowUpRight size={16} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}