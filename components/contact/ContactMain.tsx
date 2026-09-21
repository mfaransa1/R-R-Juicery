"use client";

import ContactForm from "./ContactForm";

export default function ContactMain() {
  return (
    <section className="bg-white py-24 text-[#111] lg:py-36">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 sm:px-8 lg:grid-cols-[0.65fr_1.35fr] lg:px-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
            SEND A NOTE
          </p>

          <h2 className="mt-6 font-serif text-6xl leading-[0.84] tracking-[-0.055em] sm:text-8xl">
            We&apos;re
            <br />
            listening.
          </h2>

          <p className="mt-8 max-w-md text-lg leading-relaxed text-black/55">
            For general questions, events, partnerships, feedback or
            anything else R&R-related, send us a message.
          </p>

          <div className="mt-12 border-t border-black/15 pt-7">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-black/35">
              DIRECT CONTACT
            </p>

            <a
              href="mailto:rookreedjuicery@gmail.com"
              className="mt-3 block font-serif text-2xl tracking-[-0.03em] transition hover:text-black/50"
            >
              rookreedjuicery@gmail.com
            </a>

            <a
              href="https://wa.me/254758038852"
              target="_blank"
              rel="noreferrer"
              className="mt-2 block font-serif text-2xl tracking-[-0.03em] transition hover:text-black/50"
            >
              0758 038 852
            </a>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}