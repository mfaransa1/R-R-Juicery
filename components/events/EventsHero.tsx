"use client";

import Image from "next/image";
import Link from "next/link";

export default function EventsHero() {
  return (
    <section className="relative min-h-[88vh] overflow-hidden bg-[#111] text-white">
      <Image
        src="/images/events/events-hero.jpg"
        alt="Events at The House"
        fill
        priority
        className="object-cover"
      />

      <video
        className="absolute inset-0 h-full w-full object-cover opacity-45"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/events/events-hero.jpg"
      >
        <source src="/videos/events/events-hero.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/30" />

      <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-[1440px] items-end px-5 pb-12 sm:px-8 lg:px-14 lg:pb-20">
        <div className="max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/50">
            THE HOUSE / EVENTS
          </p>

          <h1 className="mt-6 font-serif text-[clamp(4.8rem,13vw,12rem)] leading-[0.76] tracking-[-0.07em]">
            COME.
          </h1>

          <div className="mt-9 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <p className="max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
              Music, chess, books, conversation and gatherings around
              the things that make The House worth returning to.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="#calendar"
                className="border border-white bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] !text-black transition hover:bg-transparent hover:!text-white"
              >
                Explore events
              </Link>

              <Link
                href="/visit"
                className="border border-white/40 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white"
              >
                Visit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}