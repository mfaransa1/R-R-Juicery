"use client";

import { useState } from "react";
import { CalendarDays, Plus } from "lucide-react";
import { events } from "@/data/events";

export default function AdminEvents() {
  const [filter, setFilter] = useState<
    "ALL" | "R&R" | "SHoP"
  >("ALL");

  const filtered =
    filter === "ALL"
      ? events
      : events.filter((event) => event.identity === filter);

  return (
    <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <div className="flex flex-col gap-6 border-b border-black/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-black/35">
            OPERATIONS / PROGRAMMING
          </p>

          <h1 className="mt-3 font-serif text-5xl tracking-[-0.045em]">
            Events.
          </h1>

          <p className="mt-3 text-sm text-black/45">
            Manage the R&R and SHoP programme.
          </p>
        </div>

        <button
          type="button"
          className="flex w-fit items-center gap-3 bg-black px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white"
        >
          <Plus size={15} strokeWidth={1.3} />
          Add event
        </button>
      </div>

      <div className="mt-8 flex gap-2">
        {(["ALL", "R&R", "SHoP"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`px-4 py-2 text-[8px] font-semibold uppercase tracking-[0.15em] ${
              filter === item
                ? "bg-black text-white"
                : "border border-black/10 text-black/40"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-px border border-black/10 bg-black/10 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((event) => (
          <article
            key={event.slug}
            className="bg-white p-6"
          >
            <div className="flex items-start justify-between">
              <span className="border border-black/10 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.13em]">
                {event.identity}
              </span>

              <CalendarDays
                size={18}
                strokeWidth={1.3}
                className="text-black/25"
              />
            </div>

            <h2 className="mt-12 font-serif text-3xl tracking-[-0.035em]">
              {event.title}
            </h2>

            <p className="mt-3 text-xs leading-relaxed text-black/45">
              {event.description}
            </p>

            <div className="mt-7 border-t border-black/10 pt-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-black/30">
                    Date
                  </p>

                  <p className="mt-2 text-xs text-black/60">
                    {event.date}
                  </p>
                </div>

                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-black/30">
                    Time
                  </p>

                  <p className="mt-2 text-xs text-black/60">
                    {event.time}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <span className="border border-black/10 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.13em] text-black/45">
                {event.category}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}