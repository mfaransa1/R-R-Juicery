/* Replace components/order/LiveOrderTracker.tsx with this version. */
"use client";

import { useEffect, useRef, useState } from "react";
import {
  getMyOrder,
  getMyOrderItems,
  type CustomerOrder,
  type CustomerOrderItem,
} from "@/lib/supabase/orderTracking";
import {
  subscribeToMyOrder,
  unsubscribeFromOrder,
} from "@/lib/supabase/orderRealtime";
import type { RealtimeChannel } from "@supabase/supabase-js";

const stages = [
  { key: "pending", label: "Order received" },
  { key: "confirmed", label: "Confirmed" },
  { key: "preparing", label: "Preparing" },
  { key: "pressing", label: "Pressing" },
  { key: "ready", label: "Ready" },
  { key: "out_for_delivery", label: "On the move" },
  { key: "completed", label: "Completed" },
];

const stageIndex: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  preparing: 2,
  pressing: 3,
  ready: 4,
  out_for_delivery: 5,
  completed: 6,
};

function money(value: number) {
  return `KSh ${Number(value).toLocaleString("en-KE")}`;
}

export default function LiveOrderTracker() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [items, setItems] = useState<CustomerOrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [live, setLive] = useState(false);
  const [linkedFromHistory, setLinkedFromHistory] = useState(false);

  const channelRef = useRef<RealtimeChannel | null>(null);

  async function clearRealtime() {
    if (channelRef.current) {
      unsubscribeFromOrder(channelRef.current);
      channelRef.current = null;
    }
    setLive(false);
  }

  async function loadOrder(id: string, showLoading = true) {
    if (!id.trim()) return;

    if (showLoading) setLoading(true);
    else setRefreshing(true);

    try {
      const found = await getMyOrder(id.trim());
      const foundItems = await getMyOrderItems(found.id);

      setOrder(found);
      // Keep the customer-facing R&R reference in the field rather than
      // replacing it with the internal Supabase UUID.
      setOrderId(found.order_number ?? found.id);
      setItems(foundItems);
      setError("");

      await clearRealtime();

      const channel = subscribeToMyOrder(found.id, async () => {
        try {
          const updated = await getMyOrder(found.id);
          const updatedItems = await getMyOrderItems(found.id);

          setOrder(updated);
          setItems(updatedItems);
          setLive(true);
        } catch {
          // Manual refresh remains available if a realtime event arrives
          // while the authentication/session state is changing.
        }
      });

      channelRef.current = channel;
      setLive(true);
    } catch (err) {
      setOrder(null);
      setItems([]);
      setError(err instanceof Error ? err.message : "Unable to find order.");
      await clearRealtime();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function lookup() {
    const id = orderId.trim();

    if (!id) {
      setError("Enter an order reference.");
      return;
    }

    await loadOrder(id);
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const linkedOrder = params.get("order");

    if (linkedOrder?.trim()) {
      setLinkedFromHistory(true);
      setOrderId(linkedOrder.trim());
      void loadOrder(linkedOrder.trim());
    }

    return () => {
      if (channelRef.current) {
        unsubscribeFromOrder(channelRef.current);
      }
    };
    // The initial URL lookup intentionally runs once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentIndex =
    order?.status === "cancelled"
      ? -1
      : stageIndex[order?.status ?? "pending"] ?? 0;

  return (
    <section className="bg-[var(--rr-paper)]">
      <div className="rr-container py-16 sm:py-24">
        <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <span className="rr-kicker">ORDER LOOKUP</span>

            <h2 className="rr-editorial mt-5 text-5xl leading-[0.92] sm:text-6xl">
              Where&apos;s
              <br />
              your move?
            </h2>

            <p className="mt-7 max-w-md text-sm leading-7 text-black/60">
              Enter the order reference from your R&R confirmation. Your order
              details are visible only to the signed-in account that placed it.
            </p>

            {!linkedFromHistory && (
              <div className="mt-9 flex max-w-md flex-col gap-3 sm:flex-row">
                <input
                value={orderId}
                onChange={(event) => setOrderId(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") void lookup();
                }}
                placeholder="Order reference"
                className="min-h-12 flex-1 border border-black/15 bg-white px-4 text-sm outline-none focus:border-black"
                />

                <button
                type="button"
                onClick={() => void lookup()}
                disabled={loading || !orderId.trim()}
                className="min-h-12 bg-black px-7 text-xs font-bold uppercase tracking-[0.14em] text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "Looking..." : "Track order"}
                </button>
              </div>
            )}

            {linkedFromHistory && order && (
              <div className="mt-8 max-w-md border-t border-black/10 pt-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-black/40">
                  Opened from your order history
                </p>
                <p className="mt-2 font-mono text-sm tracking-[0.06em]">
                  {order.order_number ?? order.id}
                </p>
                <a
                  href="/account#order-history"
                  className="mt-4 inline-block text-[10px] font-bold uppercase tracking-[0.14em] underline underline-offset-4"
                >
                  Back to order history
                </a>
              </div>
            )}

            {error && (
              <div className="mt-5 max-w-md border border-red-900/15 bg-red-50 p-4 text-sm leading-6 text-red-900">
                {error}
              </div>
            )}

            {!order && !error && (
              <a
                href="/auth?next=/order"
                className="mt-6 inline-block text-[10px] font-bold uppercase tracking-[0.14em] underline underline-offset-4"
              >
                Sign in to access your orders
              </a>
            )}
          </div>

          {order && (
            <div className="border-t border-black/10 pt-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="rr-kicker">ORDER</span>

                    {live && (
                      <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-black/40">
                        <span className="h-1.5 w-1.5 rounded-full bg-black" />
                        Live
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2 font-mono text-sm tracking-[0.08em]">
                    {order.order_number ?? order.id.toUpperCase()}
                  </h3>
                </div>

                <div className="flex items-center gap-4 text-sm text-black/55">
                  <span>{new Date(order.created_at).toLocaleString()}</span>

                  <button
                    type="button"
                    onClick={() => void loadOrder(order.id, false)}
                    disabled={refreshing}
                    className="text-[10px] font-bold uppercase tracking-[0.12em] underline underline-offset-4 disabled:opacity-40"
                  >
                    {refreshing ? "Updating..." : "Refresh"}
                  </button>
                </div>
              </div>

              {order.status === "cancelled" ? (
                <div className="mt-10 border border-red-900/15 bg-red-50 p-6">
                  <span className="rr-kicker text-red-900">CANCELLED</span>
                  <p className="mt-3 text-sm leading-7 text-red-900/75">
                    This order has been cancelled. Contact the House if you
                    need help with the order.
                  </p>
                </div>
              ) : (
                <div className="mt-10">
                  <div className="relative">
                    {stages.map((stage, index) => {
                      const complete = index <= currentIndex;
                      const active = index === currentIndex;

                      return (
                        <div
                          key={stage.key}
                          className="relative flex gap-5 pb-8 last:pb-0"
                        >
                          {index < stages.length - 1 && (
                            <span
                              className={`absolute left-[7px] top-4 h-full w-px ${
                                index < currentIndex
                                  ? "bg-black"
                                  : "bg-black/10"
                              }`}
                            />
                          )}

                          <span
                            className={`relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border ${
                              complete
                                ? "border-black bg-black"
                                : "border-black/20 bg-[var(--rr-paper)]"
                            }`}
                          />

                          <div>
                            <p
                              className={`text-sm ${
                                active ? "font-semibold" : "text-black/55"
                              }`}
                            >
                              {stage.label}
                            </p>

                            {active && (
                              <p className="mt-1 text-xs uppercase tracking-[0.12em] text-black/40">
                                Current status · updates automatically
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-10 border-t border-black/10 pt-8">
                <span className="rr-kicker">ORDER DETAILS</span>

                <div className="mt-5 space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between gap-5 text-sm"
                    >
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="mt-1 text-xs text-black/45">
                          {item.quantity} × {item.size}
                        </p>
                      </div>

                      <p className="shrink-0">
                        {money(Number(item.line_total))}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-7 space-y-2 border-t border-black/10 pt-5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-black/50">Subtotal</span>
                    <span>{money(Number(order.subtotal))}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-black/50">Delivery</span>
                    <span>{money(Number(order.delivery_fee))}</span>
                  </div>

                  <div className="flex justify-between pt-2 text-base font-semibold">
                    <span>Total</span>
                    <span>{money(Number(order.total))}</span>
                  </div>
                </div>

                <div className="mt-7 grid gap-5 border-t border-black/10 pt-6 sm:grid-cols-2">
                  <div>
                    <span className="rr-kicker">FULFILMENT</span>
                    <p className="mt-2 text-sm capitalize">
                      {order.fulfillment_type}
                    </p>
                  </div>

                  <div>
                    <span className="rr-kicker">PAYMENT</span>
                    <p className="mt-2 text-sm capitalize">
                      {order.payment_method} · {order.payment_status}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
