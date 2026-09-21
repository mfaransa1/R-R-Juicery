"use client";

import Image from "next/image";
import Link from "next/link";
import { journalPosts, type JournalCategory } from "@/data/journal";
import { useState } from "react";

const filters: Array<"ALL" | JournalCategory> = [
  "ALL",
  "JUICE",
  "THE HOUSE",
  "THE REED",
  "SHoP",
  "INGREDIENTS",
  "CULTURE",
];

export default function JournalGrid() {
  const [active, setActive] = useState<"ALL" | JournalCategory>("ALL");

  const posts =
    active === "ALL"
      ? journalPosts
      : journalPosts.filter((post) => post.category === active);

  return (
    <section className="bg-white py-24 text-[#111] lg:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="flex flex-col justify-between gap-8 border-b border-black/15 pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
              THE ARCHIVE
            </p>

            <h2 className="mt-5 font-serif text-6xl leading-[0.85] tracking-[-0.055em] sm:text-8xl">
              Recent notes.
            </h2>
          </div>

          <div className="flex max-w-3xl flex-wrap gap-x-5 gap-y-3">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActive(filter)}
                className={`text-[10px] font-semibold uppercase tracking-[0.18em] transition ${
                  active === filter
                    ? "text-black underline underline-offset-8"
                    : "text-black/35 hover:text-black"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-x-6 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Link
              href={`/journal/${post.slug}`}
              key={post.slug}
              className={`group ${
                index === 0 && posts.length > 4
                  ? "lg:col-span-2"
                  : ""
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#d8d2c7]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute left-4 top-4 bg-[#f5f1e8] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.18em]">
                  {post.category}
                </div>
              </div>

              <div className="mt-5">
                <div className="flex gap-3 text-[9px] uppercase tracking-[0.2em] text-black/35">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="mt-4 font-serif text-3xl leading-[0.95] tracking-[-0.035em] sm:text-4xl">
                  {post.title}
                </h3>

                <p className="mt-4 max-w-xl text-sm leading-relaxed text-black/55">
                  {post.excerpt}
                </p>

                <span className="mt-5 inline-block text-[10px] font-semibold uppercase tracking-[0.18em] underline underline-offset-8">
                  Read
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}