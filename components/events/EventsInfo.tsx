"use client";

import { CalendarDays, Clock3, MapPin } from "lucide-react";

const details = [
  {
    icon: CalendarDays,
    title: "DATES",
    text: "Event dates are published as the programme develops.",
  },
  {
    icon: Clock3,
    title: "TIMES",
    text: "Exact session times will be confirmed on each event listing.",
  },
  {
    icon: MapPin,
    title: "PLACE",
    text: "The House, Rook & Reed Plaza, Kilimani, Nairobi.",
  },
];

export default function EventsInfo() {
  return (
    <section className="bg-[#111] py-24 text-white lg:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-3">
          {details.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="bg-[#111] p-8 sm:p-10 lg:p-12"
              >
                <Icon size={22} strokeWidth={1.3} className="text-white/45" />

                <h3 className="mt-8 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">
                  {item.title}
                </h3>

                <p className="mt-4 max-w-sm text-base leading-relaxed text-white/60">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}