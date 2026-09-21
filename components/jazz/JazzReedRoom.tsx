"use client";

import Image from "next/image";

export default function JazzReedRoom() {
  return (
    <section className="relative min-h-[80vh] overflow-hidden bg-[#111] text-white">
      <Image
        src="/images/jazz/reed-room.jpg"
        alt="The Reed room"
        fill
        className="object-cover"
      />

      <video
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/jazz/reed-room.jpg"
      >
        <source src="/videos/jazz/the-reed.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-[1440px] items-end px-5 pb-12 sm:px-8 lg:px-14 lg:pb-20">
        <div className="grid w-full gap-10 lg:grid-cols-[1fr_0.5fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
              THE REED
            </p>

            <h2 className="mt-6 font-serif text-[clamp(4rem,10vw,9rem)] leading-[0.78] tracking-[-0.065em]">
              Stay
              <br />
              awhile.
            </h2>
          </div>

          <div className="border-l border-white/20 pl-6 lg:pl-8">
            <p className="text-lg leading-relaxed text-white/65">
              Good music changes the pace of a room. The Reed is
              designed around that feeling — somewhere to drink,
              listen, talk and stay longer than you expected.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}