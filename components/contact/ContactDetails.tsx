"use client";

import Link from "next/link";
import { Clock3, Instagram, Mail, MapPin, Phone } from "lucide-react";

export default function ContactDetails() {
  return (
    <section className="bg-[#f5f1e8] py-24 text-[#111] lg:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="grid gap-px overflow-hidden border border-black/15 bg-black/15 md:grid-cols-2 lg:grid-cols-4">
          <a
            href="https://wa.me/254758038852"
            target="_blank"
            rel="noreferrer"
            className="group bg-[#f5f1e8] p-8 transition hover:bg-white sm:p-10"
          >
            <Phone
              size={21}
              strokeWidth={1.3}
              className="text-black/40"
            />

            <p className="mt-9 text-[9px] font-semibold uppercase tracking-[0.25em] text-black/35">
              PHONE / WHATSAPP
            </p>

            <p className="mt-3 font-serif text-2xl tracking-[-0.03em]">
              0758 038 852
            </p>
          </a>

          <a
            href="mailto:rookreedjuicery@gmail.com"
            className="group bg-[#f5f1e8] p-8 transition hover:bg-white sm:p-10"
          >
            <Mail
              size={21}
              strokeWidth={1.3}
              className="text-black/40"
            />

            <p className="mt-9 text-[9px] font-semibold uppercase tracking-[0.25em] text-black/35">
              EMAIL
            </p>

            <p className="mt-3 break-words font-serif text-xl tracking-[-0.03em]">
              rookreedjuicery@gmail.com
            </p>
          </a>

          <div className="bg-[#f5f1e8] p-8 sm:p-10">
            <MapPin
              size={21}
              strokeWidth={1.3}
              className="text-black/40"
            />

            <p className="mt-9 text-[9px] font-semibold uppercase tracking-[0.25em] text-black/35">
              FIND US
            </p>

            <p className="mt-3 font-serif text-2xl tracking-[-0.03em]">
              Rook & Reed Plaza
            </p>

            <p className="mt-1 text-sm text-black/45">
              Kilimani, Nairobi
            </p>
          </div>

          <div className="bg-[#f5f1e8] p-8 sm:p-10">
            <Clock3
              size={21}
              strokeWidth={1.3}
              className="text-black/40"
            />

            <p className="mt-9 text-[9px] font-semibold uppercase tracking-[0.25em] text-black/35">
              OPEN DAILY
            </p>

            <p className="mt-3 font-serif text-2xl tracking-[-0.03em]">
              8 AM — 8 PM
            </p>

            <p className="mt-1 text-sm text-black/45">
              Every day
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}