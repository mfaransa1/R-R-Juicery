"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Loader2, Search } from "lucide-react";
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
            "The live menu is temporarily unavailable. Please refresh and try again."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

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

      if (!normalizedQuery) {
        return matchesCategory;
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

      return matchesCategory && searchable.includes(normalizedQuery);
    });
  }, [products, activeCategory, query]);

  if (loading) {
    return (
      <section className="border-t border-black/10 bg-[var(--rr-paper)]">
        <div className="mx-auto flex min-h-[360px] max-w-[1440px] items-center justify-center px-6 py-20">
          <div className="flex items-center gap-3 text-sm uppercase tracking-[0.18em]">
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
        <div className="mx-auto max-w-[1440px] px-6 py-20">
          <div className="border border-black/10 bg-white p-8">
            <p className="text-sm">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 border border-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em]"
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
      <div className="mx-auto max-w-[1440px] px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="flex flex-col gap-8 border-b border-black/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/55">
              R&R Press
            </p>
            <h2 className="mt-3 max-w-3xl font-serif text-4xl leading-[0.95] sm:text-5xl lg:text-6xl">
              The menu, straight from the house.
            </h2>
          </div>

          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/45" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the menu"
              className="w-full border border-black/15 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-black"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 py-8">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
              activeCategory === "all"
                ? "border-black bg-black text-white"
                : "border-black/15 bg-white hover:border-black"
            }`}
          >
            All
          </button>

          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                activeCategory === category
                  ? "border-black bg-black text-white"
                  : "border-black/15 bg-white hover:border-black"
              }`}
            >
              {CATEGORY_LABELS[category] ?? category}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="border border-black/10 bg-white p-10 text-center">
            <p className="text-sm text-black/60">
              No active products match your search.
            </p>
          </div>
        ) : (
          <div className="grid gap-px bg-black/10 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <article key={product.id} className="bg-[var(--rr-paper)]">
                <Link
                  href={`/menu/${product.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-black/5">
                    <img
                      src={
                        product.image_path ||
                        `/images/products/${product.slug}.jpg`
                      }
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45">
                          {product.category_label ||
                            CATEGORY_LABELS[product.category] ||
                            product.category}
                        </p>

                        <h3 className="mt-2 font-serif text-2xl">
                          {product.name}
                        </h3>
                      </div>

                      <span className="whitespace-nowrap text-sm font-semibold">
                        KSh {product.price.toLocaleString()}
                      </span>
                    </div>

                    {product.description && (
                      <p className="mt-4 text-sm leading-6 text-black/65">
                        {product.description}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.14em] text-black/50">
                      <span>{product.size}</span>
                      <span className="inline-flex items-center gap-2">
                        View
                        <ArrowRight className="h-3.5 w-3.5" />
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
