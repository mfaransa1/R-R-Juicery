"use client";

import Image from "next/image";
import Link from "next/link";

export default function VisitHero() {
  return (
    <section className="relative min-h-[88vh] overflow-hidden bg-[#111] text-white">
      <Image
        src="/images/visit/visit-hero.jpg"
        alt="The Rook & Reed Juicery in Kilimani"
        fill
        priority
        className="object-cover object-center"
      />

      <video
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/visit/visit-hero.jpg"
      >
        <source src="/videos/visit/visit-hero.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/25" />

      <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-[1440px] items-end px-5 pb-12 sm:px-8 lg:px-14 lg:pb-20">
        <div className="max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/50">
            R&R / KILIMANI / NAIROBI
          </p>

          <h1 className="mt-6 font-serif text-[clamp(4.8rem,14vw,13rem)] leading-[0.74] tracking-[-0.07em]">
            COME
            <br />
            THROUGH.
          </h1>

          <div className="mt-9 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <p className="max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
              Good juice. Good music. Good company. Find us at Rook &
              Reed Plaza, Kilimani.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="#visit-details"
                className="border border-white bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] !text-black transition hover:bg-transparent hover:!text-white"
              >
                Plan your visit
              </Link>

              <a
                href="https://wa.me/254758038852"
                target="_blank"
                rel="noreferrer"
                className="border border-white/40 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-7 right-7 hidden text-right text-[10px] uppercase tracking-[0.25em] text-white/40 md:block">
        ROOK & REED PLAZA
        <br />
        KILIMANI
        <br />
        NAIROBI
      </div>
    </section>
  );
}