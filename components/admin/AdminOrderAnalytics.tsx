"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { getControlRoomAnalytics, AnalyticsOrder } from "@/lib/supabase/adminAnalytics";

const money = (value: number) =>
  `KSh ${Math.round(value).toLocaleString("en-KE")}`;

const label = (value: string) => value.replaceAll("_", " ");

export default function AdminOrderAnalytics() {
  const [orders, setOrders] = useState<AnalyticsOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const data = await getControlRoomAnalytics();
      setOrders(data.orders);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load order analytics.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const analytics = useMemo(() => {
    const total = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const completed = orders.filter((order) => order.status === "completed");
    const completedRevenue = completed.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0,
    );

    const statusMap = new Map<string, number>();
    const fulfilmentMap = new Map<string, number>();
    const paymentMap = new Map<string, number>();

    orders.forEach((order) => {
      statusMap.set(order.status, (statusMap.get(order.status) || 0) + 1);
      fulfilmentMap.set(
        order.fulfillment_type,
        (fulfilmentMap.get(order.fulfillment_type) || 0) + 1,
      );
      paymentMap.set(
        order.payment_status,
        (paymentMap.get(order.payment_status) || 0) + 1,
      );
    });

    return {
      total,
      count: orders.length,
      average: orders.length ? total / orders.length : 0,
      completedCount: completed.length,
      completedRevenue,
      status: Array.from(statusMap.entries()).sort((a, b) => b[1] - a[1]),
      fulfilment: Array.from(fulfilmentMap.entries()).sort(
        (a, b) => b[1] - a[1],
      ),
      payments: Array.from(paymentMap.entries()).sort(
        (a, b) => b[1] - a[1],
      ),
    };
  }, [orders]);

  if (loading) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <Loader2 size={21} className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-900/20 bg-red-50 p-5 text-sm text-red-900">
        {error}
      </div>
    );
  }

  const group = (entries: [string, number][]) => (
    <div className="divide-y divide-black/10">
      {entries.length === 0 ? (
        <p className="py-6 text-sm text-black/45">No recorded data.</p>
      ) : (
        entries.map(([key, value]) => (
          <div key={key} className="flex items-center justify-between gap-4 py-4">
            <span className="text-sm capitalize">{label(key)}</span>
            <span className="font-mono text-sm">{value}</span>
          </div>
        ))
      )}
    </div>
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-black/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
            Order intelligence
          </p>
          <h2 className="mt-2 font-serif text-3xl">Order analytics.</h2>
          <p className="mt-2 text-sm text-black/45">
            Status, fulfilment, payment and recorded order value.
          </p>
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

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border border-black/10 bg-white p-5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-black/40">
            Orders
          </p>
          <p className="mt-2 font-serif text-3xl">{analytics.count}</p>
        </div>
        <div className="border border-black/10 bg-white p-5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-black/40">
            Recorded value
          </p>
          <p className="mt-2 font-serif text-3xl">{money(analytics.total)}</p>
        </div>
        <div className="border border-black/10 bg-white p-5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-black/40">
            Average order
          </p>
          <p className="mt-2 font-serif text-3xl">{money(analytics.average)}</p>
        </div>
        <div className="border border-black/10 bg-white p-5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-black/40">
            Completed value
          </p>
          <p className="mt-2 font-serif text-3xl">
            {money(analytics.completedRevenue)}
          </p>
          <p className="mt-2 text-xs text-black/40">
            {analytics.completedCount} completed orders
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="border border-black/10 bg-white p-5">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">
            By status
          </p>
          {group(analytics.status)}
        </div>

        <div className="border border-black/10 bg-white p-5">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">
            By fulfilment
          </p>
          {group(analytics.fulfilment)}
        </div>

        <div className="border border-black/10 bg-white p-5">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">
            By payment
          </p>
          {group(analytics.payments)}
        </div>
      </div>
    </section>
  );
}
