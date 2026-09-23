"use client";

import Link from "next/link";
import { ArrowRight, Loader2, PackageOpen, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "pressing"
  | "ready"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

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
  out_for_delivery: "On the move",
  completed: "Completed",
  cancelled: "Cancelled",
};

function money(value: number | string) {
  return `KSh ${Number(value).toLocaleString("en-KE")}`;
}

function dateTime(value: string) {
  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

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
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/auth";
        return;
      }

      const { data, error: orderError } = await supabase
        .from("orders")
        .select("id,order_number,fulfillment_type,payment_status,total,status,created_at")
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
        .select("order_id,product_name,quantity,line_total,size")
        .in("order_id", rows.map((order) => order.id));

      if (itemError) throw itemError;

      const grouped: Record<string, OrderItem[]> = {};
      for (const item of (itemData ?? []) as OrderItem[]) {
        (grouped[item.order_id] ??= []).push(item);
      }
      setItems(grouped);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not load your order history.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [supabase]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <main className="min-h-screen bg-[#f5f1e8] px-5 pb-24 pt-28 text-[#111] sm:px-8 lg:px-10 lg:pt-36">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col gap-7 border-b border-black/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/35">
              R&R PASSPORT / ORDER HISTORY
            </p>
            <h1 className="mt-4 font-serif text-5xl leading-[0.9] tracking-[-0.045em] sm:text-7xl">
              Every move.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-black/50">
              Your orders, kept together from first move to completed move.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void load(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 self-start border border-black/10 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] !text-black hover:bg-black hover:!text-white disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Loader2 size={22} className="animate-spin text-black/35" />
          </div>
        ) : error ? (
          <div className="mt-10 border border-red-200 bg-red-50 p-6 text-sm text-red-800">
            <p className="font-medium">We could not load your orders.</p>
            <p className="mt-2 leading-6">{error}</p>
            <button
              type="button"
              onClick={() => void load(true)}
              className="mt-6 border border-black/15 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] !text-black hover:bg-black hover:!text-white"
            >
              Try again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <section className="mt-10 border border-black/10 bg-white p-8 md:p-14">
            <PackageOpen size={28} strokeWidth={1.2} className="text-black/30" />
            <h2 className="mt-7 font-serif text-4xl tracking-[-0.04em]">No orders yet.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-black/50">
              Your current and completed orders will appear here after your first move.
            </p>
            <Link
              href="/menu"
              className="mt-8 inline-flex items-center gap-3 bg-black px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] !text-white hover:bg-[#292929] hover:!text-white"
            >
              Explore the menu <ArrowRight size={15} />
            </Link>
          </section>
        ) : (
          <div className="mt-10 divide-y divide-black/10 border-y border-black/10">
            {orders.map((order) => (
              <article key={order.id} className="py-8 md:py-10">
                <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                        {order.order_number}
                      </span>
                      <span className="text-xs text-black/35">{dateTime(order.created_at)}</span>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <span className="border border-black/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em]">
                        {statusLabels[order.status]}
                      </span>
                      <span className="text-xs uppercase tracking-[0.12em] text-black/40">
                        {order.fulfillment_type === "pickup" ? "Pickup" : "Delivery"}
                      </span>
                      <span className="text-xs uppercase tracking-[0.12em] text-black/40">
                        {order.payment_status === "paid" ? "Paid" : "Payment pending"}
                      </span>
                    </div>

                    <div className="mt-6 space-y-2">
                      {(items[order.id] ?? []).map((item, index) => (
                        <div key={`${order.id}-${item.product_name}-${index}`} className="flex flex-col gap-1 text-sm sm:flex-row sm:justify-between sm:gap-6">
                          <span className="text-black/75">
                            {item.quantity} × {item.product_name}
                            {item.size ? <span className="ml-2 text-xs uppercase tracking-[0.1em] text-black/30">{item.size}</span> : null}
                          </span>
                          <span className="text-black/45">{money(item.line_total)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:min-w-[210px] lg:text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">Order total</p>
                    <p className="mt-2 font-serif text-3xl">{money(order.total)}</p>
                    <div className="mt-6 flex flex-wrap gap-2 lg:justify-end">
                      {order.status !== "cancelled" ? (
                        <Link
                          href={`/account/orders/${encodeURIComponent(order.order_number)}`}
                          className="inline-flex items-center gap-2 border border-black/20 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] !text-black hover:bg-black hover:!text-white"
                        >
                          View order <ArrowRight size={13} />
                        </Link>
                      ) : null}
                      <Link
                        href="/menu"
                        className="inline-flex items-center gap-2 px-3 py-3 text-xs font-semibold uppercase tracking-[0.14em] !text-black/45 hover:!text-black"
                      >
                        Order again <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-10">
          <Link href="/account" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] !text-black/45 hover:!text-black">
            Back to Passport <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </main>
  );
}
