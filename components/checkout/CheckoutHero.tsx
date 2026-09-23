"use client";

import Image from "next/image";
import { motion } from "motion/react";

export default function CheckoutHero() {
  return (
    <section className="relative min-h-[42vh] overflow-hidden bg-[#111] text-white">
      <Image
        src="/images/checkout/checkout-hero.jpg"
        alt="The Rook & Reed Juicery"
        fill
        priority
        className="object-cover"
      />

      <motion.div
        className="absolute inset-0 bg-black/65"
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 0.65 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      <motion.div
        className="absolute inset-0"
        animate={{
          scale: [1, 1.03, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(168,135,82,0.18),transparent_40%)]" />
      </motion.div>

      <div className="relative z-10 mx-auto flex min-h-[42vh] max-w-[1440px] items-end px-5 pb-12 sm:px-8 lg:px-14 lg:pb-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
            R&R / YOUR ORDER
          </p>

          <h1 className="mt-5 font-serif text-[clamp(4rem,10vw,9rem)] leading-[0.78] tracking-[-0.065em]">
            CHECKOUT.
          </h1>
        </div>
      </div>
    </section>
  );
}