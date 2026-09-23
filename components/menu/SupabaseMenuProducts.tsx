"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Loader2,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";

import AddToCartButton from "@/components/cart/AddToCartButton";
import {
  getPublicProducts,
  type PublicProduct,
} from "@/lib/supabase/catalog";

const CATEGORY_LABELS: Record<string, string> = {
  presses: "The Presses",
  "house-compositions": "The House Compositions",
  cane: "The Cane",
  interludes: "The Interludes",
  blenders: "The Blenders",
  "seasonal-records": "The Seasonal Records",
};

const CATEGORY_ORDER = [
  "presses",
  "house-compositions",
  "cane",
  "interludes",
  "blenders",
  "seasonal-records",
];

export default function SupabaseMenuProducts() {
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const data = await getPublicProducts();

        if (mounted) {
          setProducts(data);
        }
      } catch (err) {
        console.error(err);

        if (mounted) {
          setError(
            "The live menu is temporarily unavailable. Please refresh and try again.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const available = new Set(products.map((product) => product.category));

    return CATEGORY_ORDER.filter((category) => available.has(category));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "all" || product.category === activeCategory;

      if (!matchesCategory) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const searchable = [
        product.name,
        product.description,
        product.note,
        product.category_label,
        product.category,
        product.size,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalizedQuery);
    });
  }, [products, activeCategory, query]);

  if (loading) {
    return (
      <section className="border-t border-black/10 bg-[var(--rr-paper)]">
        <div className="mx-auto flex min-h-[420px] max-w-[1440px] items-center justify-center px-6 py-20">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-black/60">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading the menu
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="border-t border-black/10 bg-[var(--rr-paper)]">
        <div className="mx-auto max-w-[1440px] px-6 py-20 sm:px-8 lg:px-10">
          <div className="border border-black/10 bg-white p-8 sm:p-10">
            <p className="rr-kicker">R&R PRESS</p>

            <h2 className="mt-4 font-serif text-3xl sm:text-4xl">
              The menu needs another pour.
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-7 text-black/55">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-7 border border-black bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] !text-white transition hover:bg-white hover:!text-black"
            >
              Refresh Menu
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-black/10 bg-[var(--rr-paper)]">
      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="flex flex-col gap-8 border-b border-black/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
              R&R PRESS
            </p>

            <h2 className="mt-3 max-w-3xl font-serif text-4xl leading-[0.95] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
              The menu,
              <br />
              straight from the house.
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-black/50">
              Choose a composition, explore what is inside, then make your
              move.
            </p>
          </div>

          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the menu"
              aria-label="Search the menu"
              className="h-12 w-full border border-black/15 bg-white py-3 pl-11 pr-10 text-sm outline-none transition placeholder:text-black/35 focus:border-black"
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center text-black/45 transition hover:text-black"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto py-8 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`shrink-0 border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition ${
              activeCategory === "all"
                ? "border-black bg-black !text-white"
                : "border-black/15 bg-white text-black hover:border-black"
            }`}
          >
            All
          </button>

          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                activeCategory === category
                  ? "border-black bg-black !text-white"
                  : "border-black/15 bg-white text-black hover:border-black"
              }`}
            >
              {CATEGORY_LABELS[category] ?? category}
            </button>
          ))}
        </div>

        <div className="mb-7 flex items-center justify-between border-b border-black/10 pb-4">
          <p className="text-xs uppercase tracking-[0.16em] text-black/45">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "composition" : "compositions"}
          </p>

          {query && (
            <p className="text-xs text-black/45">
              Searching for <span className="font-semibold">“{query}”</span>
            </p>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="border border-black/10 bg-white px-6 py-16 text-center">
            <p className="rr-kicker">NO MATCH</p>

            <h3 className="mt-4 font-serif text-3xl">
              Nothing on this record.
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-black/50">
              Try another search or return to the full menu.
            </p>

            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveCategory("all");
              }}
              className="mt-7 border border-black bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] !text-white transition hover:bg-white hover:!text-black"
            >
              View all
            </button>
          </div>
        ) : (
          <div className="grid gap-px bg-black/10 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group bg-[var(--rr-paper)]"
              >
                <Link
                  href={`/menu/${product.slug}`}
                  className="block"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-black/5">
                    <img
                      src={
                        product.image_path ||
                        `/images/products/${product.slug}.jpg`
                      }
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
                    />

                    <div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/75 px-5 py-3 text-xs uppercase tracking-[0.14em] !text-white opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      Explore composition
                    </div>
                  </div>

                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between gap-5">
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45">
                          {product.category_label ||
                            CATEGORY_LABELS[product.category] ||
                            product.category}
                        </p>

                        <h3 className="mt-2 font-serif text-2xl leading-none">
                          {product.name}
                        </h3>
                      </div>

                      <span className="shrink-0 whitespace-nowrap text-sm font-semibold">
                        KSh {product.price.toLocaleString()}
                      </span>
                    </div>

                    {product.description && (
                      <p className="mt-4 line-clamp-2 text-sm leading-6 text-black/60">
                        {product.description}
                      </p>
                    )}

                    <div className="mt-5 flex items-center justify-between border-t border-black/10 pt-4 text-xs uppercase tracking-[0.14em]">
                      <span className="text-black/45">{product.size}</span>

                      <span className="inline-flex items-center gap-2 font-semibold text-black">
                        View
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="px-6 pb-6">
                  <AddToCartButton product={product} />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}