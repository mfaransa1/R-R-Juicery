"use client";

import Link from "next/link";

export default function VisitContact() {
  return (
    <section className="bg-[#111] py-24 text-white lg:py-32">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-14">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
              NEED SOMETHING?
            </p>

            <h2 className="mt-6 font-serif text-6xl leading-[0.84] tracking-[-0.055em] sm:text-8xl">
              Talk
              <br />
              to us.
            </h2>
          </div>

          <div className="border-t border-white/15 pt-8">
            <div className="space-y-7">
              <div>
                <p className="text-[9px] uppercase tracking-[0.22em] text-white/30">
                  PHONE / WHATSAPP
                </p>

                <a
                  href="https://wa.me/254758038852"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block font-serif text-3xl transition hover:text-white/60"
                >
                  0758 038 852
                </a>
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.22em] text-white/30">
                  EMAIL
                </p>

                <a
                  href="mailto:rookreedjuicery@gmail.com"
                  className="mt-2 block font-serif text-2xl transition hover:text-white/60 sm:text-3xl"
                >
                  rookreedjuicery@gmail.com
                </a>
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.22em] text-white/30">
                  INSTAGRAM
                </p>

                <a
                  href="https://instagram.com/rookandreedjuicery"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block font-serif text-3xl transition hover:text-white/60"
                >
                  @rookandreedjuicery
                </a>
              </div>
            </div>

            <Link
              href="/contact"
              className="mt-10 inline-flex border border-white bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] !text-black transition hover:bg-transparent hover:!text-white"
            >
              Contact page
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}