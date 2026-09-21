"use client";

import JuiceCard from "@/components/juice/JuiceCard";
import type { Product } from "@/data/products";

type JuiceGridProps = {
  products: Product[];
};

export default function JuiceGrid({ products }: JuiceGridProps) {
  if (!products.length) {
    return (
      <div className="border-y border-black/10 py-20 text-center">
        <p className="rr-editorial text-3xl">
          Nothing here yet.
        </p>

        <p className="mt-3 text-sm text-black/50">
          Try another selection.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-x-5 gap-y-12 md:grid-cols-2">
      {products.map((product, index) => (
        <JuiceCard
          key={product.slug}
          product={product}
          featured={index === 0}
        />
      ))}
    </div>
  );
}