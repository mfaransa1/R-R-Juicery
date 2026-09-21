"use client";

import Image from "next/image";

export default function JazzIntro() {
  return (
    <section className="bg-[#f5f1e8] py-24 text-[#111] lg:py-36">
      <div className="mx-auto grid max-w-[1440px] gap-16 px-5 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:px-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
            THE SOUL OF THE HOUSE
          </p>

          <h2 className="mt-7 max-w-xl font-serif text-6xl leading-[0.85] tracking-[-0.06em] sm:text-8xl">
            Let the
            <br />
            record play.
          </h2>
        </div>

        <div className="grid gap-10 sm:grid-cols-[1fr_0.75fr] sm:items-end">
          <div>
            <p className="max-w-2xl text-xl leading-relaxed text-black/70">
              The Reed is the musical side of The House — a place
              for jazz, listening, records, artists and conversations
              that happen because the music is good enough to make
              people stay.
            </p>

            <p className="mt-7 max-w-xl text-base leading-relaxed text-black/55">
              The playlist is part of the experience. So are the
              silences between tracks.
            </p>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden bg-[#d8d2c7]">
            <Image
              src="/images/jazz/jazz-room.jpg"
              alt="The Reed listening room"
              fill
              className="object-cover transition duration-700 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}