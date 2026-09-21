"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ChessHero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-[#111] text-white">
      {/* Background image */}
      <Image
        src="/images/chess/chess-hero.jpg"
        alt="Chess being played at SHoP"
        fill
        priority
        className="object-cover object-center scale-[1.04]"
      />

      {/* Optional cinematic video — add the file manually */}
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-55"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/chess/chess-hero.jpg"
      >
        <source src="/videos/chess/chess-hero.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/20" />

      {/* Moving board atmosphere */}
      <div className="absolute -right-24 top-1/2 hidden h-[620px] w-[620px] -translate-y-1/2 rotate-12 opacity-[0.10] lg:block">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(45deg,#fff 25%,transparent 25%,transparent 75%,#fff 75%),linear-gradient(45deg,#fff 25%,transparent 25%,transparent 75%,#fff 75%)",
            backgroundPosition: "0 0, 70px 70px",
            backgroundSize: "140px 140px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-[1440px] items-end px-5 pb-12 sm:px-8 lg:px-14 lg:pb-20">
        <div
          className={`max-w-5xl transition-all duration-1000 ${
            loaded
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-white/65">
            SHoP / Chess / Community
          </p>

          <h1 className="font-serif text-[clamp(4.5rem,13vw,12rem)] leading-[0.78] tracking-[-0.065em]">
            PLAY.
          </h1>

          <div className="mt-8 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <p className="max-w-xl text-lg leading-relaxed text-white/80 sm:text-xl">
              Chess, youth, learning, community and competition —
              all finding a place inside The House.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="#board"
                className="border border-white bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] !text-black transition hover:bg-transparent hover:!text-white"
              >
                Make a move
              </Link>

              <Link
                href="/events"
                className="border border-white/40 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition hover:border-white"
              >
                Saturday
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-7 right-7 z-10 hidden text-right text-[10px] uppercase tracking-[0.25em] text-white/50 md:block">
        THE HOUSE
        <br />
        TWO IDENTITIES
        <br />
        ONE BUILDING
      </div>
    </section>
  );
}