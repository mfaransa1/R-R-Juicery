"use client";

import Link from "next/link";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";

import { useRRCart } from "@/components/cart/RRCartProvider";

export default function LiveCheckoutSummary() {
  const {
    items,
    subtotal,
    itemCount,
    updateQuantity,
    removeItem,
  } = useRRCart();

  return (
    <aside className="lg:sticky lg:top-24 lg:h-fit">
      <div className="border border-black/10 bg-white">
        <div className="border-b border-black/10 p-6 sm:p-7">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
                YOUR ORDER
              </p>

              <h2 className="mt-3 font-serif text-4xl leading-none">
                The basket.
              </h2>
            </div>

            {items.length > 0 && (
              <span className="border border-black/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-black/50">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="px-6 py-14 text-center sm:px-8">
            <p className="font-serif text-2xl">Your basket is empty.</p>

            <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-black/50">
              Choose a composition from the menu and make your next move.
            </p>

            <Link
              href="/menu"
              className="mt-7 inline-flex border border-black bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] !text-white transition hover:bg-white hover:!text-black"
            >
              Browse menu
            </Link>
          </div>
        ) : (
          <>
            <div className="divide-y divide-black/10">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="p-5 sm:p-6">
                  <div className="flex gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-[var(--rr-paper)] sm:h-24 sm:w-24">
                      <img
                        src={
                          item.imagePath ||
                          `/images/products/${item.slug ?? item.productId}.jpg`
                        }
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-serif text-xl leading-none">
                            {item.name}
                          </p>

                          <p className="mt-2 text-[10px] uppercase tracking-[0.13em] text-black/40">
                            {item.size}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          aria-label={`Remove ${item.name}`}
                          className="shrink-0 text-black/35 transition hover:text-black"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-4">
                        <div className="flex items-center border border-black/15">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                Math.max(1, item.quantity - 1),
                              )
                            }
                            aria-label={`Decrease ${item.name} quantity`}
                            className="flex h-8 w-8 items-center justify-center transition hover:bg-black hover:!text-white"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>

                          <span className="flex h-8 min-w-9 items-center justify-center border-x border-black/10 text-xs font-semibold">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity + 1,
                              )
                            }
                            aria-label={`Increase ${item.name} quantity`}
                            className="flex h-8 w-8 items-center justify-center transition hover:bg-black hover:!text-white"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <span className="text-sm font-semibold">
                          KSh{" "}
                          {(item.price * item.quantity).toLocaleString(
                            "en-KE",
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-black/10 p-6 sm:p-7">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-black/45">Subtotal</span>
                  <span>
                    KSh {subtotal.toLocaleString("en-KE")}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-black/45">Delivery</span>
                  <span className="text-black/40">Calculated at checkout</span>
                </div>

                <div className="flex items-end justify-between border-t border-black/10 pt-5">
                  <span className="font-serif text-2xl">Total</span>

                  <span className="font-serif text-2xl">
                    KSh {subtotal.toLocaleString("en-KE")}
                  </span>
                </div>
              </div>

              <p className="mt-5 text-[10px] leading-5 text-black/35">
                Your final order total is confirmed when fulfilment and payment
                details are submitted.
              </p>

              <Link
                href="/menu"
                className="mt-6 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/50 underline underline-offset-8 transition hover:text-black"
              >
                <ArrowLeft className="h-3 w-3" />
                Continue shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}