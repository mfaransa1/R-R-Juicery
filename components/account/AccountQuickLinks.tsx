"use client";

import Link from "next/link";
import { ArrowRight, Heart, Package, Settings2, ShoppingBag } from "lucide-react";

const links = [
  {
    href: "/account/orders",
    label: "YOUR ORDERS",
    title: "Order history.",
    description: "See every order, its status, items and total.",
    icon: Package,
  },
  {
    href: "/account/favourites",
    label: "SAVED MOVES",
    title: "Your favourites.",
    description: "Return to the juices you have saved.",
    icon: Heart,
  },
  {
    href: "/menu",
    label: "MAKE A MOVE",
    title: "Explore the menu.",
    description: "Find something fresh for your next order.",
    icon: ShoppingBag,
  },
  {
    href: "/account/settings",
    label: "ACCOUNT",
    title: "Settings.",
    description: "Manage your sign-in and account security.",
    icon: Settings2,
  },
];

export default function AccountQuickLinks() {
  return (
    <section className="bg-[#f5f1e8] px-5 py-20 text-[#111] sm:px-8 lg:py-28 lg:px-14">
      <div className="mx-auto max-w-[1200px]">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/35">
            YOUR PASSPORT
          </p>
          <h2 className="mt-5 font-serif text-5xl leading-[0.9] tracking-[-0.045em] sm:text-7xl">
            Where your next move begins.
          </h2>
        </div>

        <div className="mt-12 grid border-t border-black/15 sm:grid-cols-2">
          {links.map((item, index) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group border-b border-black/15 py-8 transition-colors hover:bg-black hover:text-white sm:px-7 sm:py-10 ${
                  index % 2 === 1 ? "sm:border-l" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-6">
                  <Icon size={21} strokeWidth={1.35} />
                  <ArrowRight
                    size={18}
                    strokeWidth={1.35}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </div>

                <p className="mt-14 text-[10px] font-semibold uppercase tracking-[0.28em] opacity-45">
                  {item.label}
                </p>

                <h3 className="mt-3 font-serif text-4xl leading-none tracking-[-0.035em]">
                  {item.title}
                </h3>

                <p className="mt-5 max-w-xs text-sm leading-relaxed opacity-55">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
