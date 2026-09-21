"use client";

import Image from "next/image";

export default function ChessIntro() {
  return (
    <section className="overflow-hidden bg-[#f5f1e8] py-24 text-[#111] lg:py-36">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/45">
            THE OTHER SIDE OF THE HOUSE
          </p>

          <h2 className="mt-7 max-w-lg font-serif text-6xl leading-[0.88] tracking-[-0.055em] sm:text-7xl lg:text-8xl">
            A place
            <br />
            to think.
          </h2>
        </div>

        <div className="grid gap-10 sm:grid-cols-[1fr_0.8fr] sm:items-end">
          <div>
            <p className="max-w-2xl text-xl leading-relaxed text-black/70">
              The House has two identities. R&R brings juice, jazz,
              books, conversation and hospitality. SHoP brings chess,
              youth, learning, community and competition.
            </p>

            <p className="mt-7 max-w-2xl text-base leading-relaxed text-black/55">
              The two can meet in the same building without becoming
              the same thing. Chess gives the space another rhythm:
              slower, sharper, more deliberate.
            </p>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden bg-[#d8d2c7]">
            <Image
              src="/images/chess/board.jpg"
              alt="Chess board at The House"
              fill
              className="object-cover transition duration-700 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}