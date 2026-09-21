"use client";

import Image from "next/image";
import Link from "next/link";

export default function VisitClosing() {
  return (
    <section className="relative min-h-[68vh] overflow-hidden bg-[#111] text-white">
      <Image
        src="/images/visit/visit-closing.jpg"
        alt="The Rook & Reed Juicery"
        fill
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 mx-auto flex min-h-[68vh] max-w-[1440px] items-end px-5 pb-12 sm:px-8 lg:px-14 lg:pb-20">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
            ROOK & REED JUICERY
          </p>

          <h2 className="mt-6 font-serif text-[clamp(4rem,10vw,9rem)] leading-[0.78] tracking-[-0.065em]">
            Good juice.
            <br />
            Good place.
          </h2>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/menu"
              className="border border-white bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] !text-black transition hover:bg-transparent hover:!text-white"
            >
              See the menu
            </Link>

            <Link
              href="/events"
              className="border border-white/40 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white"
            >
              Events
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}