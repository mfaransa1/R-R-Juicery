import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { events } from "@/data/events";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return events.map((event) => ({
    slug: event.slug,
  }));
}

export default async function EventDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const event = events.find((item) => item.slug === slug);

  if (!event) {
    notFound();
  }

  return (
    <main className="bg-[#f5f1e8] text-[#111]">
      <section className="mx-auto max-w-[1440px] px-5 pb-20 pt-32 sm:px-8 lg:px-14 lg:pt-40">
        <Link
          href="/events"
          className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/45 hover:text-black"
        >
          ← Back to events
        </Link>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_0.42fr] lg:items-end">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="bg-[#111] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-white">
                {event.identity}
              </span>

              <span className="border border-black/15 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.18em]">
                {event.category}
              </span>
            </div>

            <h1 className="mt-7 max-w-5xl font-serif text-[clamp(4rem,9vw,9rem)] leading-[0.78] tracking-[-0.065em]">
              {event.title}
            </h1>
          </div>

          <div className="border-l border-black/15 pl-6 lg:pl-8">
            <div className="space-y-5 text-sm">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-black/35">
                  DATE
                </p>
                <p className="mt-2">{event.date}</p>
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-black/35">
                  TIME
                </p>
                <p className="mt-2">{event.time}</p>
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-black/35">
                  LOCATION
                </p>
                <p className="mt-2">{event.location}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-16 aspect-[16/8] overflow-hidden bg-[#d8d2c7]">
          <Image
            src={event.image}
            alt={event.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      </section>

      <section className="bg-white px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto grid max-w-5xl gap-14 lg:grid-cols-[1fr_0.35fr]">
          <div>
            <p className="text-xl leading-[1.7] text-black/70 sm:text-2xl">
              {event.description}
            </p>

            <div className="my-12 h-px bg-black/10" />

            <h2 className="font-serif text-4xl tracking-[-0.04em]">
              Event information
            </h2>

            <p className="mt-6 text-base leading-[1.9] text-black/60">
              EVENT DETAILS — REQUIRED INPUT
            </p>

            <p className="mt-5 text-base leading-[1.9] text-black/60">
              Add the final event description, programme, registration
              requirements, pricing and any booking instructions here.
            </p>
          </div>

          <aside className="h-fit border border-black/10 p-7">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-black/35">
              STATUS
            </p>

            <p className="mt-3 font-serif text-3xl">
              {event.status ?? "UPCOMING"}
            </p>

            <div className="my-7 h-px bg-black/10" />

            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-black/35">
              LOCATION
            </p>

            <p className="mt-3 text-sm leading-relaxed text-black/60">
              {event.location}
            </p>
          </aside>
        </div>
      </section>

      <section className="bg-[#111] px-5 py-20 text-white sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-col justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/35">
              THE HOUSE
            </p>

            <h2 className="mt-3 font-serif text-4xl tracking-[-0.04em]">
              More from the calendar.
            </h2>
          </div>

          <Link
            href="/events"
            className="w-fit border border-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition hover:bg-white hover:text-black"
          >
            All events
          </Link>
        </div>
      </section>
    </main>
  );
}