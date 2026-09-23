/* R&R Passport order history component.
   Add this file as components/account/AccountOrderHistory.tsx */
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Loader2, PackageOpen, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type OrderStatus =
  | "pending" | "confirmed" | "preparing" | "pressing"
  | "ready" | "out_for_delivery" | "completed" | "cancelled";

type Order = {
  id: string;
  order_number: string;
  fulfillment_type: "pickup" | "delivery";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  total: number | string;
  status: OrderStatus;
  created_at: string;
};

type OrderItem = {
  order_id: string;
  product_name: string;
  quantity: number;
  line_total: number | string;
  size: string | null;
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  pressing: "Pressing",
  ready: "Ready",
  out_for_delivery: "Out for delivery",
  completed: "Completed",
  cancelled: "Cancelled",
};

const money = (v: number | string) =>
  `KSh ${Number(v).toLocaleString("en-KE")}`;

export default function AccountOrderHistory() {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [items, setItems] = useState<Record<string, OrderItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);
    setError("");

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setOrders([]);
        setItems({});
        return;
      }

      const { data, error: orderError } = await supabase
        .from("orders")
        .select("id, order_number, fulfillment_type, payment_status, total, status, created_at")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      if (orderError) throw orderError;

      const rows = (data ?? []) as Order[];
      setOrders(rows);

      if (!rows.length) {
        setItems({});
        return;
      }

      const { data: itemData, error: itemError } = await supabase
        .from("order_items")
        .select("order_id, product_name, quantity, line_total, size")
        .in("order_id", rows.map((order) => order.id));

      if (itemError) throw itemError;

      const grouped: Record<string, OrderItem[]> = {};
      for (const item of (itemData ?? []) as OrderItem[]) {
        (grouped[item.order_id] ??= []).push(item);
      }
      setItems(grouped);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "We could not load your order history."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section id="order-history" className="border-t border-white/10 bg-[#111] px-5 py-20 text-white sm:px-8 lg:px-14 lg:py-28">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col gap-6 border-b border-white/15 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
              ORDER HISTORY
            </p>
            <h2 className="mt-4 font-serif text-5xl leading-[0.9] tracking-[-0.045em] sm:text-7xl">
              Every order.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-6 text-white/50">
              Your R&R orders, kept together in your Passport.
            </p>
          </div>

          <button
            type="button"
            onClick={() => load(true)}
            disabled={refreshing}
            className="inline-flex w-fit items-center gap-2 border border-white/20 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex min-h-52 items-center justify-center">
            <Loader2 size={20} className="animate-spin text-white/50" />
          </div>
        ) : error ? (
          <div className="border-b border-white/10 py-10">
            <p className="font-serif text-2xl">We could not load your orders.</p>
            <p className="mt-2 text-sm leading-6 text-white/45">{error}</p>
            <button
              type="button"
              onClick={() => load(true)}
              className="mt-6 border border-white/25 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em]"
            >
              Try again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="border-b border-white/10 py-14">
            <PackageOpen size={25} strokeWidth={1.2} className="text-white/50" />
            <h3 className="mt-7 font-serif text-3xl">No orders yet.</h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/45">
              Your current and completed orders will appear here after your first order.
            </p>
            <Link
              href="/menu"
              className="mt-7 inline-flex bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] !text-black"
            >
              Explore the menu <ArrowRight size={14} className="ml-2" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {orders.map((order) => (
              <article key={order.id} className="py-8 sm:py-10">
                <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                        {order.order_number}
                      </span>
                      <span className="text-xs text-white/35">
                        {new Intl.DateTimeFormat("en-KE", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        }).format(new Date(order.created_at))}
                      </span>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <span className="border border-white/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em]">
                        {statusLabels[order.status]}
                      </span>
                      <span className="text-xs uppercase tracking-[0.12em] text-white/40">
                        {order.fulfillment_type === "pickup" ? "Pickup" : "Delivery"}
                      </span>
                      <span className="text-xs uppercase tracking-[0.12em] text-white/40">
                        {order.payment_status === "paid" ? "Paid" : "Payment pending"}
                      </span>
                    </div>

                    <div className="mt-6 space-y-2">
                      {(items[order.id] ?? []).map((item, index) => (
                        <div
                          key={`${order.id}-${item.product_name}-${index}`}
                          className="flex flex-col gap-1 text-sm sm:flex-row sm:justify-between"
                        >
                          <span className="text-white/75">
                            {item.quantity} × {item.product_name}
                            {item.size && (
                              <span className="ml-2 text-xs uppercase tracking-[0.1em] text-white/30">
                                {item.size}
                              </span>
                            )}
                          </span>
                          <span className="text-white/45">{money(item.line_total)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:min-w-[190px] lg:text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
                      Order total
                    </p>
                    <p className="mt-2 font-serif text-3xl">{money(order.total)}</p>
                    <div className="mt-6 flex flex-wrap gap-2 lg:justify-end">
                      {order.status !== "cancelled" && (
                        <Link
                          href={`/account/orders/${encodeURIComponent(order.order_number)}`}
                          className="inline-flex items-center border border-white/25 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em]"
                        >
                          View order <ArrowRight size={13} className="ml-2" />
                        </Link>
                      )}
                      <Link
                        href="/menu"
                        className="inline-flex px-3 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/45"
                      >
                        Order again
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
