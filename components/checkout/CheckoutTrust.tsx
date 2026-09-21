"use client";

import { Eye, Leaf, ShieldCheck } from "lucide-react";

const points = [
  {
    icon: Eye,
    title: "Know your juice",
    text: "Ingredient and preparation information is part of the R&R experience.",
  },
  {
    icon: Leaf,
    title: "Fresh thinking",
    text: "Products are built around fresh ingredients and visible preparation.",
  },
  {
    icon: ShieldCheck,
    title: "Clear information",
    text: "We distinguish what is verified from what still needs confirmation.",
  },
];

export default function CheckoutTrust() {
  return (
    <section className="border-t border-black/10 bg-white py-20 lg:py-24">
      <div className="mx-auto grid max-w-[1200px] gap-0 px-5 sm:px-8 md:grid-cols-3 lg:px-14">
        {points.map((point, index) => {
          const Icon = point.icon;

          return (
            <div
              key={point.title}
              className={`py-8 md:px-8 md:first:pl-0 md:last:pr-0 ${
                index !== points.length - 1
                  ? "border-b border-black/10 md:border-b-0 md:border-r"
                  : ""
              }`}
            >
              <Icon size={21} strokeWidth={1.3} />

              <h3 className="mt-8 font-serif text-2xl">
                {point.title}
              </h3>

              <p className="mt-3 max-w-xs text-sm leading-relaxed text-black/45">
                {point.text}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}