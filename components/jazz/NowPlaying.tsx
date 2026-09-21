"use client";

import Image from "next/image";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useState } from "react";

export default function NowPlaying() {
  const [playing, setPlaying] = useState(false);

  return (
    <section
      id="now-playing"
      className="overflow-hidden bg-[#111] py-24 text-white lg:py-36"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
              NOW PLAYING
            </p>

            <h2 className="mt-6 font-serif text-6xl leading-[0.84] tracking-[-0.055em] sm:text-8xl">
              The
              <br />
              Reed.
            </h2>

            <p className="mt-8 max-w-md text-lg leading-relaxed text-white/60">
              A rotating listening culture inspired by jazz,
              African sounds, records, musicians and the mood of
              the room.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-[0.9fr_1.1fr]">
            <div className="relative aspect-square overflow-hidden bg-[#292929]">
              <Image
                src="/images/jazz/now-playing.jpg"
                alt="Now playing record"
                fill
                className="object-cover"
              />

              <div className="absolute inset-0 bg-black/10" />

              <div
                className={`absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 ${
                  playing ? "animate-[spin_8s_linear_infinite]" : ""
                }`}
              >
                <div className="absolute inset-7 rounded-full border border-white/20" />
                <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
              </div>
            </div>

            <div className="flex flex-col justify-between border border-white/15 p-7 sm:p-10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/35">
                  CURRENT RECORD
                </p>

                <h3 className="mt-5 font-serif text-4xl tracking-[-0.04em]">
                  The Listening Room
                </h3>

                <p className="mt-3 text-sm uppercase tracking-[0.16em] text-white/40">
                  Curated selection
                </p>

                <div className="mt-8 h-px bg-white/10" />

                <p className="mt-7 text-base leading-relaxed text-white/55">
                  The actual record, artist and track information can
                  be added here as the R&R listening programme develops.
                </p>
              </div>

              <div className="mt-12">
                <div className="mb-5 flex justify-between text-[10px] uppercase tracking-[0.2em] text-white/30">
                  <span>00:00</span>
                  <span>04:32</span>
                </div>

                <div className="h-px bg-white/15">
                  <div className="h-px w-[35%] bg-white" />
                </div>

                <div className="mt-7 flex items-center gap-4">
                  <button
                    className="border border-white/20 p-3 transition hover:border-white"
                    aria-label="Previous track"
                  >
                    <SkipBack size={15} strokeWidth={1.5} />
                  </button>

                  <button
                    onClick={() => setPlaying((value) => !value)}
                    className="flex h-12 w-12 items-center justify-center bg-white !text-black transition hover:bg-white/80"
                    aria-label={playing ? "Pause" : "Play"}
                  >
                    {playing ? (
                      <Pause size={18} fill="currentColor" />
                    ) : (
                      <Play size={18} fill="currentColor" />
                    )}
                  </button>

                  <button
                    className="border border-white/20 p-3 transition hover:border-white"
                    aria-label="Next track"
                  >
                    <SkipForward size={15} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}