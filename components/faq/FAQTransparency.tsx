"use client";

import Image from "next/image";
import Link from "next/link";

export default function FAQTransparency() {
  return (
    <section className="bg-white py-24 text-[#111] lg:py-32">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_0.7fr] lg:items-center lg:px-14">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src="/images/faq/transparency.jpg"
            alt="Fresh juice preparation"
            fill
            className="object-cover transition duration-700 hover:scale-105"
          />

          <div className="absolute left-5 top-5 bg-[#111] px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-white">
            KNOW YOUR JUICE
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
            OUR PROMISE
          </p>

          <h2 className="mt-6 font-serif text-5xl leading-[0.88] tracking-[-0.05em] sm:text-7xl">
            We don&apos;t just
            <br />
            tell you.
            <br />
            We show you.
          </h2>

          <p className="mt-8 text-lg leading-relaxed text-black/60">
            Product information is designed around visible
            preparation, ingredients, sourcing, additives,
            concentrates, freshness and storage.
          </p>

          <Link
            href="/ingredients"
            className="mt-8 inline-flex border border-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition hover:bg-black hover:text-white"
          >
            Explore ingredients
          </Link>
        </div>
      </div>
    </section>
  );
}