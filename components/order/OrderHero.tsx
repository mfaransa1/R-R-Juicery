"use client";

import Image from "next/image";
import Link from "next/link";

export default function OrderHero() {
  return (
    <section className="relative min-h-[58vh] overflow-hidden bg-[#111] text-white">
      <Image
        src="/images/order/order-hero.jpg"
        alt="Fresh juice at The Rook & Reed Juicery"
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
        poster="/images/order/order-hero.jpg"
      >
        <source
          src="/videos/order/order-hero.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-black/65" />

      <div className="relative z-10 mx-auto flex min-h-[58vh] max-w-[1440px] items-end px-5 pb-12 sm:px-8 lg:px-14 lg:pb-20">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/40">
            R&R / YOUR ORDER
          </p>

          <h1 className="mt-5 font-serif text-[clamp(4.5rem,12vw,11rem)] leading-[0.74] tracking-[-0.07em]">
            ON THE
            <br />
            MOVE.
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/60">
            Follow your order from the first move to the final
            pour.
          </p>

          <Link
            href="#track"
            className="mt-8 inline-flex border border-white bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] !text-black transition hover:bg-transparent hover:!text-white"
          >
            Track order
          </Link>
        </div>
      </div>
    </section>
  );
}