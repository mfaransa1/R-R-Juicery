"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect } from "react";

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

  // Prevent the page behind the basket from scrolling.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Allow ESC to close the basket.
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] text-[#111111]">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close basket overlay"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 !text-white"
      />

      {/* Basket */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your basket"
        className="fixed right-0 top-0 flex h-[100dvh] max-h-[100dvh] w-full max-w-[520px] flex-col overflow-hidden border-l border-black/10 bg-[#f5f1e8] !text-[#111111] shadow-2xl"
      >
        {/* Header */}
        <header className="shrink-0 border-b border-black/10 bg-[#f5f1e8] px-6 py-5 sm:px-7 sm:py-6">
          <div className="flex items-center justify-between gap-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] !text-black/45">
                R&R MOVES
              </p>

              <h2 className="mt-2 font-serif text-3xl leading-none !text-black sm:text-4xl">
                Your basket
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 shrink-0 items-center justify-center border border-black/15 bg-transparent !text-black transition hover:bg-black hover:!text-white"
              aria-label="Close basket"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Scrollable basket content */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#f5f1e8] px-6 py-6 !text-[#111111] sm:px-7">
          {items.length === 0 ? (
            <div className="flex min-h-full flex-col items-center justify-center py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center border border-black/10 !text-black">
                <ShoppingBag
                  className="h-6 w-6"
                  strokeWidth={1.4}
                />
              </div>

              <h3 className="mt-6 font-serif text-3xl leading-none !text-black">
                Nothing in the basket.
              </h3>

              <p className="mt-4 max-w-xs text-sm leading-6 !text-black/55">
                Choose a pour from the menu and make your move.
              </p>

              <Link
                href="/menu"
                onClick={onClose}
                className="mt-8 inline-flex border border-black bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] !text-white transition hover:bg-white hover:!text-black"
              >
                Explore menu
              </Link>
            </div>
          ) : (
            <div>
              <div className="mb-6 flex items-center justify-between border-b border-black/10 pb-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] !text-black/45">
                  {itemCount}{" "}
                  {itemCount === 1 ? "ITEM" : "ITEMS"}
                </p>

                <p className="text-[10px] uppercase tracking-[0.18em] !text-black/35">
                  R&R BASKET
                </p>
              </div>

              {items.map((item) => (
                <div
                  key={item.productId}
                  className="border-b border-black/10 py-6 first:pt-0"
                >
                  <div className="flex gap-4">
                    {/* Product image */}
                    <div className="h-24 w-20 shrink-0 overflow-hidden bg-black/5">
                      {item.imagePath ? (
                        <img
                          src={item.imagePath}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-black/5 !text-black/25">
                          <ShoppingBag className="h-5 w-5" />
                        </div>
                      )}
                    </div>

                    {/* Product information */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-serif text-xl leading-none !text-black">
                            {item.name}
                          </h3>

                          <p className="mt-2 text-xs uppercase tracking-[0.12em] !text-black/45">
                            {item.size}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(item.productId)
                          }
                          className="shrink-0 !text-black/40 transition hover:!text-black"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Quantity + price */}
                      <div className="mt-5 flex items-center justify-between gap-4">
                        <div className="flex items-center border border-black/15 !text-black">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity - 1,
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center !text-black transition hover:bg-black hover:!text-white"
                            aria-label={`Decrease ${item.name} quantity`}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>

                          <span className="flex h-8 w-8 items-center justify-center border-x border-black/10 text-xs font-semibold !text-black">
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
                            className="flex h-8 w-8 items-center justify-center !text-black transition hover:bg-black hover:!text-white"
                            aria-label={`Increase ${item.name} quantity`}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <span className="text-sm font-semibold !text-black">
                          KSh{" "}
                          {(
                            item.price * item.quantity
                          ).toLocaleString("en-KE")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fixed footer inside drawer */}
        {items.length > 0 && (
          <footer className="shrink-0 border-t border-black/10 bg-[#f5f1e8] px-6 py-5 sm:px-7 sm:py-6">
            <div className="flex items-end justify-between gap-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] !text-black/45">
                  Subtotal
                </p>

                <p className="mt-1 text-xs !text-black/40">
                  {itemCount}{" "}
                  {itemCount === 1 ? "item" : "items"} in your basket.
                </p>
              </div>

              <span className="font-serif text-2xl !text-black">
                KSh {subtotal.toLocaleString("en-KE")}
              </span>
            </div>

            <p className="mt-3 text-[10px] leading-5 !text-black/40">
              Delivery pricing is calculated during checkout.
            </p>

            <Link
              href="/checkout"
              onClick={onClose}
              className="mt-5 flex min-h-13 w-full items-center justify-center bg-black px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] !text-white transition hover:bg-[#292929]"
            >
              Checkout
            </Link>
          </footer>
        )}
      </aside>
    </div>
  );
}