"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { faqItems, type FAQCategory } from "@/data/faq";

const categories: Array<"ALL" | FAQCategory> = [
  "ALL",
  "JUICE",
  "INGREDIENTS",
  "ORDERS",
  "THE HOUSE",
  "EVENTS",
  "VISIT",
];

export default function FAQExplorer() {
  const [activeCategory, setActiveCategory] =
    useState<"ALL" | FAQCategory>("ALL");

  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(
    faqItems[0]?.id ?? null
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return faqItems.filter((item) => {
      const categoryMatch =
        activeCategory === "ALL" ||
        item.category === activeCategory;

      const searchMatch =
        !query ||
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, search]);

  return (
    <section
      id="questions"
      className="bg-[#f5f1e8] py-24 text-[#111] lg:py-36"
    >
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-14">
        <div className="grid gap-12 lg:grid-cols-[0.55fr_1.45fr]">
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
              FIND AN ANSWER
            </p>

            <h2 className="mt-6 font-serif text-6xl leading-[0.84] tracking-[-0.055em] sm:text-8xl">
              Questions,
              <br />
              answered.
            </h2>

            <div className="mt-10 flex items-center border-b border-black/20">
              <Search
                size={17}
                strokeWidth={1.5}
                className="mr-3 text-black/35"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search questions"
                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-black/30"
              />
            </div>

            <div className="mt-8 flex flex-wrap gap-x-4 gap-y-3 lg:block">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category);
                    setOpenId(null);
                  }}
                  className={`mr-4 mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition lg:block lg:mr-0 ${
                    activeCategory === category
                      ? "text-black underline underline-offset-8"
                      : "text-black/35 hover:text-black"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-black/15">
            {filteredItems.map((item) => {
              const isOpen = openId === item.id;

              return (
                <div
                  key={item.id}
                  className="border-b border-black/15"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenId(isOpen ? null : item.id)
                    }
                    className="flex w-full items-center justify-between gap-8 py-7 text-left"
                    aria-expanded={isOpen}
                  >
                    <div>
                      <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-black/30">
                        {item.category}
                      </p>

                      <h3 className="font-serif text-2xl leading-[1] tracking-[-0.025em] sm:text-3xl">
                        {item.question}
                      </h3>
                    </div>

                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center border border-black/15 transition ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDown
                        size={16}
                        strokeWidth={1.4}
                      />
                    </span>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-2xl pb-8 pr-10 text-base leading-[1.8] text-black/60">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredItems.length === 0 && (
              <div className="py-20">
                <p className="font-serif text-4xl">
                  Nothing found.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("ALL");
                  }}
                  className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] underline underline-offset-8"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}