"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Loader2,
  MapPin,
  PackageCheck,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import {
  getMyOrderDetail,
  type CustomerOrderDetail,
  type CustomerOrderDetailItem,
} from "@/lib/supabase/accountOrderDetails";

const labels: Record<string, string> = {
  pending: "Order received",
  confirmed: "Confirmed",
  preparing: "Preparing",
  pressing: "Pressing",
  ready: "Ready",
  out_for_delivery: "On the move",
  completed: "Completed",
  cancelled: "Cancelled",
};

const steps = [
  "pending",
  "confirmed",
  "preparing",
  "pressing",
  "ready",
  "completed",
];

const money = (value: number | string) => `KSh ${Number(value).toLocaleString("en-KE")}`;

function dateTime(value: string) {
  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusIndex(status: string) {
  if (status === "out_for_delivery") return 4;
  return steps.indexOf(status);
}

export default function AccountOrderDetail({ reference }: { reference: string }) {
  const [order, setOrder] = useState<CustomerOrderDetail | null>(null);
  const [items, setItems] = useState<CustomerOrderDetailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function load(refresh = false) {
    refresh ? setRefreshing(true) : setLoading(true);
    setError("");
    try {
      const result = await getMyOrderDetail(decodeURIComponent(reference));
      setOrder(result.order);
      setItems(result.items);
    } catch (err) {
      setOrder(null);
      setItems([]);
      setError(err instanceof Error ? err.message : "Unable to load this order.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void load();
  }, [reference]);

  const activeStep = useMemo(() => statusIndex(order?.status ?? "pending"), [order?.status]);

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-[#f5f1e8] px-5 py-28 sm:px-8 lg:px-14">
        <div className="mx-auto flex max-w-[1100px] justify-center">
          <Loader2 className="animate-spin" />
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-[70vh] bg-[#f5f1e8] px-5 py-20 sm:px-8 lg:px-14">
        <div className="mx-auto max-w-[1000px]">
          <Link href="/account/orders" className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.15em] !text-black/50 hover:!text-black">
            <ArrowLeft size={14} className="mr-2" /> Your orders
          </Link>
          <div className="mt-16 border-t border-black/15 pt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-black/40">ORDER DETAILS</p>
            <h1 className="mt-5 font-serif text-5xl leading-none sm:text-7xl">Order not found.</h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-black/55">{error}</p>
            <button
              type="button"
              onClick={() => void load(true)}
              className="mt-8 inline-flex items-center border border-black/20 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] !text-black hover:bg-black hover:!text-white"
            >
              <RefreshCw size={14} className="mr-2" /> Try again
            </button>
          </div>
        </div>
      </main>
    );
  }

  const cancelled = order.status === "cancelled";
  const currentIndex = Math.max(activeStep, 0);

  return (
    <main className="bg-[#f5f1e8] px-5 py-14 text-[#111] sm:px-8 sm:py-20 lg:px-14 lg:py-24">
      <div className="mx-auto max-w-[1100px]">
        <div className="flex flex-col gap-6 border-b border-black/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/account/orders" className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.15em] !text-black/50 hover:!text-black">
              <ArrowLeft size={14} className="mr-2" /> Your orders
            </Link>
            <p className="mt-9 text-xs font-semibold uppercase tracking-[0.28em] text-black/40">R&R PASSPORT / ORDER</p>
            <h1 className="mt-4 font-serif text-5xl leading-[0.9] tracking-[-0.045em] sm:text-7xl">{order.order_number}</h1>
            <p className="mt-5 text-sm text-black/50">Placed {dateTime(order.created_at)}</p>
          </div>

          <div className="flex items-center gap-2 sm:text-right">
            <span className="inline-flex border border-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em]">
              {labels[order.status] ?? order.status}
            </span>
            <button
              type="button"
              onClick={() => void load(true)}
              disabled={refreshing}
              className="inline-flex items-center border border-black/15 bg-white px-3 py-2 text-xs uppercase tracking-[0.12em] !text-black hover:bg-black hover:!text-white disabled:opacity-50"
            >
              <RefreshCw size={13} className={refreshing ? "mr-2 animate-spin" : "mr-2"} /> Refresh
            </button>
          </div>
        </div>

        {cancelled ? (
          <div className="mt-10 border border-red-900/15 bg-red-50 p-6 text-sm leading-7 text-red-900">
            This order was cancelled and cannot continue through the R&R preparation flow.
          </div>
        ) : (
          <section className="mt-10 border border-black/10 bg-white p-7 md:p-10">
            <div className="flex items-end justify-between gap-5 border-b border-black/10 pb-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-black/35">YOUR ORDER IS MOVING</p>
                <h2 className="mt-2 font-serif text-3xl">{labels[order.status] ?? order.status}</h2>
              </div>
              <Clock3 size={21} className="text-black/25" />
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-3 lg:grid-cols-6">
              {steps.map((step, index) => {
                const complete = index <= currentIndex;
                const current = step === order.status || (order.status === "out_for_delivery" && step === "ready");
                return (
                  <div key={step} className="relative">
                    {index > 0 ? <div className={`absolute -left-6 top-3 hidden h-px w-6 sm:block ${complete ? "bg-black" : "bg-black/10"}`} /> : null}
                    <div className={`flex h-7 w-7 items-center justify-center border ${complete ? "border-black bg-black !text-white" : "border-black/15 bg-white text-black/25"}`}>
                      {complete ? <Check size={13} /> : <span className="text-[9px]">{index + 1}</span>}
                    </div>
                    <p className={`mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] ${current ? "text-black" : "text-black/35"}`}>
                      {labels[step]}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <div className="grid gap-10 py-10 lg:grid-cols-[1fr_330px]">
          <div>
            <div className="flex items-end justify-between border-b border-black/15 pb-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/35">YOUR BOTTLES</p>
                <h2 className="mt-2 font-serif text-3xl">What you ordered</h2>
              </div>
              <ShoppingBag size={19} className="text-black/25" />
            </div>

            <div className="border-b border-black/10">
              {items.map((item) => (
                <div key={item.id} className="flex gap-5 border-b border-black/10 py-6 last:border-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-black/10 text-xs font-semibold">{item.quantity}×</div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{item.product_name}</p>
                    {item.size ? <p className="mt-1 text-xs uppercase tracking-[0.12em] text-black/40">{item.size}</p> : null}
                    <p className="mt-2 text-xs text-black/45">{money(item.unit_price)} each</p>
                  </div>
                  <p className="font-medium">{money(item.line_total)}</p>
                </div>
              ))}
            </div>

            <div className="ml-auto mt-8 max-w-sm space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-black/50">Subtotal</span><span>{money(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-black/50">Delivery</span><span>{Number(order.delivery_fee) ? money(order.delivery_fee) : "Free"}</span></div>
              <div className="mt-4 flex justify-between border-t border-black/20 pt-5 text-lg"><span>Total</span><span className="font-serif text-2xl">{money(order.total)}</span></div>
            </div>
          </div>

          <aside className="border border-black/10 bg-white p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/40">ORDER SNAPSHOT</p>
            <div className="mt-7 space-y-6">
              <div className="flex gap-4"><PackageCheck size={18} strokeWidth={1.4} /><div><p className="text-xs uppercase tracking-[0.12em] text-black/40">Fulfilment</p><p className="mt-1 text-sm">{order.fulfillment_type === "pickup" ? "Pickup" : "Delivery"}</p></div></div>
              <div className="flex gap-4"><MapPin size={18} strokeWidth={1.4} /><div><p className="text-xs uppercase tracking-[0.12em] text-black/40">Payment method</p><p className="mt-1 text-sm capitalize">{order.payment_method.replaceAll("_", " ")}</p></div></div>
              <div className="flex gap-4"><Clock3 size={18} strokeWidth={1.4} /><div><p className="text-xs uppercase tracking-[0.12em] text-black/40">Payment status</p><p className="mt-1 text-sm capitalize">{order.payment_status}</p></div></div>
            </div>

            <div className="mt-9 border-t border-black/10 pt-7">
              {!cancelled ? (
                <Link
                  href={`/order?order=${encodeURIComponent(order.order_number)}`}
                  className="flex w-full items-center justify-center bg-black px-5 py-4 text-xs font-semibold uppercase tracking-[0.15em] !text-white hover:bg-[#292929] hover:!text-white"
                >
                  Track this order <ArrowRight size={14} className="ml-2" />
                </Link>
              ) : null}
              <Link
                href="/menu"
                className="mt-3 flex w-full items-center justify-center border border-black/15 px-5 py-4 text-xs font-semibold uppercase tracking-[0.15em] !text-black hover:bg-black hover:!text-white"
              >
                Order again <ArrowRight size={14} className="ml-2" />
              </Link>
            </div>
          </aside>
        </div>

        <div className="border-t border-black/15 pt-7 text-xs leading-6 text-black/45">
          <span className="mr-2 inline-flex align-middle"><Check size={14} /></span>
          This order is connected to your signed-in R&R Passport. Only you can view its details.
        </div>
      </div>
    </main>
  );
}
