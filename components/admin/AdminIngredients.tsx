"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Leaf,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { ingredients } from "@/data/ingredients";

type OrganicFilter =
  | "ALL"
  | "verified_organic"
  | "supplier_claimed"
  | "conventional"
  | "unknown";

const filters: OrganicFilter[] = [
  "ALL",
  "verified_organic",
  "supplier_claimed",
  "conventional",
  "unknown",
];

const labels: Record<OrganicFilter, string> = {
  ALL: "ALL",
  verified_organic: "VERIFIED",
  supplier_claimed: "SUPPLIER CLAIMED",
  conventional: "CONVENTIONAL",
  unknown: "UNKNOWN",
};

export default function AdminIngredients() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] =
    useState<OrganicFilter>("ALL");

  const filteredIngredients = useMemo(() => {
    const query = search.trim().toLowerCase();

    return ingredients.filter((ingredient) => {
      const matchesFilter =
        filter === "ALL" ||
        ingredient.organicStatus === filter;

      const matchesSearch =
        !query ||
        ingredient.name.toLowerCase().includes(query) ||
        ingredient.category.toLowerCase().includes(query) ||
        ingredient.origin.toLowerCase().includes(query) ||
        ingredient.source.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [search, filter]);

  return (
    <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <div className="flex flex-col gap-6 border-b border-black/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-black/35">
            OPERATIONS / TRANSPARENCY
          </p>

          <h1 className="mt-3 font-serif text-5xl tracking-[-0.045em]">
            Ingredients.
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-relaxed text-black/45">
            Maintain ingredient information, sourcing,
            seasonality and organic-status records.
          </p>
        </div>

        <button
          type="button"
          className="flex w-fit items-center gap-3 bg-black px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white"
        >
          <Leaf size={15} strokeWidth={1.3} />
          Add ingredient
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center border-b border-black/20 lg:w-[380px]">
          <Search
            size={17}
            strokeWidth={1.4}
            className="mr-3 text-black/30"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search ingredients"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-black/25"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.13em] transition ${
                filter === item
                  ? "bg-black text-white"
                  : "border border-black/10 text-black/40 hover:border-black/30 hover:text-black"
              }`}
            >
              {labels[item]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-px border border-black/10 bg-black/10 sm:grid-cols-2 xl:grid-cols-3">
        {filteredIngredients.map((ingredient) => (
          <article
            key={ingredient.slug}
            className="bg-white p-6 transition hover:bg-[#faf8f3]"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center border border-black/10">
                <Leaf
                  size={17}
                  strokeWidth={1.25}
                  className="text-black/40"
                />
              </div>

              <Link
                href={`/ingredients/${ingredient.slug}`}
                className="flex h-8 w-8 items-center justify-center border border-black/10 transition hover:bg-black hover:text-white"
              >
                <ArrowUpRight
                  size={14}
                  strokeWidth={1.3}
                />
              </Link>
            </div>

            <p className="mt-10 text-[8px] font-semibold uppercase tracking-[0.2em] text-black/30">
              {ingredient.category}
            </p>

            <h2 className="mt-2 font-serif text-3xl tracking-[-0.035em]">
              {ingredient.name}
            </h2>

            <p className="mt-3 text-xs leading-relaxed text-black/45">
              {ingredient.shortDescription}
            </p>

            <div className="mt-7 border-t border-black/10 pt-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-black/30">
                    Origin
                  </p>

                  <p className="mt-2 text-xs text-black/60">
                    {ingredient.origin}
                  </p>
                </div>

                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-black/30">
                    Seasonality
                  </p>

                  <p className="mt-2 text-xs text-black/60">
                    {ingredient.seasonality}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-black/30">
                Organic status
              </p>

              <span className="mt-2 inline-flex border border-black/10 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.13em]">
                {labels[ingredient.organicStatus]}
              </span>
            </div>

            <div className="mt-6 border-t border-black/10 pt-5">
              <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-black/30">
                Source
              </p>

              <p className="mt-2 text-xs leading-relaxed text-black/50">
                {ingredient.source}
              </p>
            </div>
          </article>
        ))}
      </div>

      {filteredIngredients.length === 0 && (
        <div className="border border-black/10 bg-white py-20 text-center">
          <p className="font-serif text-3xl">
            No ingredients found.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setFilter("ALL");
            }}
            className="mt-5 text-[9px] font-semibold uppercase tracking-[0.18em] underline underline-offset-4"
          >
            Clear filters
          </button>
        </div>
      )}

      <div className="mt-8 flex items-start gap-3 border-t border-black/10 pt-6">
        <SlidersHorizontal
          size={15}
          strokeWidth={1.3}
          className="mt-0.5 text-black/30"
        />

        <p className="max-w-3xl text-[10px] leading-relaxed text-black/40">
          Organic status is intentionally modeled as verified
          organic, supplier claimed, conventional or unknown.
          Do not convert unknown records into organic claims
          without supporting documentation.
        </p>
      </div>
    </div>
  );
}