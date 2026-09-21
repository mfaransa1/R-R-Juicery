"use client";

import Image from "next/image";
import Link from "next/link";

export default function ChessSaturday() {
  return (
    <section className="bg-[#f5f1e8] text-[#111]">
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative min-h-[620px] overflow-hidden">
          <Image
            src="/images/chess/saturday.jpg"
            alt="Chess tournament at SHoP Saturday"
            fill
            className="object-cover transition duration-1000 hover:scale-105"
          />

          <div className="absolute inset-0 bg-black/20" />

          <div className="absolute bottom-8 left-6 right-6 sm:left-10 sm:right-10">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              EVERY SATURDAY
            </p>

            <h2 className="mt-3 font-serif text-6xl leading-[0.85] tracking-[-0.05em] text-white sm:text-8xl">
              SHoP
              <br />
              SATURDAY.
            </h2>
          </div>
        </div>

        <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">
              COMPETITION / COMMUNITY
            </p>

            <h3 className="mt-8 max-w-lg font-serif text-5xl leading-[0.9] tracking-[-0.045em] sm:text-6xl">
              Bring your board face.
            </h3>

            <p className="mt-8 max-w-lg text-lg leading-relaxed text-black/65">
              Saturdays turn the chess side of The House into a
              meeting point for players, learners, young competitors
              and people who simply want to watch a good game unfold.
            </p>
          </div>

          <div className="mt-14 border-t border-black/15 pt-7">
            <p className="text-sm leading-relaxed text-black/55">
              Tournament programming is part of the SHoP chess
              community. Check the events schedule for the latest
              Saturday details.
            </p>

            <Link
              href="/events"
              className="mt-7 inline-flex border border-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition hover:bg-black hover:text-white"
            >
              View events
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}