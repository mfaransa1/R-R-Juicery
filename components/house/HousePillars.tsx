"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { HousePillar } from "@/data/house";

type HousePillarsProps = {
  pillars: HousePillar[];
};

export default function HousePillars({ pillars }: HousePillarsProps) {
  return (
    <div className="grid gap-px bg-black/10 md:grid-cols-2">
      {pillars.map((pillar, index) => (
        <motion.article
          key={pillar.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: index * 0.06 }}
          className="group bg-[var(--rr-paper)] p-7 sm:p-9 lg:p-12"
        >
          <div className="flex items-start justify-between gap-6">
            <span className="rr-kicker">{pillar.kicker}</span>

            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 transition-colors duration-300 group-hover:bg-[var(--rr-ink)] group-hover:text-white">
              <ArrowUpRight size={17} strokeWidth={1.5} />
            </span>
          </div>

          <h3 className="rr-editorial mt-10 text-4xl leading-none sm:text-5xl">
            {pillar.title}
          </h3>

          <p className="mt-6 max-w-xl text-sm leading-7 text-black/65 sm:text-base">
            {pillar.description}
          </p>

          <Link
            href={pillar.href}
            className="rr-button mt-8 inline-flex"
          >
            {pillar.action}
          </Link>
        </motion.article>
      ))}
    </div>
  );
}