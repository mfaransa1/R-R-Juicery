"use client";

import Image from "next/image";
import Link from "next/link";

export default function AccountHero() {
  return (
    <section className="relative min-h-[72vh] overflow-hidden bg-[#111] text-white">
      <Image
        src="/images/account/account-hero.jpg"
        alt="The Rook & Reed Juicery"
        fill
        priority
        className="object-cover"
      />

      <video
        className="absolute inset-0 h-full w-full object-cover opacity-35"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/account/account-hero.jpg"
      >
        <source
          src="/videos/account/account-hero.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-black/65" />

      <div className="relative z-10 mx-auto flex min-h-[72vh] max-w-[1440px] items-end px-5 pb-12 sm:px-8 lg:px-14 lg:pb-20">
        <div className="max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/40">
            R&R / YOUR SPACE
          </p>

          <h1 className="mt-6 font-serif text-[clamp(4.5rem,13vw,12rem)] leading-[0.75] tracking-[-0.07em]">
            YOUR
            <br />
            MOVES.
          </h1>

          <div className="mt-9 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <p className="max-w-xl text-lg leading-relaxed text-white/65 sm:text-xl">
              Keep your R&R orders, favourites and loyalty
              journey in one place.
            </p>

            <Link
              href="#account"
              className="w-fit border border-white bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] !text-black transition hover:bg-transparent hover:!text-white"
            >
              Enter account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}