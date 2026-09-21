"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { events, type EventIdentity } from "@/data/events";

type Filter = "ALL" | EventIdentity | "MUSIC" | "CHESS" | "BOOKS";

export default function EventCalendar() {
  const [filter, setFilter] = useState<Filter>("ALL");

  const filters: Filter[] = [
    "ALL",
    "R&R",
    "SHoP",
    "MUSIC",
    "CHESS",
    "BOOKS",
  ];

  const filteredEvents =
    filter === "ALL"
      ? events
      : events.filter((event) => {
          if (filter === "R&R" || filter === "SHoP") {
            return event.identity === filter;
          }

          return event.category === filter;
        });

  return (
    <section
      id="calendar"
      className="bg-[#f5f1e8] py-24 text-[#111] lg:py-36"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="flex flex-col justify-between gap-8 border-b border-black/15 pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
              THE CALENDAR
            </p>

            <h2 className="mt-5 font-serif text-6xl leading-[0.84] tracking-[-0.055em] sm:text-8xl">
              What&apos;s
              <br />
              happening.
            </h2>
          </div>

          <div className="flex max-w-2xl flex-wrap gap-x-5 gap-y-3">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`text-[10px] font-semibold uppercase tracking-[0.18em] transition ${
                  filter === item
                    ? "text-black underline underline-offset-8"
                    : "text-black/35 hover:text-black"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <Link
              key={event.slug}
              href={`/events/${event.slug}`}
              className="group"
            >
              <article>
                <div className="relative aspect-[4/3] overflow-hidden bg-[#d8d2c7]">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute left-4 top-4 flex gap-2">
                    <span className="bg-[#111] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-white">
                      {event.identity}
                    </span>

                    <span className="bg-[#f5f1e8] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.18em]">
                      {event.category}
                    </span>
                  </div>

                  {event.status && (
                    <span className="absolute bottom-4 right-4 bg-white/90 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.18em]">
                      {event.status}
                    </span>
                  )}
                </div>

                <div className="border-b border-black/15 py-6">
                  <div className="flex flex-wrap gap-3 text-[9px] uppercase tracking-[0.2em] text-black/35">
                    <span>{event.date}</span>
                    <span>•</span>
                    <span>{event.time}</span>
                  </div>

                  <h3 className="mt-4 font-serif text-3xl leading-[0.92] tracking-[-0.035em]">
                    {event.title}
                  </h3>

                  <p className="mt-4 text-sm leading-relaxed text-black/55">
                    {event.description}
                  </p>

                  <span className="mt-5 inline-block text-[10px] font-semibold uppercase tracking-[0.18em] underline underline-offset-8">
                    Event details
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="border-b border-black/15 py-20 text-center">
            <p className="font-serif text-4xl">
              No events in this filter yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}