"use client";

import Link from "next/link";

export default function AccountContact() {
  return (
    <section className="bg-[#f5f1e8] py-20 text-[#111] lg:py-28">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/35">
            NEED A HAND?
          </p>

          <h2 className="mt-4 font-serif text-5xl tracking-[-0.045em] sm:text-6xl">
            Talk to R&R.
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-black/50">
            For questions about visiting, orders or the House,
            reach us directly.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="https://wa.me/254758038852"
            target="_blank"
            rel="noreferrer"
            className="border border-black bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-transparent hover:text-black"
          >
            WhatsApp
          </a>

          <Link
            href="/contact"
            className="border border-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition hover:bg-black hover:text-white"
          >
            Contact
          </Link>
        </div>
      </div>
    </section>
  );
}