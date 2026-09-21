"use client";

import Link from "next/link";

const topics = [
  {
    title: "JUICE",
    description:
      "What we press, blend, pour and learn along the way.",
    href: "/menu",
    number: "01",
  },
  {
    title: "INGREDIENTS",
    description:
      "The fruits, vegetables, herbs and stories behind the bottle.",
    href: "/ingredients",
    number: "02",
  },
  {
    title: "THE REED",
    description:
      "Jazz, records, artists, listening and the sound of the House.",
    href: "/jazz",
    number: "03",
  },
  {
    title: "SHoP",
    description:
      "Chess, youth, learning, community and competition.",
    href: "/chess",
    number: "04",
  },
  {
    title: "THE HOUSE",
    description:
      "The people, objects, books and details that make the place.",
    href: "/house",
    number: "05",
  },
];

export default function JournalTopics() {
  return (
    <section className="bg-[#d8d2c7] py-24 text-[#111] lg:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
              EXPLORE
            </p>

            <h2 className="mt-5 font-serif text-6xl leading-[0.84] tracking-[-0.055em] sm:text-8xl">
              Follow
              <br />
              a thread.
            </h2>
          </div>

          <div className="border-t border-black/15">
            {topics.map((topic) => (
              <Link
                href={topic.href}
                key={topic.number}
                className="group grid grid-cols-[45px_1fr_30px] items-center gap-4 border-b border-black/15 py-7 transition hover:px-3"
              >
                <span className="text-[10px] tracking-[0.2em] text-black/30">
                  {topic.number}
                </span>

                <div>
                  <h3 className="font-serif text-3xl tracking-[-0.035em] sm:text-4xl">
                    {topic.title}
                  </h3>

                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-black/50">
                    {topic.description}
                  </p>
                </div>

                <span className="text-xl transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}