"use client";

import Image from "next/image";

export default function CheckoutHero() {
  return (
    <section className="relative min-h-[42vh] overflow-hidden bg-[#111] text-white">
      <Image
        src="/images/checkout/checkout-hero.jpg"
        alt="The Rook & Reed Juicery"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/65" />

      <div className="relative z-10 mx-auto flex min-h-[42vh] max-w-[1440px] items-end px-5 pb-12 sm:px-8 lg:px-14 lg:pb-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
            R&R / YOUR ORDER
          </p>

          <h1 className="mt-5 font-serif text-[clamp(4rem,10vw,9rem)] leading-[0.78] tracking-[-0.065em]">
            CHECKOUT.
          </h1>
        </div>
      </div>
    </section>
  );
}