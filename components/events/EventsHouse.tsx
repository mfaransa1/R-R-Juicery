"use client";

import Image from "next/image";
import Link from "next/link";

export default function EventsHouse() {
  return (
    <section className="bg-[#d8d2c7] py-24 text-[#111] lg:py-36">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
              TWO IDENTITIES
            </p>

            <h2 className="mt-6 font-serif text-6xl leading-[0.83] tracking-[-0.055em] sm:text-8xl">
              One
              <br />
              building.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Link
              href="/jazz"
              className="group relative min-h-[480px] overflow-hidden"
            >
              <Image
                src="/images/events/rr-events.jpg"
                alt="R&R events at The House"
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/45" />

              <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9">
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/50">
                  R&R
                </p>

                <h3 className="mt-3 font-serif text-5xl tracking-[-0.045em]">
                  The House
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-white/65">
                  Juice, jazz, books, conversation and hospitality.
                </p>
              </div>
            </Link>

            <Link
              href="/chess"
              className="group relative min-h-[480px] overflow-hidden"
            >
              <Image
                src="/images/events/shop-events.jpg"
                alt="SHoP chess events"
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/45" />

              <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9">
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/50">
                  SHoP
                </p>

                <h3 className="mt-3 font-serif text-5xl tracking-[-0.045em]">
                  Chess
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-white/65">
                  Chess, youth, learning, community and competition.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}