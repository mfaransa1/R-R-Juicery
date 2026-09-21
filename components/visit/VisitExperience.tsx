"use client";

import Image from "next/image";

const moments = [
  {
    number: "01",
    title: "ARRIVE",
    text: "Come in, take your time and find your place in the House.",
    image: "/images/visit/arrive.jpg",
  },
  {
    number: "02",
    title: "CHOOSE",
    text: "Explore the menu, ask questions and see what is being prepared.",
    image: "/images/visit/choose.jpg",
  },
  {
    number: "03",
    title: "STAY",
    text: "Drink, listen, read, play or simply spend some time here.",
    image: "/images/visit/stay.jpg",
  },
];

export default function VisitExperience() {
  return (
    <section className="bg-white py-24 text-[#111] lg:py-36">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
              THE EXPERIENCE
            </p>

            <h2 className="mt-6 font-serif text-6xl leading-[0.84] tracking-[-0.055em] sm:text-8xl">
              Not just
              <br />
              a stop.
            </h2>
          </div>

          <p className="max-w-2xl self-end text-xl leading-relaxed text-black/65">
            R&R is designed as a place you can actually spend time
            in. Juice is the starting point — not necessarily the
            reason you have to leave.
          </p>
        </div>

        <div className="mt-20 border-t border-black/15">
          {moments.map((moment) => (
            <article
              key={moment.number}
              className="group grid gap-8 border-b border-black/15 py-10 md:grid-cols-[70px_0.75fr_1fr_320px] md:items-center"
            >
              <span className="text-xs tracking-[0.2em] text-black/30">
                {moment.number}
              </span>

              <h3 className="font-serif text-4xl tracking-[-0.04em]">
                {moment.title}
              </h3>

              <p className="max-w-xl text-base leading-relaxed text-black/55">
                {moment.text}
              </p>

              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={moment.image}
                  alt={moment.title}
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