"use client";

import Image from "next/image";
import Link from "next/link";

export default function ContactSocial() {
  return (
    <section className="bg-[#d8d2c7] py-24 text-[#111] lg:py-32">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:px-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
            STAY CONNECTED
          </p>

          <h2 className="mt-6 font-serif text-6xl leading-[0.84] tracking-[-0.055em] sm:text-8xl">
            Follow
            <br />
            the House.
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <a
            href="https://instagram.com/rookandreedjuicery"
            target="_blank"
            rel="noreferrer"
            className="group relative min-h-[420px] overflow-hidden"
          >
            <Image
              src="/images/contact/instagram.jpg"
              alt="R&R on Instagram"
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/40" />

            <div className="absolute inset-x-0 bottom-0 p-7 text-white">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/50">
                INSTAGRAM
              </p>

              <h3 className="mt-3 font-serif text-4xl">
                @rookandreedjuicery
              </h3>
            </div>
          </a>

          <Link
            href="/journal"
            className="group relative min-h-[420px] overflow-hidden"
          >
            <Image
              src="/images/contact/journal.jpg"
              alt="R&R Journal"
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/45" />

            <div className="absolute inset-x-0 bottom-0 p-7 text-white">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/50">
                JOURNAL
              </p>

              <h3 className="mt-3 font-serif text-4xl">
                Stories from the House
              </h3>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}