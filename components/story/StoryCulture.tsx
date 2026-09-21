"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

const culture = [
  {
    title: "JUICE",
    description:
      "Fresh compositions made visibly and deliberately.",
    image: "/images/story/culture-juice.jpg",
    href: "/menu",
  },
  {
    title: "JAZZ",
    description:
      "Listening, records, sessions and the music of The Reed.",
    image: "/images/story/culture-jazz.jpg",
    href: "/jazz",
  },
  {
    title: "CHESS",
    description:
      "Strategy, competition, youth and community through SHoP.",
    image: "/images/story/culture-chess.jpg",
    href: "/chess",
  },
  {
    title: "BOOKS",
    description:
      "Ideas, biographies, literature and the quiet pleasure of reading.",
    image: "/images/story/culture-books.jpg",
    href: "/house",
  },
];

export default function StoryCulture() {
  return (
    <section className="bg-[#f5f1e8]">
      <div className="rr-container py-24 sm:py-32 lg:py-40">
        <div className="mb-14 max-w-4xl">
          <span className="rr-kicker">THE CULTURE</span>

          <h2 className="rr-editorial mt-5 text-5xl leading-[0.84] sm:text-7xl lg:text-8xl">
            Four ways
            <br />
            <em>to spend time.</em>
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {culture.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.15,
              }}
              transition={{
                duration: 0.55,
                delay: index * 0.05,
              }}
            >
              <Link
                href={item.href}
                className="group block"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-black">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/10" />

                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                    <div className="text-white">
                      <h3 className="rr-editorial text-5xl leading-none sm:text-6xl">
                        {item.title}
                      </h3>

                      <p className="mt-3 max-w-sm text-xs leading-6 text-white/65">
                        {item.description}
                      </p>
                    </div>

                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                      <ArrowUpRight
                        size={16}
                        strokeWidth={1.2}
                      />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}