"use client";

import Link from "next/link";

export default function VisitMap() {
  return (
    <section className="bg-[#d8d2c7] py-24 text-[#111] lg:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
              WHERE TO FIND US
            </p>

            <h2 className="mt-6 font-serif text-6xl leading-[0.84] tracking-[-0.055em] sm:text-8xl">
              Kilimani.
            </h2>

            <p className="mt-8 max-w-md text-lg leading-relaxed text-black/60">
              Rook & Reed Plaza, Kilimani, Nairobi.
            </p>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-black/45">
              Detailed directions, parking information and the exact
              map pin can be added here once the final location
              details are confirmed.
            </p>

            <Link
              href="/contact"
              className="mt-8 inline-flex border border-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition hover:bg-black hover:text-white"
            >
              Contact R&R
            </Link>
          </div>

          <div className="relative min-h-[460px] overflow-hidden bg-[#bdb6aa]">
            {/* Replace this placeholder with the final map embed or branded map graphic. */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute left-[15%] top-[20%] h-px w-[70%] rotate-[12deg] bg-black" />
              <div className="absolute left-[5%] top-[55%] h-px w-[90%] rotate-[-8deg] bg-black" />
              <div className="absolute left-[25%] top-[10%] h-[90%] w-px rotate-[18deg] bg-black" />
              <div className="absolute left-[70%] top-[5%] h-[100%] w-px rotate-[65deg] bg-black" />
              <div className="absolute left-[45%] top-[45%] h-24 w-24 rounded-full border border-black" />
            </div>

            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-black bg-[#f5f1e8] shadow-xl">
                <span className="h-3 w-3 rounded-full bg-black" />
              </div>

              <div className="mt-3 bg-[#111] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                R&R / KILIMANI
              </div>
            </div>

            <div className="absolute bottom-5 left-5 text-[9px] uppercase tracking-[0.2em] text-black/40">
              MAP / LOCATION
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}