"use client";

import Link from "next/link";
import { useRRCart } from "@/components/cart/RRCartProvider";

export default function LiveCheckoutSummary() {
  const { items, subtotal, itemCount } = useRRCart();

  return (
    <aside className="border border-black/10 bg-white p-6 sm:p-8 lg:sticky lg:top-24 lg:h-fit">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-serif text-3xl">Your order</h2>

        <Link
          href="/menu"
          className="text-xs font-semibold uppercase tracking-[0.14em] underline underline-offset-4"
        >
          Add more
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-black/55">
            Your basket is empty.
          </p>

          <Link
            href="/menu"
            className="mt-5 inline-block bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-white"
          >
            Browse menu
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8 space-y-5">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between gap-5 border-b border-black/10 pb-5"
              >
                <div className="min-w-0">
                  <p className="font-serif text-xl">
                    {item.name}
                  </p>

                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-black/45">
                    {item.quantity} × {item.size}
                  </p>
                </div>

                <p className="shrink-0 text-sm font-semibold">
                  KSh{" "}
                  {(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-7 flex items-center justify-between border-t border-black pt-5">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                Subtotal
              </span>

              <p className="mt-1 text-xs text-black/45">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </p>
            </div>

            <span className="text-xl font-semibold">
              KSh {subtotal.toLocaleString()}
            </span>
          </div>

          <p className="mt-3 text-xs leading-5 text-black/45">
            Delivery charges are not yet configured in the live
            transaction layer.
          </p>
        </>
      )}
    </aside>
  );
}
