"use client";

import { motion } from "motion/react";

export default function AccountPassportHero({ name }: { name?: string | null }) {
  const firstName = name?.trim().split(/\s+/)[0] || "there";

  return (
    <section className="relative overflow-hidden bg-[#111111] text-white">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -right-24 -top-40 h-[28rem] w-[28rem] rounded-full border border-white/10" />
        <div className="absolute -right-12 -top-16 h-[18rem] w-[18rem] rounded-full border border-white/10" />
        <div className="absolute -bottom-48 -left-32 h-[30rem] w-[30rem] rounded-full border border-white/10" />
      </div>
      <div className="relative mx-auto max-w-[1440px] px-5 pb-20 pt-32 lg:px-10 lg:pb-28 lg:pt-44">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-white/40">R&R PASSPORT</p>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[0.94] tracking-[-0.045em] md:text-7xl lg:text-8xl">
            Welcome back,
            <br />
            <span className="text-white/45">{firstName}.</span>
          </h1>
          <p className="mt-7 max-w-xl text-sm leading-7 text-white/55 md:text-base">
            Your place for orders, saved moves, and everything that brings you back to Rook & Reed.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
