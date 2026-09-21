"use client";

import Image from "next/image";
import Link from "next/link";
import { journalPosts } from "@/data/journal";

export default function JournalFeatured() {
  const post = journalPosts.find((item) => item.featured) ?? journalPosts[0];

  return (
    <section
      id="stories"
      className="bg-[#f5f1e8] py-24 text-[#111] lg:py-36"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="mb-14 flex items-end justify-between border-b border-black/15 pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
              FEATURED STORY
            </p>
          </div>

          <span className="hidden text-[10px] uppercase tracking-[0.25em] text-black/35 sm:block">
            R&R / 001
          </span>
        </div>

        <Link
          href={`/journal/${post.slug}`}
          className="group grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end"
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-[#d8d2c7]">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition duration-1000 group-hover:scale-105"
            />

            <div className="absolute left-5 top-5 bg-[#111] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
              {post.category}
            </div>
          </div>

          <div className="pb-2">
            <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-black/35">
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>

            <h2 className="mt-6 font-serif text-5xl leading-[0.88] tracking-[-0.05em] sm:text-7xl">
              {post.title}
            </h2>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-black/60">
              {post.excerpt}
            </p>

            <div className="mt-9 text-xs font-semibold uppercase tracking-[0.2em] underline decoration-black/30 underline-offset-8 transition group-hover:decoration-black">
              Read story
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}