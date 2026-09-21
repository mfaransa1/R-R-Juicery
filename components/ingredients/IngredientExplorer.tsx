"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, ArrowUpRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useMemo, useState } from "react";

import type { Ingredient } from "@/data/ingredients";

type IngredientExplorerProps = {
  ingredients: Ingredient[];
};

const filters = [
  { label: "All", value: "all" },
  { label: "Fruit", value: "fruit" },
  { label: "Vegetables", value: "vegetable" },
  { label: "Herbs", value: "herb" },
  { label: "Spices", value: "spice" },
  { label: "Cane", value: "cane" },
];

export default function IngredientExplorer({
  ingredients,
}: IngredientExplorerProps) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return ingredients.filter((ingredient) => {
      const matchesFilter =
        filter === "all" || ingredient.category === filter;

      const matchesSearch =
        !query ||
        [
          ingredient.name,
          ingredient.category,
          ingredient.shortDescription,
          ingredient.description,
          ingredient.origin,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [ingredients, filter, search]);

  return (
    <section className="bg-[#f5f1e8]">
      <div className="rr-container py-20 sm:py-28 lg:py-36">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <div>
            <span className="rr-kicker">THE LIBRARY</span>

            <h2 className="rr-editorial mt-5 text-5xl leading-[0.88] sm:text-7xl lg:text-8xl">
              Start with
              <br />
              <em>the ingredient.</em>
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-7 text-black/55 sm:text-base">
            Explore the ingredients behind the Rook & Reed menu. See where
            they come from, how we prepare them and where they appear.
          </p>
        </div>

        {/* SEARCH */}
        <div className="mt-14 border-b border-black/15">
          <div className="flex items-center">
            <Search
              size={18}
              strokeWidth={1.4}
              className="mr-4 text-black/35"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              type="search"
              placeholder="Search ingredients..."
              aria-label="Search ingredients"
              className="h-16 w-full bg-transparent text-base outline-none placeholder:text-black/30"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="flex h-10 w-10 items-center justify-center text-black/40 hover:text-black"
                aria-label="Clear search"
              >
                <X size={17} />
              </button>
            )}
          </div>
        </div>

        {/* FILTERS */}
        <div className="mt-7 flex gap-2 overflow-x-auto pb-3">
          {filters.map((item) => {
            const active = filter === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`shrink-0 border px-5 py-3 text-[10px] uppercase tracking-[0.16em] transition-all ${
                  active
                    ? "border-black bg-black text-white"
                    : "border-black/15 text-black/50 hover:border-black/40 hover:text-black"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* COUNT */}
        <div className="mt-12 flex items-center justify-between border-b border-black/10 pb-5">
          <span className="rr-kicker">
            {filter === "all" ? "ALL INGREDIENTS" : filter}
          </span>

          <span className="font-mono text-[10px] tracking-[0.15em] text-black/35">
            {filtered.length.toString().padStart(2, "0")} ITEMS
          </span>
        </div>

        {/* GRID */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${filter}-${search}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="mt-10 grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((ingredient, index) => (
              <motion.article
                key={ingredient.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(index * 0.04, 0.3),
                }}
              >
                <Link
                  href={`/ingredients/${ingredient.slug}`}
                  className="group block"
                >
                  <div
                    className="relative aspect-[4/5] overflow-hidden"
                    style={{ backgroundColor: ingredient.color }}
                  >
                    <Image
                      src={ingredient.image}
                      alt={ingredient.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-70" />

                    <div className="absolute left-5 top-5">
                      <span className="bg-white/80 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.15em] text-black backdrop-blur-sm">
                        {ingredient.category}
                      </span>
                    </div>

                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                      <h3 className="rr-editorial max-w-[80%] text-4xl leading-[0.85] text-white sm:text-5xl">
                        {ingredient.name}
                      </h3>

                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                        <ArrowUpRight
                          size={15}
                          strokeWidth={1.2}
                        />
                      </span>
                    </div>
                  </div>

                  <div className="border-b border-black/10 py-4">
                    <p className="text-xs leading-6 text-black/50">
                      {ingredient.shortDescription}
                    </p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="border-b border-black/10 py-24 text-center">
            <span className="rr-kicker">NOT FOUND</span>

            <h3 className="rr-editorial mt-5 text-5xl">
              Try another ingredient.
            </h3>
          </div>
        )}
      </div>
    </section>
  );
}