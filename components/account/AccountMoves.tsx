"use client";

import Link from "next/link";
import { ArrowUpRight, Crown, History, Heart } from "lucide-react";

const items = [
  {
    number: "01",
    title: "R&R MOVES",
    text: "Every move counts. Your loyalty experience will live here.",
    icon: Crown,
  },
  {
    number: "02",
    title: "YOUR ORDERS",
    text: "Review previous purchases and follow future orders.",
    icon: History,
  },
  {
    number: "03",
    title: "FAVOURITES",
    text: "Keep the juices and House experiences you return to.",
    icon: Heart,
  },
];

export default function AccountMoves() {
  return (
    <section className="bg-[#111] py-24 text-white lg:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="flex flex-col gap-8 border-b border-white/10 pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/35">
              THE ACCOUNT / THE LONG GAME
            </p>

            <h2 className="mt-5 max-w-3xl font-serif text-6xl leading-[0.82] tracking-[-0.055em] sm:text-8xl">
              Every move
              <br />
              counts.
            </h2>
          </div>

          <Link
            href="/menu"
            className="flex w-fit items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/60 transition hover:text-white"
          >
            Explore the menu
            <ArrowUpRight size={16} strokeWidth={1.4} />
          </Link>
        </div>

        <div className="mt-12 grid border-t border-white/10 md:grid-cols-3">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.number}
                className="border-b border-white/10 py-10 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs text-white/25">
                    {item.number}
                  </span>

                  <Icon
                    size={20}
                    strokeWidth={1.2}
                    className="text-white/35"
                  />
                </div>

                <h3 className="mt-14 font-serif text-3xl tracking-[-0.025em]">
                  {item.title}
                </h3>

                <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/45">
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