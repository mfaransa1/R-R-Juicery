"use client";

import Image from "next/image";
import { useState } from "react";

const images = [
  {
    src: "/images/chess/tournament-01.jpg",
    alt: "Chess tournament",
    label: "THE BOARD",
  },
  {
    src: "/images/chess/tournament-02.jpg",
    alt: "Players at a chess tournament",
    label: "THE PLAYERS",
  },
  {
    src: "/images/chess/tournament-03.jpg",
    alt: "Chess pieces on a board",
    label: "THE GAME",
  },
  {
    src: "/images/chess/tournament-04.jpg",
    alt: "Chess community",
    label: "THE COMMUNITY",
  },
];

export default function ChessGallery() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-[#111] py-24 text-white lg:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
              FROM THE BOARD
            </p>

            <h2 className="mt-5 font-serif text-6xl leading-[0.85] tracking-[-0.055em] sm:text-8xl">
              The game
              <br />
              in motion.
            </h2>
          </div>

          <div className="flex gap-2">
            {images.map((image, index) => (
              <button
                key={image.src}
                onClick={() => setActive(index)}
                className={`h-2 w-8 transition ${
                  active === index
                    ? "bg-white"
                    : "bg-white/20 hover:bg-white/50"
                }`}
                aria-label={`Show gallery image ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_0.3fr]">
          <div className="relative aspect-[16/10] overflow-hidden bg-[#292929]">
            <Image
              src={images[active].src}
              alt={images[active].alt}
              fill
              className="object-cover transition-all duration-700"
            />

            <div className="absolute bottom-5 left-5 bg-black/60 px-4 py-2 text-[10px] uppercase tracking-[0.25em] backdrop-blur-sm">
              {images[active].label}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            {images.map((image, index) => (
              <button
                key={image.src}
                onClick={() => setActive(index)}
                className={`relative overflow-hidden ${
                  active === index ? "ring-2 ring-white" : ""
                }`}
              >
                <div className="relative aspect-[16/9]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className={`object-cover transition duration-500 ${
                      active === index
                        ? "scale-105"
                        : "opacity-55 hover:opacity-100"
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}