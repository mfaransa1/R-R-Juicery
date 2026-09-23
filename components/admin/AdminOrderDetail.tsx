"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Order = {
  id: string;
  order_number: string | null;
  customer_id: string | null;
  status: string;
  fulfillment_type: string;
  payment_method: string;
  payment_status: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  created_at: string;
};

type OrderItem = {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  size: string | null;
  line_total: number;
  product: {
    name: string;
    slug: string;
  } | null;
};

const statusSteps = [
  "pending",
  "confirmed",
  "preparing",
  "pressing",
  "ready",
  "out_for_delivery",
  "completed",
];

export default function AdminOrderDetail({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    const supabase = createClient();

    const { data, error: orderError } = await supabase
      .from("orders")
      .select(
        "id,order_number,customer_id,status,fulfillment_type,payment_method,payment_status,subtotal,delivery_fee,total,created_at"
      )
      .eq("id", orderId)
      .single();

    if (orderError || !data) {
      setError(orderError?.message || "Order could not be found.");
      setLoading(false);
      return;
    }

    const { data: itemData, error: itemError } = await supabase
      .from("order_items")
      .select(
        "id,product_id,quantity,unit_price,size,line_total,product:products(name,slug)"
      )
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });

    if (itemError) {
      setError(itemError.message);
      setLoading(false);
      return;
    }

    setOrder(data as Order);
    setItems((itemData ?? []) as unknown as OrderItem[]);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, [orderId]);

  if (loading) {
    return (
      <section className="min-h-[60vh] px-5 py-12 lg:px-10">
        <div className="mx-auto max-w-[1100px] animate-pulse">
          <div className="h-4 w-28 bg-black/10" />
          <div className="mt-6 h-12 w-72 bg-black/10" />
          <div className="mt-10 h-64 bg-black/5" />
        </div>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="min-h-[60vh] px-5 py-12 lg:px-10">
        <div className="mx-auto max-w-[1100px]">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-sm text-black/55 hover:text-black"
          >
            <ArrowLeft size={16} /> Back to orders
          </Link>
          <div className="mt-10 border border-black/10 bg-white p-8">
            <p className="text-sm text-red-700">{error || "Order not found."}</p>
          </div>
        </div>
      </section>
    );
  }

  const currentIndex = statusSteps.indexOf(order.status);

  return (
    <section className="px-5 py-10 lg:px-10 lg:py-14">
      <div className="mx-auto max-w-[1100px]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-sm text-black/55 hover:text-black"
          >
            <ArrowLeft size={16} /> Back to orders
          </Link>

          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center gap-2 border border-black/15 px-4 py-2 text-sm hover:bg-black/[0.04]"
          >
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        <div className="mt-8 border-b border-black/10 pb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/40">
            Order
          </p>
          <h1 className="mt-3 font-serif text-4xl text-[#111111]">
            {order.order_number || order.id}
          </h1>
          <p className="mt-3 text-sm text-black/50">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Status", order.status.replaceAll("_", " ")],
            ["Payment", order.payment_status.replaceAll("_", " ")],
            ["Fulfilment", order.fulfillment_type.replaceAll("_", " ")],
            ["Method", order.payment_method.replaceAll("_", " ")],
          ].map(([label, value]) => (
            <div key={label} className="border border-black/10 bg-white p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/40">
                {label}
              </p>
              <p className="mt-3 text-sm font-medium capitalize text-[#111111]">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 border border-black/10 bg-white p-6 lg:p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/40">
            Order progress
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {statusSteps.map((step, index) => {
              const reached = currentIndex >= index;
              return (
                <div key={step} className="border-t border-black/15 pt-3">
                  <div
                    className={`h-1 ${reached ? "bg-[#111111]" : "bg-black/10"}`}
                  />
                  <p
                    className={`mt-3 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                      reached ? "text-[#111111]" : "text-black/30"
                    }`}
                  >
                    {step.replaceAll("_", " ")}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="border border-black/10 bg-white">
            <div className="border-b border-black/10 px-6 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/40">
                Items
              </p>
            </div>

            <div className="divide-y divide-black/10">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-5 px-6 py-5"
                >
                  <div>
                    <p className="font-medium text-[#111111]">
                      {item.product?.name || "Product"}
                    </p>
                    <p className="mt-1 text-xs text-black/45">
                      {item.quantity} × {item.size || "Standard"} · KSh{" "}
                      {Number(item.unit_price).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    KSh {Number(item.line_total).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <aside className="border border-black/10 bg-[#111111] p-6 text-white">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45">
              Summary
            </p>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between gap-5 text-white/65">
                <span>Subtotal</span>
                <span>KSh {Number(order.subtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between gap-5 text-white/65">
                <span>Delivery</span>
                <span>KSh {Number(order.delivery_fee).toLocaleString()}</span>
              </div>
              <div className="border-t border-white/15 pt-4">
                <div className="flex justify-between gap-5 text-lg">
                  <span>Total</span>
                  <span>KSh {Number(order.total).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {order.customer_id && (
              <Link
                href={`/admin/customers/${order.customer_id}`}
                className="mt-8 block border border-white/20 px-4 py-3 text-center text-sm text-white hover:bg-white hover:!text-black"
              >
                View customer
              </Link>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
