"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw, ShoppingBag, TrendingUp } from "lucide-react";
import {
  AnalyticsCustomer,
  AnalyticsOrder,
  getCustomerActivity,
} from "@/lib/supabase/adminAnalytics";

const money = (value: number) =>
  `KSh ${Math.round(value).toLocaleString("en-KE")}`;

const label = (value: string) => value.replaceAll("_", " ");

export default function AdminCustomerActivity({
  customerId,
}: {
  customerId: string;
}) {
  const [customer, setCustomer] = useState<AnalyticsCustomer | null>(null);
  const [orders, setOrders] = useState<AnalyticsOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const data = await getCustomerActivity(customerId);
      setCustomer(data.customer);
      setOrders(data.orders);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load customer activity.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [customerId]);

  const stats = useMemo(() => {
    const spend = orders.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0,
    );

    const completed = orders.filter(
      (order) => order.status === "completed",
    ).length;

    const average = orders.length ? spend / orders.length : 0;

    return {
      spend,
      completed,
      average,
    };
  }, [orders]);

  if (loading) {
    return (
      <div className="flex min-h-48 items-center justify-center border border-black/10 bg-white">
        <Loader2 size={21} className="animate-spin" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="border border-red-900/20 bg-red-50 p-5 text-sm text-red-900">
        {error || "Customer not found."}
      </div>
    );
  }

  return (
    <section className="mt-8 space-y-6">
      <div className="flex items-end justify-between border-b border-black/10 pb-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
            Customer intelligence
          </p>
          <h2 className="mt-2 font-serif text-3xl">
            {customer.full_name || "Customer activity"}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-2 border border-black/15 bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em]"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="border border-black/10 bg-white p-5">
          <ShoppingBag size={17} />
          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">
            Orders
          </p>
          <p className="mt-2 font-serif text-3xl">{orders.length}</p>
        </div>

        <div className="border border-black/10 bg-white p-5">
          <TrendingUp size={17} />
          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">
            Lifetime spend
          </p>
          <p className="mt-2 font-serif text-3xl">{money(stats.spend)}</p>
        </div>

        <div className="border border-black/10 bg-white p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">
            Average order
          </p>
          <p className="mt-5 font-serif text-3xl">{money(stats.average)}</p>
          <p className="mt-2 text-xs text-black/40">
            {stats.completed} completed
          </p>
        </div>
      </div>

      <div className="border border-black/10 bg-white">
        <div className="border-b border-black/10 px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">
            Activity
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="px-5 py-10 text-sm text-black/45">
            No orders recorded for this customer yet.
          </div>
        ) : (
          <div className="divide-y divide-black/10">
            {orders.map((order) => (
              <div
                key={order.id}
                className="grid gap-3 px-5 py-4 md:grid-cols-[1fr_auto_auto_auto] md:items-center"
              >
                <div>
                  <p className="font-mono text-sm">
                    {order.order_number || order.id}
                  </p>
                  <p className="mt-1 text-xs text-black/40">
                    {new Date(order.created_at).toLocaleString("en-KE")}
                  </p>
                </div>

                <p className="text-xs uppercase tracking-[0.1em] text-black/55">
                  {label(order.status)}
                </p>

                <p className="text-xs text-black/45">
                  {label(order.fulfillment_type)}
                </p>

                <p className="font-mono text-sm">
                  {money(Number(order.total))}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
