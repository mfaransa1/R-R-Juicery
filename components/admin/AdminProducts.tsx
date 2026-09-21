"use client";

import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { products } from "@/data/products";

export default function AdminProducts() {
  return (
    <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <div className="flex flex-col gap-6 border-b border-black/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-black/35">
            OPERATIONS / MENU
          </p>

          <h1 className="mt-3 font-serif text-5xl tracking-[-0.045em]">
            Products.
          </h1>

          <p className="mt-3 text-sm text-black/45">
            Manage the R&R product catalogue.
          </p>
        </div>

        <button
          type="button"
          className="flex w-fit items-center gap-3 bg-black px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white"
        >
          <Plus size={15} strokeWidth={1.3} />
          Add product
        </button>
      </div>

      <div className="mt-8 grid gap-px border border-black/10 bg-black/10 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.slug}
            className="bg-white p-6 transition hover:bg-[#faf8f3]"
          >
            <div className="flex items-start justify-between">
              <span className="text-[8px] font-semibold uppercase tracking-[0.18em] text-black/30">
                {product.categoryLabel}
              </span>

              <Link
                href={`/menu/${product.slug}`}
                className="flex h-8 w-8 items-center justify-center border border-black/10"
              >
                <ArrowUpRight
                  size={14}
                  strokeWidth={1.3}
                />
              </Link>
            </div>

            <h2 className="mt-12 font-serif text-3xl tracking-[-0.035em]">
              {product.name}
            </h2>

            <p className="mt-3 text-xs leading-relaxed text-black/45">
              {product.description}
            </p>

            <div className="mt-7 grid grid-cols-2 border-t border-black/10 pt-5">
              <div>
                <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-black/30">
                  Price
                </p>

                <p className="mt-2 text-sm">
                  KSh {product.price.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-black/30">
                  Size
                </p>

                <p className="mt-2 text-sm">{product.size}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {product.ingredients.map((ingredient) => (
                <span
                  key={ingredient.name}
                  className="border border-black/10 px-2 py-1 text-[8px] text-black/45"
                >
                  {ingredient.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}