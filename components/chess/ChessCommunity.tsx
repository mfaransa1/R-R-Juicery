"use client";

import Image from "next/image";

const areas = [
  {
    number: "01",
    title: "YOUTH",
    text: "A place where younger players can discover the game, build confidence and meet other people who play.",
    image: "/images/chess/youth.jpg",
  },
  {
    number: "02",
    title: "LEARNING",
    text: "From first moves to deeper study, the board becomes a tool for patience, pattern recognition and conversation.",
    image: "/images/chess/learning.jpg",
  },
  {
    number: "03",
    title: "COMMUNITY",
    text: "Chess does something unusual: it gives strangers an immediate reason to sit down together.",
    image: "/images/chess/community.jpg",
  },
];

export default function ChessCommunity() {
  return (
    <section className="bg-[#d8d2c7] py-24 text-[#111] lg:py-36">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/45">
              MORE THAN A GAME
            </p>

            <h2 className="mt-6 font-serif text-6xl leading-[0.85] tracking-[-0.055em] sm:text-8xl">
              Learn.
              <br />
              Play.
              <br />
              Return.
            </h2>
          </div>

          <div className="flex items-end">
            <p className="max-w-2xl text-xl leading-relaxed text-black/65">
              SHoP is built around the idea that chess can be a
              meeting point — for competition, education, friendship
              and the simple pleasure of thinking together.
            </p>
          </div>
        </div>

        <div className="mt-20 border-t border-black/15">
          {areas.map((area) => (
            <article
              key={area.number}
              className="group grid gap-8 border-b border-black/15 py-10 md:grid-cols-[80px_0.8fr_1fr_320px] md:items-center"
            >
              <span className="text-xs tracking-[0.2em] text-black/35">
                {area.number}
              </span>

              <h3 className="font-serif text-4xl tracking-[-0.035em]">
                {area.title}
              </h3>

              <p className="max-w-xl text-base leading-relaxed text-black/60">
                {area.text}
              </p>

              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={area.image}
                  alt={area.title}
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