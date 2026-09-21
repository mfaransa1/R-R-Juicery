"use client";

import Image from "next/image";
import Link from "next/link";

export default function ChessClosing() {
  return (
    <section className="relative min-h-[75vh] overflow-hidden bg-[#111] text-white">
      <Image
        src="/images/chess/chess-closing.jpg"
        alt="Chess pieces at The House"
        fill
        className="object-cover"
      />

      <video
        className="absolute inset-0 h-full w-full object-cover opacity-45"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/chess/chess-closing.jpg"
      >
        <source src="/videos/chess/chess-closing.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 mx-auto flex min-h-[75vh] max-w-[1440px] items-end px-5 pb-12 sm:px-8 lg:px-14 lg:pb-20">
        <div className="max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
            THE HOUSE / SHoP
          </p>

          <h2 className="mt-6 font-serif text-[clamp(4rem,11vw,10rem)] leading-[0.78] tracking-[-0.065em]">
            Make
            <br />
            your move.
          </h2>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/events"
              className="border border-white bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] !text-black transition hover:bg-transparent hover:!text-white"
            >
              See events
            </Link>

            <Link
              href="/house"
              className="border border-white/40 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition hover:border-white"
            >
              Explore The House
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}