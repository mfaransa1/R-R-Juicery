"use client";

import Image from "next/image";

const culture = [
  {
    title: "KENYAN JAZZ",
    text: "A space to discover and revisit the sounds, musicians and records that form part of Kenya's musical story.",
    image: "/images/jazz/kenyan-jazz.jpg",
  },
  {
    title: "FEATURED ARTIST",
    text: "A rotating spotlight for musicians whose work deserves a closer listen.",
    image: "/images/jazz/featured-artist.jpg",
  },
  {
    title: "ALBUM OF THE MONTH",
    text: "One record. One month. A reason to sit down and listen from beginning to end.",
    image: "/images/jazz/album-of-month.jpg",
  },
];

export default function JazzCulture() {
  return (
    <section className="bg-[#d8d2c7] py-24 text-[#111] lg:py-36">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
              DEEP LISTENING
            </p>

            <h2 className="mt-6 font-serif text-6xl leading-[0.84] tracking-[-0.055em] sm:text-8xl">
              Follow
              <br />
              the sound.
            </h2>
          </div>

          <p className="max-w-2xl self-end text-xl leading-relaxed text-black/65">
            The Reed is not just background music. It is a place to
            discover records, musicians and stories — especially the
            music that connects Nairobi to a wider African and global
            jazz tradition.
          </p>
        </div>

        <div className="mt-20 grid gap-5 md:grid-cols-3">
          {culture.map((item) => (
            <article key={item.title} className="group">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#bdb6aa]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </div>

              <div className="border-b border-black/20 py-6">
                <h3 className="font-serif text-3xl tracking-[-0.035em]">
                  {item.title}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-black/55">
                  {item.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}