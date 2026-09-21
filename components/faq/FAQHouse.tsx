"use client";

import Image from "next/image";
import Link from "next/link";

export default function FAQHouse() {
  return (
    <section className="bg-[#d8d2c7] py-24 text-[#111] lg:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="grid gap-5 md:grid-cols-2">
          <Link
            href="/house"
            className="group relative min-h-[480px] overflow-hidden"
          >
            <Image
              src="/images/faq/house.jpg"
              alt="The House"
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/45" />

            <div className="absolute inset-x-0 bottom-0 p-8 text-white sm:p-10">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/45">
                R&R
              </p>

              <h2 className="mt-3 font-serif text-5xl tracking-[-0.045em]">
                The House
              </h2>

              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/65">
                Juice, jazz, books, conversation and hospitality.
              </p>
            </div>
          </Link>

          <Link
            href="/chess"
            className="group relative min-h-[480px] overflow-hidden"
          >
            <Image
              src="/images/faq/chess.jpg"
              alt="SHoP chess"
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/45" />

            <div className="absolute inset-x-0 bottom-0 p-8 text-white sm:p-10">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/45">
                SHoP
              </p>

              <h2 className="mt-3 font-serif text-5xl tracking-[-0.045em]">
                Chess
              </h2>

              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/65">
                Chess, youth, learning, community and competition.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}