"use client";

import Image from "next/image";
import Link from "next/link";

export default function VisitHouse() {
  return (
    <section className="relative min-h-[78vh] overflow-hidden bg-[#111] text-white">
      <Image
        src="/images/visit/house.jpg"
        alt="Inside The House"
        fill
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-[1440px] items-end px-5 pb-12 sm:px-8 lg:px-14 lg:pb-20">
        <div className="grid w-full gap-10 lg:grid-cols-[1fr_0.5fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
              THE HOUSE
            </p>

            <h2 className="mt-6 font-serif text-[clamp(4rem,10vw,9rem)] leading-[0.78] tracking-[-0.065em]">
              Stay
              <br />
              awhile.
            </h2>
          </div>

          <div className="border-l border-white/20 pl-6 lg:pl-8">
            <p className="text-lg leading-relaxed text-white/65">
              Juice in your hand. Music in the room. A book nearby.
              A chess board somewhere in the building. Good company
              if you want it.
            </p>

            <Link
              href="/house"
              className="mt-8 inline-flex border border-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition hover:bg-white hover:text-black"
            >
              Explore The House
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}