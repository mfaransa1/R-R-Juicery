"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/data/products";

type JuiceCardProps = {
  product: Product;
  featured?: boolean;
};

export default function JuiceCard({
  product,
  featured = false,
}: JuiceCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className={`group ${
        featured ? "md:col-span-2" : ""
      }`}
    >
      <Link href={`/menu/${product.slug}`} className="block">
        <div
          className={`relative overflow-hidden bg-[#e9e3d8] ${
            featured ? "aspect-[16/10]" : "aspect-[4/5]"
          }`}
        >
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes={
                featured
                  ? "(max-width: 768px) 100vw, 66vw"
                  : "(max-width: 768px) 100vw, 33vw"
              }
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--rr-paper)]">
              <span className="rr-editorial text-6xl text-black/10">
                R&R
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-70" />

          <div className="absolute left-5 top-5">
            <span className="bg-white/90 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-black">
              {product.category}
            </span>
          </div>

          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-5 text-white">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/65">
                {product.ingredients
  .slice(0, 3)
  .map((ingredient) => ingredient.name)
  .join(" · ")}
              </p>

              <h3 className="rr-editorial mt-2 text-3xl leading-none sm:text-4xl">
                {product.name}
              </h3>
            </div>

            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 transition-all duration-300 group-hover:bg-white group-hover:text-black">
              <ArrowUpRight size={17} strokeWidth={1.5} />
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-black/10 py-4">
          <span className="text-sm text-black/55">
            {product.size ?? "Fresh"}
          </span>

          <span className="font-mono text-sm">
            KSh {product.price.toLocaleString()}
          </span>
        </div>
      </Link>
    </motion.article>
  );
}