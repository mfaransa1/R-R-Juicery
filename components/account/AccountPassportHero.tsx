"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Copy, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AccountPassportHero({
  name,
  passportId,
}: {
  name?: string | null;
  passportId?: string | null;
}) {
  const firstName = name?.trim().split(/\s+/)[0] || "there";
  const [copied, setCopied] = useState(false);

  async function copyId() {
    if (!passportId) return;
    try {
      await navigator.clipboard.writeText(passportId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="relative overflow-hidden bg-[#111111] text-white">
      <div className="absolute inset-0 opacity-30" aria-hidden="true">
        <motion.div
          className="absolute -right-24 -top-40 h-[28rem] w-[28rem] rounded-full border border-white/10"
          animate={{ rotate: [0, 12, 0], scale: [1, 1.03, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-12 -top-16 h-[18rem] w-[18rem] rounded-full border border-white/10"
          animate={{ rotate: [0, -16, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute -bottom-48 -left-32 h-[30rem] w-[30rem] rounded-full border border-white/10" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-5 pb-16 pt-28 sm:px-8 lg:px-10 lg:pb-24 lg:pt-36">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end"
        >
          <div>
            <div className="flex items-center gap-2 text-white/40">
              <Sparkles size={14} strokeWidth={1.4} />
              <p className="text-[10px] font-semibold uppercase tracking-[0.38em]">
                R&R PASSPORT
              </p>
            </div>

            <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[0.94] tracking-[-0.045em] md:text-7xl lg:text-8xl">
              Welcome back,
              <br />
              <span className="text-white/45">{firstName}.</span>
            </h1>

            <p className="mt-7 max-w-xl text-sm leading-7 text-white/55 md:text-base">
              Your place for orders, saved moves, R&R Moves and the things that
              bring you back to the House.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] !text-black transition hover:bg-white/90 hover:!text-black"
              >
                Make a move <ArrowUpRight size={14} />
              </Link>
              <Link
                href="/house"
                className="inline-flex items-center gap-2 border border-white/20 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] !text-white transition hover:border-white/50 hover:!text-white"
              >
                Enter the House <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          {passportId ? (
            <div className="border-t border-white/15 pt-5 lg:min-w-[230px] lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/35">
                PASSPORT ID
              </p>
              <button
                type="button"
                onClick={() => void copyId()}
                className="mt-3 inline-flex items-center gap-2 text-sm !text-white transition hover:!text-white"
              >
                {passportId}
                <Copy size={13} className="text-white/35" />
              </button>
              <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-white/30">
                {copied ? "Copied" : "Your R&R account reference"}
              </p>
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
