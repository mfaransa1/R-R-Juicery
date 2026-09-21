"use client";

import { useMemo, useState } from "react";
import IngredientList from "./IngredientList";
import type {
  Ingredient,
  OrganicStatus,
} from "@/data/ingredients";

type IngredientExplorerProps = {
  ingredients: Ingredient[];
};

const filters: {
  label: string;
  value: "all" | OrganicStatus;
}[] = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Verified organic",
    value: "verified_organic",
  },
  {
    label: "Supplier claimed",
    value: "supplier_claimed",
  },
  {
    label: "Conventional",
    value: "conventional",
  },
  {
    label: "To verify",
    value: "unknown",
  },
];

export default function IngredientExplorer({
  ingredients,
}: IngredientExplorerProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<
    "all" | OrganicStatus
  >("all");

  const filteredIngredients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return ingredients.filter((ingredient) => {
      const matchesQuery =
        !normalizedQuery ||
        ingredient.name
          .toLowerCase()
          .includes(normalizedQuery) ||
        ingredient.description
          .toLowerCase()
          .includes(normalizedQuery) ||
        ingredient.origin
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesStatus =
        status === "all" ||
        ingredient.organicStatus === status;

      return matchesQuery && matchesStatus;
    });
  }, [ingredients, query, status]);

  return (
    <div>
      {/* Search / filter */}
      <div className="mb-12 border-y border-black/10 py-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <label
              htmlFor="ingredient-search"
              className="sr-only"
            >
              Search ingredients
            </label>

            <input
              id="ingredient-search"
              type="search"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search ingredients..."
              className="h-12 w-full border-b border-black/20 bg-transparent pr-10 text-sm outline-none placeholder:text-black/30 focus:border-black"
            />

            <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-sm text-black/35">
              /
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filters.map((filter) => {
              const active = status === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() =>
                    setStatus(filter.value)
                  }
                  className={[
                    "shrink-0 border px-4 py-3 text-[9px] font-bold uppercase tracking-[0.11em] transition-colors duration-200",
                    active
                      ? "border-black bg-black text-white"
                      : "border-black/15 bg-transparent text-black/45 hover:border-black/35 hover:text-black",
                  ].join(" ")}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.13em] text-black/30">
          <span>
            {filteredIngredients.length}{" "}
            {filteredIngredients.length === 1
              ? "ingredient"
              : "ingredients"}
          </span>

          {(query || status !== "all") && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setStatus("all");
              }}
              className="transition-colors hover:text-black"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <IngredientList
        ingredients={filteredIngredients}
      />
    </div>
  );
}