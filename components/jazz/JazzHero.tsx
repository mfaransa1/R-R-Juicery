"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function JazzHero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 120);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-[#111] text-white">
      <Image
        src="/images/jazz/jazz-hero.jpg"
        alt="The Reed jazz room"
        fill
        priority
        className="object-cover object-center scale-[1.03]"
      />

      <video
        className="absolute inset-0 h-full w-full object-cover opacity-50"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/jazz/jazz-hero.jpg"
      >
        <source src="/videos/jazz/jazz-hero.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-black/25" />

      {/* Ambient record */}
      <div className="absolute -right-32 top-1/2 hidden h-[600px] w-[600px] -translate-y-1/2 rounded-full border border-white/10 lg:block">
        <div className="absolute inset-[45px] rounded-full border border-white/10" />
        <div className="absolute inset-[110px] rounded-full border border-white/10" />
        <div className="absolute inset-[180px] rounded-full border border-white/10" />
        <div className="absolute inset-[250px] rounded-full border border-white/10" />
        <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-[1440px] items-end px-5 pb-12 sm:px-8 lg:px-14 lg:pb-20">
        <div
          className={`max-w-6xl transition-all duration-1000 ${
            loaded
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-white/55">
            THE REED / JAZZ / LISTENING
          </p>

          <h1 className="font-serif text-[clamp(5rem,14vw,13rem)] leading-[0.75] tracking-[-0.07em]">
            LISTEN.
          </h1>

          <div className="mt-9 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <p className="max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl">
              Jazz, records, conversation and the slower pleasure of
              sitting with music.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="#now-playing"
                className="border border-white bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] !text-black transition hover:bg-transparent hover:!text-white"
              >
                Now playing
              </Link>

              <Link
                href="/events"
                className="border border-white/40 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:border-white"
              >
                Sessions
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-7 right-7 z-10 hidden text-right text-[10px] uppercase tracking-[0.25em] text-white/45 md:block">
        THE REED
        <br />
        MUSIC / CULTURE
        <br />
        KILIMANI
      </div>
    </section>
  );
}