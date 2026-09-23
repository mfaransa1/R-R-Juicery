"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Clock3, Loader2, MapPin, PackageCheck, RefreshCw } from "lucide-react";
import { getMyOrderDetail, type CustomerOrderDetail, type CustomerOrderDetailItem } from "@/lib/supabase/accountOrderDetails";

const labels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  pressing: "Pressing",
  ready: "Ready",
  out_for_delivery: "On the move",
  completed: "Completed",
  cancelled: "Cancelled",
};

const money = (v: number | string) => `KSh ${Number(v).toLocaleString("en-KE")}`;

function dateTime(value: string) {
  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit",
  }).format(new Date(value));
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

  useEffect(() => { void load(); }, [reference]);

  if (loading) return <section className="min-h-[65vh] bg-[#f5f1e8] px-5 py-28 sm:px-8 lg:px-14"><div className="mx-auto flex max-w-[1100px] justify-center"><Loader2 className="animate-spin" /></div></section>;

  if (error || !order) return (
    <section className="min-h-[65vh] bg-[#f5f1e8] px-5 py-20 sm:px-8 lg:px-14">
      <div className="mx-auto max-w-[900px]">
        <Link href="/account/orders" className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.15em]"><ArrowLeft size={14} className="mr-2" /> Your orders</Link>
        <div className="mt-16 border-t border-black/15 pt-10"><p className="text-xs font-semibold uppercase tracking-[0.25em] text-black/40">ORDER DETAILS</p><h1 className="mt-5 font-serif text-5xl leading-none sm:text-7xl">Order not found.</h1><p className="mt-6 max-w-md text-sm leading-7 text-black/55">{error}</p><button onClick={() => void load(true)} className="mt-8 inline-flex items-center border border-black/20 px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em]"><RefreshCw size={14} className="mr-2" /> Try again</button></div>
      </div>
    </section>
  );

  const cancelled = order.status === "cancelled";

  return (
    <section className="bg-[#f5f1e8] px-5 py-14 text-[#111] sm:px-8 sm:py-20 lg:px-14 lg:py-24">
      <div className="mx-auto max-w-[1100px]">
        <div className="flex flex-col gap-6 border-b border-black/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/account/orders" className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.15em] text-black/50"><ArrowLeft size={14} className="mr-2" /> Your orders</Link>
            <p className="mt-9 text-xs font-semibold uppercase tracking-[0.28em] text-black/40">ORDER DETAILS</p>
            <h1 className="mt-4 font-serif text-5xl leading-[0.9] tracking-[-0.045em] sm:text-7xl">{order.order_number}</h1>
            <p className="mt-5 text-sm text-black/50">Placed {dateTime(order.created_at)}</p>
          </div>
          <div className="sm:text-right"><span className="inline-flex border border-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em]">{labels[order.status] ?? order.status}</span><button onClick={() => void load(true)} disabled={refreshing} className="ml-3 inline-flex items-center border border-black/15 px-3 py-2 text-xs uppercase tracking-[0.12em] disabled:opacity-50"><RefreshCw size={13} className={refreshing ? "mr-2 animate-spin" : "mr-2"}/>Refresh</button></div>
        </div>

        <div className="grid gap-10 py-10 lg:grid-cols-[1fr_330px]">
          <div>
            <div className="border-y border-black/15 py-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-5 border-b border-black/10 py-6 last:border-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-black/10 text-xs font-semibold">{item.quantity}×</div>
                  <div className="min-w-0 flex-1"><p className="font-medium">{item.product_name}</p>{item.size && <p className="mt-1 text-xs uppercase tracking-[0.12em] text-black/40">{item.size}</p>}<p className="mt-2 text-xs text-black/45">{money(item.unit_price)} each</p></div>
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
              <div className="flex gap-4"><PackageCheck size={18} strokeWidth={1.4}/><div><p className="text-xs uppercase tracking-[0.12em] text-black/40">Fulfilment</p><p className="mt-1 text-sm">{order.fulfillment_type === "pickup" ? "Pickup" : "Delivery"}</p></div></div>
              <div className="flex gap-4"><MapPin size={18} strokeWidth={1.4}/><div><p className="text-xs uppercase tracking-[0.12em] text-black/40">Payment method</p><p className="mt-1 text-sm">{order.payment_method.replaceAll("_", " ")}</p></div></div>
              <div className="flex gap-4"><Clock3 size={18} strokeWidth={1.4}/><div><p className="text-xs uppercase tracking-[0.12em] text-black/40">Payment status</p><p className="mt-1 text-sm capitalize">{order.payment_status}</p></div></div>
            </div>

            <div className="mt-9 border-t border-black/10 pt-7">
              {cancelled ? <p className="text-sm leading-6 text-black/55">This order was cancelled and cannot be tracked.</p> : <Link href={`/order?order=${encodeURIComponent(order.order_number)}`} className="flex w-full items-center justify-center bg-black px-5 py-4 text-xs font-semibold uppercase tracking-[0.15em] !text-white hover:!text-white">Track this order <ArrowRight size={14} className="ml-2" /></Link>}
              <Link href="/menu" className="mt-3 flex w-full items-center justify-center border border-black/15 px-5 py-4 text-xs font-semibold uppercase tracking-[0.15em]">Order again <ArrowRight size={14} className="ml-2" /></Link>
            </div>
          </aside>
        </div>

        <div className="border-t border-black/15 pt-7 text-xs leading-6 text-black/45"><span className="mr-2 inline-flex align-middle"><Check size={14}/></span> This order is connected to your signed-in R&R account. Only you can view its details.</div>
      </div>
    </section>
  );
}
