"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";

import type { Product, ProductMood } from "@/data/products";
import JuiceCard from "@/components/juice/JuiceCard";

const moods: Array<"All" | ProductMood> = [
  "All",
  "Bright",
  "Green",
  "Tropical",
  "Citrus",
  "Spiced",
  "Deep",
];

type MenuDiscoveryProps = {
  products: Product[];
};

export default function MenuDiscovery({
  products,
}: MenuDiscoveryProps) {
  const [mood, setMood] = useState<"All" | ProductMood>("All");
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      /*
       * Your ingredients are objects:
       *
       * {
       *   name: "Pineapple",
       *   organicStatus: "unknown"
       * }
       *
       * Therefore we search ingredient.name rather than
       * treating the ingredient itself as a string.
       */
      const ingredientNames = product.ingredients.map((ingredient) =>
        ingredient.name.toLowerCase(),
      );

      const searchableText = [
        product.name,
        product.description,
        product.note,
        product.categoryLabel,
        ...ingredientNames,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        query.length === 0 || searchableText.includes(query);

      const matchesMood =
        mood === "All" ||
        product.moods?.includes(mood) === true;

      return matchesSearch && matchesMood;
    });
  }, [products, mood, search]);

  const resetDiscovery = () => {
    setMood("All");
    setSearch("");
  };

  return (
    <section className="bg-white">
      <div className="rr-container py-20 sm:py-28 lg:py-32">
        {/* INTRO */}
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <span className="rr-kicker">FIND YOUR MOVE</span>

            <h2 className="rr-editorial mt-5 text-5xl leading-[0.88] sm:text-7xl lg:text-8xl">
              What are you
              <br />
              <em>in the mood for?</em>
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-7 text-black/55 sm:text-base">
            Explore the Rook & Reed menu by flavour, ingredient and
            character. Choose a mood or search for something specific.
          </p>
        </div>

        {/* SEARCH */}
        <div className="mt-12 border-b border-black/20">
          <div className="flex items-center">
            <Search
              size={18}
              strokeWidth={1.5}
              className="mr-4 shrink-0 text-black/35"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search pineapple, ginger, cucumber..."
              aria-label="Search the Rook & Reed menu"
              className="h-16 w-full bg-transparent text-base outline-none placeholder:text-black/30"
            />

            {search.length > 0 && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="flex h-11 w-11 shrink-0 items-center justify-center text-black/50 transition-colors hover:text-black"
              >
                <X size={17} />
              </button>
            )}
          </div>
        </div>

        {/* MOOD FILTERS */}
        <div className="mt-7 flex gap-2 overflow-x-auto pb-3">
          {moods.map((item) => {
            const active = mood === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setMood(item)}
                aria-pressed={active}
                className={`shrink-0 border px-5 py-3 text-[11px] uppercase tracking-[0.15em] transition-all duration-300 ${
                  active
                    ? "border-black bg-black text-white"
                    : "border-black/15 text-black/55 hover:border-black/40 hover:text-black"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* RESULT HEADER */}
        <div className="mt-16 flex items-center justify-between border-b border-black/10 pb-5">
          <div>
            <span className="rr-kicker">
              {mood === "All" ? "THE MENU" : mood}
            </span>
          </div>

          <span className="font-mono text-[10px] tracking-[0.12em] text-black/35">
            {filteredProducts.length.toString().padStart(2, "0")} RESULTS
          </span>
        </div>

        {/* PRODUCTS */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${mood}-${search}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{
              duration: 0.35,
              ease: "easeOut",
            }}
            className="pt-10"
          >
            {filteredProducts.length > 0 ? (
              <div className="grid gap-x-5 gap-y-14 md:grid-cols-2">
                {filteredProducts.map((product, index) => (
                  <JuiceCard
                    key={product.slug}
                    product={product}
                    featured={index === 0}
                  />
                ))}
              </div>
            ) : (
              <div className="border-y border-black/10 py-24 text-center">
                <span className="rr-kicker">NO MATCH</span>

                <h3 className="rr-editorial mt-5 text-4xl sm:text-5xl">
                  No move found.
                </h3>

                <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-black/50">
                  Try another ingredient, flavour or mood.
                </p>

                <button
                  type="button"
                  onClick={resetDiscovery}
                  className="rr-button mt-8"
                >
                  Reset discovery
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}