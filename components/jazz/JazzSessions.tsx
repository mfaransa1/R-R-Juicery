"use client";

import Image from "next/image";
import Link from "next/link";

const sessions = [
  {
    number: "01",
    title: "SUNDAY SESSIONS",
    text: "A slower Sunday rhythm: juice, conversation and carefully selected music.",
    image: "/images/jazz/sunday-session.jpg",
  },
  {
    number: "02",
    title: "VINYL EVENINGS",
    text: "Records played the old-fashioned way — one side at a time.",
    image: "/images/jazz/vinyl-evening.jpg",
  },
  {
    number: "03",
    title: "LIVE SESSIONS",
    text: "Intimate performances and musical encounters when the programme allows.",
    image: "/images/jazz/live-session.jpg",
  },
];

export default function JazzSessions() {
  return (
    <section className="bg-[#f5f1e8] py-24 text-[#111] lg:py-36">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
              THE PROGRAMME
            </p>

            <h2 className="mt-6 max-w-3xl font-serif text-6xl leading-[0.84] tracking-[-0.06em] sm:text-8xl">
              Music is
              <br />
              an event.
            </h2>
          </div>

          <Link
            href="/events"
            className="w-fit border border-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition hover:bg-black hover:text-white"
          >
            All events
          </Link>
        </div>

        <div className="mt-20 border-t border-black/15">
          {sessions.map((session) => (
            <article
              key={session.number}
              className="group grid gap-8 border-b border-black/15 py-10 md:grid-cols-[70px_0.8fr_1fr_320px] md:items-center"
            >
              <span className="text-xs tracking-[0.2em] text-black/35">
                {session.number}
              </span>

              <h3 className="font-serif text-4xl tracking-[-0.04em]">
                {session.title}
              </h3>

              <p className="max-w-xl text-base leading-relaxed text-black/60">
                {session.text}
              </p>

              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={session.image}
                  alt={session.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}