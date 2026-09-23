"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  Loader2,
  Package,
  RefreshCw,
  Search,
  Truck,
  X,
} from "lucide-react";
import {
  AdminOrder,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  getAdminOrders,
  getOrderItems,
  updateOrderPaymentStatus,
  updateOrderStatus,
} from "@/lib/supabase/orders";

const statuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "pressing",
  "ready",
  "out_for_delivery",
  "completed",
  "cancelled",
];

const paymentStatuses: PaymentStatus[] = [
  "pending",
  "paid",
  "failed",
  "refunded",
];

const statusLabel = (value: string) =>
  value.replaceAll("_", " ");

const statusIcon: Record<OrderStatus, typeof Clock3> = {
  pending: Clock3,
  confirmed: CheckCircle2,
  preparing: Package,
  pressing: Package,
  ready: CheckCircle2,
  out_for_delivery: Truck,
  completed: CheckCircle2,
  cancelled: X,
};

const statusTone: Record<OrderStatus, string> = {
  pending: "bg-[#f5f1e8]",
  confirmed: "bg-white",
  preparing: "bg-white",
  pressing: "bg-white",
  ready: "bg-white",
  out_for_delivery: "bg-white",
  completed: "bg-white",
  cancelled: "bg-red-50 text-red-900",
};

const money = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 0,
});

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [selected, setSelected] = useState<AdminOrder | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  async function load() {
    setLoading(true);
    setError("");

    try {
      setOrders(await getAdminOrders());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesFilter = filter === "all" || order.status === filter;

      const matchesSearch =
        !q ||
        [
          order.order_number,
          order.customer_name,
          order.customer_phone,
          order.customer_email ?? "",
          order.fulfillment_type,
          order.status,
          order.payment_status,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [orders, search, filter]);

  async function openOrder(order: AdminOrder) {
    setSelected(order);
    setItems([]);
    setItemsLoading(true);
    setError("");

    try {
      setItems(await getOrderItems(order.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load order items.");
    } finally {
      setItemsLoading(false);
    }
  }

  async function changeStatus(status: OrderStatus) {
    if (!selected) return;

    setUpdating(true);
    setError("");
    setNotice("");

    try {
      const updated = await updateOrderStatus(selected.id, status);
      setSelected(updated);
      setOrders((current) =>
        current.map((order) => (order.id === updated.id ? updated : order)),
      );
      setNotice(`Order ${updated.order_number} is now ${statusLabel(status)}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update order.");
    } finally {
      setUpdating(false);
    }
  }

  async function changePaymentStatus(paymentStatus: PaymentStatus) {
    if (!selected) return;

    setUpdating(true);
    setError("");
    setNotice("");

    try {
      const updated = await updateOrderPaymentStatus(
        selected.id,
        paymentStatus,
      );
      setSelected(updated);
      setOrders((current) =>
        current.map((order) => (order.id === updated.id ? updated : order)),
      );
      setNotice(`Payment marked ${statusLabel(paymentStatus)}.`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update payment status.",
      );
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 border-b border-black/10 pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-black/45">
            Operations
          </p>
          <h1 className="font-serif text-4xl tracking-[-0.03em] md:text-5xl">
            Orders.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/55">
            Live order records, fulfillment status and payment status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center justify-center gap-2 border border-black/15 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em]"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="border border-red-900/20 bg-red-50 px-4 py-3 text-sm text-red-900">
          {error}
        </div>
      )}

      {notice && (
        <div className="flex items-center justify-between border border-black/10 bg-white px-4 py-3 text-sm">
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3 border-y border-black/10 py-4 lg:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-black/35"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search order number, customer or phone..."
            className="w-full border border-black/15 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-black"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`whitespace-nowrap border px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] ${
              filter === "all"
                ? "border-black bg-black text-white"
                : "border-black/15 bg-white"
            }`}
          >
            All
          </button>

          {statuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`whitespace-nowrap border px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                filter === status
                  ? "border-black bg-black text-white"
                  : "border-black/15 bg-white"
              }`}
            >
              {statusLabel(status)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-56 items-center justify-center border border-black/10 bg-white">
          <Loader2 size={22} className="animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-black/10 bg-white px-6 py-16 text-center">
          <p className="font-serif text-2xl">No orders found.</p>
          <p className="mt-2 text-sm text-black/50">
            Orders created through the checkout will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-black/10 bg-white">
          <table className="w-full min-w-[1100px] border-collapse text-left">
            <thead>
              <tr className="border-b border-black/10 bg-[#f5f1e8] text-[10px] uppercase tracking-[0.16em] text-black/45">
                <th className="px-5 py-4">Order</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Fulfillment</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Payment</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4">Created</th>
                <th className="px-5 py-4 text-right">View</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const Icon = statusIcon[order.status];

                return (
                  <tr
                    key={order.id}
                    className="border-b border-black/10 last:border-0"
                  >
                    <td className="px-5 py-5">
                      <p className="font-mono text-sm">{order.order_number}</p>
                    </td>

                    <td className="px-5 py-5">
                      <p className="font-serif text-lg">{order.customer_name}</p>
                      <p className="mt-1 text-xs text-black/45">
                        {order.customer_phone}
                      </p>
                    </td>

                    <td className="px-5 py-5">
                      <span className="text-xs uppercase tracking-[0.1em]">
                        {order.fulfillment_type}
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <span
                        className={`inline-flex items-center gap-2 border border-black/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] ${statusTone[order.status]}`}
                      >
                        <Icon size={12} />
                        {statusLabel(order.status)}
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <p className="text-xs uppercase tracking-[0.1em]">
                        {order.payment_method}
                      </p>
                      <p className="mt-1 text-[10px] text-black/45">
                        {statusLabel(order.payment_status)}
                      </p>
                    </td>

                    <td className="px-5 py-5 font-mono text-sm">
                      {money.format(order.total)}
                    </td>

                    <td className="px-5 py-5 text-xs text-black/50">
                      {new Date(order.created_at).toLocaleString("en-KE")}
                    </td>

                    <td className="px-5 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="border border-black/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] hover:border-black"
                        >
                          Details
                        </Link>

                        <button
                          type="button"
                          onClick={() => void openOrder(order)}
                          className="border border-black/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] hover:border-black"
                        >
                          Quick View
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 md:p-8">
          <div className="mx-auto max-w-5xl bg-[#f5f1e8]">
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-5 md:px-8">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
                  Order record
                </p>
                <h2 className="mt-1 font-serif text-3xl">
                  {selected.order_number}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="border border-black/15 p-2"
                aria-label="Close order"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-7 p-6 md:p-8">
              <div className="grid gap-4 md:grid-cols-4">
                <Info label="Customer" value={selected.customer_name} />
                <Info label="Phone" value={selected.customer_phone} />
                <Info
                  label="Fulfillment"
                  value={selected.fulfillment_type}
                />
                <Info label="Total" value={money.format(selected.total)} />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="border border-black/10 bg-white p-5">
                  <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/45">
                    Fulfillment
                  </p>

                  {selected.fulfillment_type === "delivery" ? (
                    <>
                      <p className="text-sm">
                        {selected.delivery_address || "Address not provided"}
                      </p>
                      {selected.delivery_notes && (
                        <p className="mt-3 text-sm text-black/55">
                          {selected.delivery_notes}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm">
                      Pickup at Rook & Reed Juicery.
                    </p>
                  )}
                </div>

                <div className="border border-black/10 bg-white p-5">
                  <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/45">
                    Payment
                  </p>
                  <p className="text-sm uppercase tracking-[0.08em]">
                    {selected.payment_method}
                  </p>
                  <p className="mt-2 text-sm text-black/55">
                    {statusLabel(selected.payment_status)}
                  </p>
                </div>
              </div>

              <div className="border border-black/10 bg-white">
                <div className="border-b border-black/10 px-5 py-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/45">
                    Items
                  </p>
                </div>

                {itemsLoading ? (
                  <div className="flex min-h-32 items-center justify-center">
                    <Loader2 size={20} className="animate-spin" />
                  </div>
                ) : items.length === 0 ? (
                  <div className="px-5 py-10 text-sm text-black/50">
                    No order items recorded.
                  </div>
                ) : (
                  <div>
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between border-b border-black/10 px-5 py-4 last:border-0"
                      >
                        <div>
                          <p className="font-serif text-lg">
                            {item.product_name}
                          </p>
                          <p className="mt-1 text-xs text-black/45">
                            {item.quantity} × {money.format(item.unit_price)}
                            {item.size ? ` · ${item.size}` : ""}
                          </p>
                        </div>
                        <p className="font-mono text-sm">
                          {money.format(item.line_total)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/45">
                    Order status
                  </p>
                  <div className="relative">
                    <select
                      disabled={updating}
                      value={selected.status}
                      onChange={(event) =>
                        void changeStatus(event.target.value as OrderStatus)
                      }
                      className="w-full appearance-none border border-black/15 bg-white px-4 py-3 text-sm uppercase tracking-[0.08em] outline-none focus:border-black"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {statusLabel(status)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/45">
                    Payment status
                  </p>
                  <div className="relative">
                    <select
                      disabled={updating}
                      value={selected.payment_status}
                      onChange={(event) =>
                        void changePaymentStatus(
                          event.target.value as PaymentStatus,
                        )
                      }
                      className="w-full appearance-none border border-black/15 bg-white px-4 py-3 text-sm uppercase tracking-[0.08em] outline-none focus:border-black"
                    >
                      {paymentStatuses.map((status) => (
                        <option key={status} value={status}>
                          {statusLabel(status)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                    />
                  </div>
                </div>
              </div>

              {selected.notes && (
                <div className="border border-black/10 bg-white p-5">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/45">
                    Notes
                  </p>
                  <p className="text-sm leading-6 text-black/65">
                    {selected.notes}
                  </p>
                </div>
              )}

              <div className="border-t border-black/10 pt-6">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="border border-black/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-black/10 bg-white p-4">
      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-black/40">
        {label}
      </p>
      <p className="mt-2 text-sm">{value}</p>
    </div>
  );
}
