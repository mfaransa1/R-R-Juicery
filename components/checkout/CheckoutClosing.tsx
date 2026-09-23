"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

export default function CheckoutClosing() {
  return (
    <section className="relative min-h-[48vh] overflow-hidden bg-black text-white">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.02 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      >
        <Image
          src="/images/checkout/checkout-closing.jpg"
          alt="Rook & Reed Juicery"
          fill
          className="object-cover"
        />
      </motion.div>

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 mx-auto flex min-h-[48vh] max-w-[1440px] items-end px-5 pb-12 sm:px-8 lg:px-14 lg:pb-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/35">
            GOOD JUICE / GOOD COMPANY
          </p>

          <h2 className="mt-5 font-serif text-[clamp(3.8rem,9vw,8rem)] leading-[0.8] tracking-[-0.065em]">
            See you
            <br />
            soon.
          </h2>

          <Link
            href="/visit"
            className="mt-8 inline-flex border border-white bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] !text-black transition hover:bg-transparent hover:!text-white"
          >
            Visit the House
          </Link>
        </div>
      </div>
    </section>
  );
}