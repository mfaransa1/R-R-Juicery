"use client";

import Image from "next/image";
import Link from "next/link";

export default function AccountClosing() {
  return (
    <section className="relative min-h-[58vh] overflow-hidden bg-black text-white">
      <Image
        src="/images/account/account-closing.jpg"
        alt="Rook & Reed"
        fill
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 mx-auto flex min-h-[58vh] max-w-[1440px] items-end px-5 pb-12 sm:px-8 lg:px-14 lg:pb-20">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/35">
            GOOD JUICE. GOOD MUSIC. GOOD COMPANY.
          </p>

          <h2 className="mt-6 font-serif text-[clamp(4rem,10vw,9rem)] leading-[0.78] tracking-[-0.065em]">
            See you
            <br />
            at the House.
          </h2>

          <Link
            href="/visit"
            className="mt-9 inline-flex border border-white bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] !text-black transition hover:bg-transparent hover:!text-white"
          >
            Find R&R
          </Link>
        </div>
      </div>
    </section>
  );
}