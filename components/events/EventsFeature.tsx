"use client";

import Image from "next/image";
import Link from "next/link";
import { events } from "@/data/events";

export default function EventsFeature() {
  const featured = events.filter((event) => event.featured);

  return (
    <section className="bg-white py-24 text-[#111] lg:py-36">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
            HOUSE HIGHLIGHTS
          </p>

          <h2 className="mt-5 font-serif text-6xl leading-[0.84] tracking-[-0.055em] sm:text-8xl">
            Regular moves.
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {featured.map((event, index) => (
            <Link
              key={event.slug}
              href={`/events/${event.slug}`}
              className="group relative min-h-[580px] overflow-hidden"
            >
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover transition duration-1000 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-10">
                <div className="mb-5 flex items-center gap-3">
                  <span className="border border-white/30 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.18em]">
                    {event.identity}
                  </span>

                  <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50">
                    {index === 0 ? "FEATURED" : "RECURRING"}
                  </span>
                </div>

                <h3 className="font-serif text-5xl leading-[0.85] tracking-[-0.05em] sm:text-7xl">
                  {event.title}
                </h3>

                <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65">
                  {event.description}
                </p>

                <span className="mt-7 inline-block text-[10px] font-semibold uppercase tracking-[0.2em] underline underline-offset-8">
                  Explore
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}