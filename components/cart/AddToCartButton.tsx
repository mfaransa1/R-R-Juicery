"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useRRCart } from "@/components/cart/RRCartProvider";

type Props = {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    size: string;
    image_path?: string | null;
  };
};

export default function AddToCartButton({ product }: Props) {
  const { addItem } = useRRCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      size: product.size,
      imagePath: product.image_path,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="inline-flex items-center gap-2 border border-black bg-black px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-black"
    >
      {added ? <Check size={16} /> : <Plus size={16} />}
      {added ? "Added" : "Add to move"}
    </button>
  );
}
