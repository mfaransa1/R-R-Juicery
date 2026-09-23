"use client";

import { useEffect, useState } from "react";
import { getMyOrders, type AccountOrder } from "@/lib/supabase/account";

const statusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  pressing: "Pressing",
  ready: "Ready",
  out_for_delivery: "Out for delivery",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function AccountOrders() {
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      setOrders(await getMyOrders());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="border-t border-black/10 py-12">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="rr-kicker">ORDER HISTORY</span>
          <h2 className="rr-editorial mt-3 text-4xl sm:text-5xl">
            Your moves.
          </h2>
        </div>

        <button
          type="button"
          onClick={load}
          className="text-xs font-bold uppercase tracking-[0.14em] underline underline-offset-4"
        >
          Refresh
        </button>
      </div>

      {loading && (
        <p className="mt-8 text-sm text-black/50">Loading your orders...</p>
      )}

      {error && (
        <div className="mt-8 border border-red-900/15 bg-red-50 p-4 text-sm text-red-900">
          {error}
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="mt-8 border border-black/10 bg-white p-8">
          <p className="text-sm leading-7 text-black/60">
            No orders yet. Your first move is waiting.
          </p>
          <a
            href="/menu"
            className="mt-5 inline-flex bg-black px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white"
          >
            Explore the menu
          </a>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div className="mt-8 overflow-x-auto border-t border-black/10">
          <table className="w-full min-w-[700px] text-left">
            <thead className="border-b border-black/10 text-[10px] font-bold uppercase tracking-[0.14em] text-black/45">
              <tr>
                <th className="py-4 pr-4">Order</th>
                <th className="py-4 pr-4">Date</th>
                <th className="py-4 pr-4">Status</th>
                <th className="py-4 pr-4">Fulfilment</th>
                <th className="py-4 text-right">Total</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-black/10">
                  <td className="py-5 pr-4 font-mono text-xs">
                    {order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="py-5 pr-4 text-sm text-black/60">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-5 pr-4 text-sm">
                    {statusLabels[order.status] ?? order.status}
                  </td>
                  <td className="py-5 pr-4 text-sm capitalize text-black/60">
                    {order.fulfillment_type}
                  </td>
                  <td className="py-5 text-right text-sm font-semibold">
                    KSh {Number(order.total).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
