"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

import { useRRCart } from "@/components/cart/RRCartProvider";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CartDrawer({ open, onClose }: Props) {
  const {
    items,
    itemCount,
    subtotal,
    updateQuantity,
    removeItem,
  } = useRRCart();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        aria-label="Close cart"
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[var(--rr-paper)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/45">
              R&R MOVES
            </p>
            <h2 className="mt-1 font-serif text-3xl">
              Your basket
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center border border-black/15"
            aria-label="Close cart"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
              <ShoppingBag className="h-8 w-8" />

              <h3 className="mt-5 font-serif text-2xl">
                Nothing in the basket.
              </h3>

              <p className="mt-3 max-w-xs text-sm leading-6 text-black/55">
                Choose a pour from the menu and make your move.
              </p>

              <Link
                href="/menu"
                onClick={onClose}
                className="mt-7 border border-black bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-white"
              >
                Explore menu
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 border-b border-black/10 pb-6"
                >
                  <div className="h-24 w-20 shrink-0 overflow-hidden bg-black/5">
                    {item.imagePath ? (
                      <img
                        src={item.imagePath}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-black/5" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-serif text-xl leading-none">
                          {item.name}
                        </h3>

                        <p className="mt-2 text-xs uppercase tracking-[0.12em] text-black/45">
                          {item.size}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="text-black/45 hover:text-black"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center border border-black/15">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity - 1
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>

                        <span className="w-8 text-center text-sm">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity + 1
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-semibold">
                        KSh{" "}
                        {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-black/10 px-6 py-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-black/55">
                Subtotal
              </span>

              <span className="text-lg font-semibold">
                KSh {subtotal.toLocaleString()}
              </span>
            </div>

            <p className="mt-2 text-xs leading-5 text-black/45">
              {itemCount} {itemCount === 1 ? "item" : "items"} in your basket.
              Delivery pricing is calculated as the delivery layer is
              configured.
            </p>

            <Link
              href="/checkout"
              onClick={onClose}
              className="mt-5 flex w-full items-center justify-center bg-black px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white"
            >
              Checkout
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
