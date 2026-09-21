"use client";

import { Clock3, MapPin, Phone } from "lucide-react";

const details = [
  {
    icon: MapPin,
    label: "FIND US",
    value: "Rook & Reed Plaza",
    detail: "Kilimani, Nairobi",
  },
  {
    icon: Clock3,
    label: "OPEN DAILY",
    value: "8:00 AM — 8:00 PM",
    detail: "Every day",
  },
  {
    icon: Phone,
    label: "CALL / WHATSAPP",
    value: "0758 038 852",
    detail: "Tap to connect",
  },
];

export default function VisitDetails() {
  return (
    <section
      id="visit-details"
      className="bg-[#f5f1e8] py-24 text-[#111] lg:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="grid overflow-hidden border border-black/15 md:grid-cols-3">
          {details.map((item) => {
            const Icon = item.icon;

            const content = (
              <div className="h-full p-8 transition hover:bg-white sm:p-10 lg:p-12">
                <Icon
                  size={22}
                  strokeWidth={1.3}
                  className="text-black/45"
                />

                <p className="mt-9 text-[10px] font-semibold uppercase tracking-[0.25em] text-black/35">
                  {item.label}
                </p>

                <h2 className="mt-3 font-serif text-3xl tracking-[-0.035em]">
                  {item.value}
                </h2>

                <p className="mt-2 text-sm text-black/50">
                  {item.detail}
                </p>
              </div>
            );

            if (item.label === "CALL / WHATSAPP") {
              return (
                <a
                  key={item.label}
                  href="https://wa.me/254758038852"
                  target="_blank"
                  rel="noreferrer"
                >
                  {content}
                </a>
              );
            }

            return <div key={item.label}>{content}</div>;
          })}
        </div>
      </div>
    </section>
  );
}