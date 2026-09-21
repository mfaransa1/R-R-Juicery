"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

const experiences = [
  {
    id: "rr",
    label: "ROOK & REED",
    title: "Juice.",
    eyebrow: "BODY",
    description:
      "Fresh juice, thoughtful combinations and visible preparation define the daily rhythm of Rook & Reed.",
    image: "/images/house/juice-room.jpg",
    href: "/menu",
    action: "Explore the Juicery",
  },
  {
    id: "shop",
    label: "SHoP",
    title: "Chess.",
    eyebrow: "MIND",
    description:
      "Chess, youth, learning, community and competition — SHoP brings another rhythm into the House.",
    image: "/images/chess/chess-hero.jpg",
    href: "/chess",
    action: "Enter SHoP",
  },
];

export default function HouseSwitcher() {
  const [active, setActive] = useState("rr");

  const current =
    experiences.find((experience) => experience.id === active) ??
    experiences[0];

  return (
    <section className="overflow-hidden bg-black text-white">
      <div className="rr-container py-24 sm:py-32 lg:py-40">
        <div className="mb-12 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <span className="rr-kicker text-white/45">TWO IDENTITIES</span>

            <h2 className="rr-editorial mt-5 text-5xl leading-none sm:text-7xl">
              One building.
            </h2>
          </div>

          <div className="flex border-b border-white/15">
            {experiences.map((experience) => (
              <button
                key={experience.id}
                type="button"
                onClick={() => setActive(experience.id)}
                className={`px-5 py-4 text-xs uppercase tracking-[0.16em] transition-colors sm:px-7 ${
                  active === experience.id
                    ? "border-b border-white text-white"
                    : "text-white/35 hover:text-white"
                }`}
              >
                {experience.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative min-h-[600px] overflow-hidden sm:min-h-[700px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={current.image}
                alt={current.title}
                fill
                sizes="100vw"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-black/45" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/10" />

              <div className="absolute inset-x-0 bottom-0 p-7 sm:p-12 lg:p-16">
                <div className="max-w-3xl">
                  <span className="rr-kicker text-white/55">
                    {current.eyebrow}
                  </span>

                  <h3 className="rr-editorial mt-4 text-7xl leading-[0.8] sm:text-9xl">
                    {current.title}
                  </h3>

                  <p className="mt-7 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
                    {current.description}
                  </p>

                  <Link
                    href={current.href}
                    className="mt-8 inline-flex items-center gap-3 border-b border-white/35 pb-2 text-xs uppercase tracking-[0.16em]"
                  >
                    {current.action}
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}