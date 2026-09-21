"use client";

import Image from "next/image";
import Link from "next/link";

export default function ContactHero() {
  return (
    <section className="relative min-h-[82vh] overflow-hidden bg-[#111] text-white">
      <Image
        src="/images/contact/contact-hero.jpg"
        alt="The Rook & Reed Juicery"
        fill
        priority
        className="object-cover"
      />

      <video
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/contact/contact-hero.jpg"
      >
        <source src="/videos/contact/contact-hero.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/30" />

      <div className="relative z-10 mx-auto flex min-h-[82vh] max-w-[1440px] items-end px-5 pb-12 sm:px-8 lg:px-14 lg:pb-20">
        <div className="max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/45">
            R&R / CONTACT / KILIMANI
          </p>

          <h1 className="mt-6 font-serif text-[clamp(4.8rem,14vw,13rem)] leading-[0.74] tracking-[-0.07em]">
            TALK.
          </h1>

          <p className="mt-9 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">
            Questions about the menu, the House, events, partnerships
            or simply want to say hello?
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="https://wa.me/254758038852"
              target="_blank"
              rel="noreferrer"
              className="border border-white bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] !text-black transition hover:bg-transparent hover:!text-white"
            >
              WhatsApp
            </a>

            <a
              href="mailto:rookreedjuicery@gmail.com"
              className="border border-white/40 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white"
            >
              Email us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}