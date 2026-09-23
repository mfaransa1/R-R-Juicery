"use client";

import { ShoppingBag } from "lucide-react";
import { useState } from "react";

import { useRRCart } from "@/components/cart/RRCartProvider";
import CartDrawer from "@/components/cart/CartDrawer";

export default function CartButton() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useRRCart();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative inline-flex h-10 w-10 items-center justify-center"
        aria-label={`Open basket${
          itemCount ? `, ${itemCount} ${itemCount === 1 ? "item" : "items"}` : ""
        }`}
      >
        <ShoppingBag className="h-5 w-5" />

        {itemCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] font-semibold text-white">
            {itemCount}
          </span>
        )}
      </button>

      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
