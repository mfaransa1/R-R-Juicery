"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Loader2,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  getPublicJazzEvents,
  type PublicJazzEvent,
} from "@/lib/supabase/publicEvents";

function eventDate(event: PublicJazzEvent) {
  if (event.date_label) return event.date_label;

  if (!event.starts_at) return "Date to be announced";

  return new Intl.DateTimeFormat("en-KE", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(event.starts_at));
}

function eventTime(event: PublicJazzEvent) {
  if (event.time_label) return event.time_label;

  if (!event.starts_at) return "Time to be announced";

  return new Intl.DateTimeFormat("en-KE", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(event.starts_at));
}

function eventTimestamp(event: PublicJazzEvent) {
  return event.starts_at ? new Date(event.starts_at).getTime() : Number.POSITIVE_INFINITY;
}

function imageFor(event: PublicJazzEvent) {
  return event.image_path || "/images/jazz/live-session.jpg";
}

export default function JazzSessions() {
  const [events, setEvents] = useState<PublicJazzEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"upcoming" | "featured" | "all">("upcoming");
  const [now, setNow] = useState(() => Date.now());

  async function loadEvents(showRefresh = false) {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    setError("");

    try {
      const data = await getPublicJazzEvents();
      setEvents(data);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load the Reed programme.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void loadEvents();

    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 30_000);

    return () => window.clearInterval(interval);
  }, []);

  const upcoming = useMemo(
    () =>
      events
        .filter((event) => {
          if (!event.starts_at) return true;
          return eventTimestamp(event) >= now;
        })
        .sort((a, b) => eventTimestamp(a) - eventTimestamp(b)),
    [events, now],
  );

  const visibleEvents = useMemo(() => {
    if (filter === "featured") {
      return upcoming.filter((event) => event.featured);
    }

    if (filter === "all") {
      return upcoming;
    }

    return upcoming.slice(0, 3);
  }, [filter, upcoming]);

  const nextEvent = upcoming[0] ?? null;

  return (
    <section className="bg-[#f5f1e8] py-24 text-[#111] lg:py-36">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="flex flex-col justify-between gap-8 border-b border-black/15 pb-10 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
              THE PROGRAMME
            </p>

            <h2 className="mt-6 max-w-3xl font-serif text-6xl leading-[0.84] tracking-[-0.06em] sm:text-8xl">
              Music is
              <br />
              an event.
            </h2>

            <p className="mt-7 max-w-xl text-base leading-relaxed text-black/55">
              The Reed programme is connected directly to the live R&R events
              calendar. When staff publish a session in the House, it appears
              here.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void loadEvents(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 border border-black/15 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] transition hover:border-black disabled:opacity-50"
            >
              <RefreshCw
                size={13}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <Link
              href="/events"
              className="inline-flex items-center gap-2 border border-black bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] !text-white transition hover:bg-white hover:text-black"
            >
              All events
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {nextEvent && (
          <div className="mt-8 grid gap-px border border-black/10 bg-black/10 md:grid-cols-[0.9fr_1.1fr]">
            <div className="bg-[#111] p-7 text-white sm:p-9">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
                NEXT AT THE REED
              </p>

              <p className="mt-5 font-serif text-4xl leading-none tracking-[-0.04em]">
                {nextEvent.title}
              </p>

              <div className="mt-7 space-y-3 text-sm text-white/60">
                <p className="flex items-center gap-3">
                  <CalendarDays size={15} />
                  {eventDate(nextEvent)}
                </p>

                <p className="flex items-center gap-3">
                  <Clock3 size={15} />
                  {eventTime(nextEvent)}
                </p>

                {nextEvent.location && (
                  <p className="flex items-center gap-3">
                    <MapPin size={15} />
                    {nextEvent.location}
                  </p>
                )}
              </div>

              <Link
                href={`/events/${nextEvent.slug}`}
                className="mt-8 inline-flex items-center gap-2 border border-white/30 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] transition hover:border-white"
              >
                View session
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="relative min-h-[260px] overflow-hidden bg-[#d8d2c7]">
              <Image
                src={imageFor(nextEvent)}
                alt={nextEvent.title}
                fill
                sizes="(max-width: 768px) 100vw, 55vw"
                className="object-cover transition duration-700 hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/75">
                THE REED / LIVE PROGRAMME
              </div>
            </div>
          </div>
        )}

        <div className="mt-14 flex flex-wrap items-center gap-2">
          {[
            ["upcoming", "Next sessions"],
            ["featured", "Featured"],
            ["all", "All upcoming"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                setFilter(value as "upcoming" | "featured" | "all")
              }
              className={[
                "border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] transition",
                filter === value
                  ? "border-black bg-black text-white"
                  : "border-black/15 bg-transparent text-black hover:border-black",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-8 border-t border-black/15">
          {loading ? (
            <div className="flex min-h-[260px] items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.18em]">
              <Loader2 size={15} className="animate-spin" />
              Loading the Reed programme
            </div>
          ) : error ? (
            <div className="border-b border-black/15 py-12">
              <p className="text-sm text-red-900">{error}</p>
              <button
                type="button"
                onClick={() => void loadEvents(true)}
                className="mt-5 border border-black px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em]"
              >
                Try again
              </button>
            </div>
          ) : visibleEvents.length === 0 ? (
            <div className="border-b border-black/15 py-16">
              <p className="font-serif text-4xl tracking-[-0.04em]">
                Nothing scheduled yet.
              </p>
              <p className="mt-3 max-w-lg text-sm leading-6 text-black/55">
                New Reed sessions will appear here when they are published to
                the R&R events calendar.
              </p>
            </div>
          ) : (
            visibleEvents.map((event, index) => (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="group grid gap-7 border-b border-black/15 py-9 transition-colors hover:bg-black/[0.025] md:grid-cols-[70px_0.75fr_1fr_280px] md:items-center md:px-3"
              >
                <span className="text-xs tracking-[0.2em] text-black/35">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-black/35">
                    {event.featured ? "Featured / The Reed" : "The Reed"}
                  </p>
                  <h3 className="mt-2 font-serif text-3xl tracking-[-0.04em] sm:text-4xl">
                    {event.title}
                  </h3>
                </div>

                <div>
                  <p className="text-sm leading-6 text-black/60">
                    {event.description || "A Rook & Reed session in the House."}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-black/40">
                    <span>{eventDate(event)}</span>
                    <span>{eventTime(event)}</span>
                    {event.location && <span>{event.location}</span>}
                  </div>
                </div>

                <div className="relative aspect-[16/10] overflow-hidden bg-[#d8d2c7]">
                  <Image
                    src={imageFor(event)}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 280px"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
              </Link>
            ))
          )}
        </div>

        {!loading && !error && upcoming.length > 3 && (
          <div className="mt-8 text-right">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] underline underline-offset-4"
            >
              Browse the full programme
              <ArrowRight size={13} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
