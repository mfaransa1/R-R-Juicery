"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PublicProduct } from "@/lib/supabase/catalog";

export default function RelatedProducts({ products }: { products: PublicProduct[] }) {
  if (!products.length) return null;

  return (
    <section className="bg-[var(--rr-paper)]">
      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
        <div className="flex items-end justify-between gap-6 border-b border-black/10 pb-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/40">THE NEXT MOVE</p>
            <h2 className="rr-editorial mt-3 text-5xl">You might also like.</h2>
          </div>
          <Link href="/menu" className="hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] sm:inline-flex">
            Full menu <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-8 grid gap-px bg-black/10 md:grid-cols-3">
          {products.map((product) => (
            <Link key={product.id} href={`/menu/${product.slug}`} className="group bg-white">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#e7e2d8]">
                <Image
                  src={product.image_path || `/images/products/${product.slug}.jpg`}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.035]"
                />
              </div>
              <div className="flex items-end justify-between gap-5 p-5">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-black/35">{product.category_label}</p>
                  <h3 className="mt-2 font-serif text-2xl">{product.name}</h3>
                  <p className="mt-2 text-xs text-black/45">{product.size} · KSh {Number(product.price).toLocaleString("en-KE")}</p>
                </div>
                <ArrowRight size={17} className="shrink-0 transition group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
