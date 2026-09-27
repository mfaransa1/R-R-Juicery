"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getPublicEvents, type ContentEvent } from "@/lib/supabase/content";

export default function PublicEvents() {
  const [events, setEvents] = useState<ContentEvent[]>([]);
  const [category, setCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getPublicEvents();
      setEvents(data);
    } catch (err) {
      setEvents([]);
      setError(err instanceof Error ? err.message : "Unable to load events.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const categories = useMemo(
    () => [
      "ALL",
      ...Array.from(
        new Set(events.map((event) => event.category).filter(Boolean)),
      ),
    ],
    [events],
  );

  const visible =
    category === "ALL"
      ? events
      : events.filter((event) => event.category === category);

  return (
    <main className="bg-[var(--rr-paper)]">
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-[1440px] px-5 pb-16 pt-24 sm:px-8 lg:px-14 lg:pb-20 lg:pt-32">
          <p className="rr-kicker">THE R&R CALENDAR</p>
          <h1 className="rr-editorial mt-5 max-w-5xl text-6xl leading-[.88] sm:text-8xl">
            Come for the
            <br />
            juice. Stay for
            <br />
            the room.
          </h1>
          <p className="mt-8 max-w-xl text-sm leading-7 text-black/60">
            Jazz, chess, books, tastings, workshops and community moments at
            Rook & Reed. Current listings are published from the R&R events
            calendar.
          </p>

          <div className="mt-10 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={[
                  "border px-4 py-2 text-[10px] font-semibold uppercase tracking-[.14em]",
                  category === item
                    ? "border-black bg-black !text-white"
                    : "border-black/15 hover:border-black",
                ].join(" ")}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-14 lg:py-20">
          {error ? (
            <div className="border border-red-900/20 bg-red-50 p-5 text-sm text-red-900">
              <p className="font-semibold">The events calendar could not be loaded.</p>
              <p className="mt-2 leading-6">{error}</p>
              <button
                type="button"
                onClick={() => void load()}
                className="mt-4 inline-flex items-center gap-2 border border-red-900/25 px-4 py-2 text-[10px] font-semibold uppercase tracking-[.14em]"
              >
                <RefreshCw size={13} />
                Try again
              </button>
            </div>
          ) : null}

          {loading ? (
            <div className="flex min-h-[35vh] items-center justify-center">
              <p className="text-[10px] font-semibold uppercase tracking-[.2em]">
                Loading calendar
              </p>
            </div>
          ) : !error && visible.length ? (
            <div className="grid gap-px bg-black/10 md:grid-cols-2">
              {visible.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="group bg-[var(--rr-paper)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#e7e2d8]">
                    {event.image_path ? (
                      <Image
                        src={event.image_path}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(168,135,82,.28),transparent_35%),#e7e2d8]" />
                    )}
                  </div>

                  <div className="p-7 sm:p-9">
                    <div className="flex items-center justify-between gap-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-black/40">
                        {event.category}
                      </p>
                      <p className="text-[10px] font-semibold uppercase tracking-[.15em] text-black/40">
                        {event.starts_at
                          ? new Date(event.starts_at).toLocaleDateString(
                              "en-KE",
                              { day: "2-digit", month: "short", year: "numeric" },
                            )
                          : event.date_label || "TBC"}
                      </p>
                    </div>

                    <h2 className="mt-4 font-serif text-4xl">{event.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-black/55">
                      {event.description}
                    </p>

                    <div className="mt-7 flex items-center justify-between border-t border-black/10 pt-5 text-xs text-black/50">
                      <span>{event.location || "Rook & Reed"}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : !error ? (
            <div className="border border-black/10 bg-white p-10 text-center text-sm text-black/50">
              No published events in this category.
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
