"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

export default function MenuTransparency() {
  return (
    <section className="overflow-hidden bg-black text-white">
      <div className="rr-container py-24 sm:py-32 lg:py-40">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.9fr] lg:gap-24">
          <div>
            <span className="rr-kicker text-white/45">
              KNOW YOUR JUICE
            </span>

            <h2 className="rr-editorial mt-6 text-6xl leading-[0.84] sm:text-8xl">
              We show
              <br />
              <em>you.</em>
            </h2>

            <p className="mt-8 max-w-lg text-base leading-8 text-white/60">
              What is inside. Where it came from. How it was prepared.
              What happens before it reaches your glass.
            </p>

            <Link
              href="/ingredients"
              className="mt-9 inline-flex items-center gap-3 border-b border-white/30 pb-2 text-xs uppercase tracking-[0.16em]"
            >
              Explore ingredients
              <ArrowUpRight size={15} />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-square overflow-hidden"
          >
            <Image
              src="/images/ingredients/ingredients-hero.jpg"
              alt="Fresh Rook & Reed ingredients"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black/10" />

            <div className="absolute bottom-5 left-5 right-5 flex justify-between text-[10px] uppercase tracking-[0.18em] text-white/70">
              <span>SELECT</span>
              <span>WASH</span>
              <span>PREPARE</span>
              <span>PRESS</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}