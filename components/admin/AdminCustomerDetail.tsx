"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Mail, Phone, RefreshCw, ShoppingBag, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Customer = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  role: string;
  created_at: string;
};

type Order = {
  id: string;
  order_number: string | null;
  status: string;
  fulfillment_type: string;
  payment_status: string;
  total: number;
  created_at: string;
};

function formatMoney(value: number) {
  return `KSh ${Number(value || 0).toLocaleString("en-KE")}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function AdminCustomerDetail({ customerId }: { customerId: string }) {
  const supabase = createClient();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    const [{ data: customerData, error: customerError }, { data: orderData, error: orderError }] = await Promise.all([
      supabase
        .from("profiles")
        .select("id,email,full_name,phone,role,created_at")
        .eq("id", customerId)
        .single(),
      supabase
        .from("orders")
        .select("id,order_number,status,fulfillment_type,payment_status,total,created_at")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false }),
    ]);

    if (customerError) {
      setError(customerError.message);
      setCustomer(null);
    } else {
      setCustomer(customerData as Customer);
    }

    if (orderError) {
      setError((current) => current || orderError.message);
      setOrders([]);
    } else {
      setOrders((orderData ?? []) as Order[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [customerId]);

  const totalSpend = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
    [orders],
  );

  if (loading) {
    return <div className="p-8 text-sm text-black/50">Loading customer...</div>;
  }

  if (error && !customer) {
    return (
      <div className="p-8">
        <Link href="/admin/customers" className="text-sm text-black/60 hover:text-black">← Back to Customers</Link>
        <p className="mt-8 text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (!customer) return null;

  return (
    <main className="min-h-screen bg-[#f5f1e8] px-5 pb-16 pt-24 lg:ml-[250px] lg:px-10 lg:pt-10">
      <div className="mx-auto max-w-[1200px]">
        <Link href="/admin/customers" className="inline-flex items-center gap-2 text-sm text-black/55 hover:text-black">
          <ArrowLeft size={15} /> Customers
        </Link>

        <div className="mt-7 flex flex-col justify-between gap-6 border-b border-black/10 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/40">Customer record</p>
            <h1 className="mt-2 font-serif text-4xl text-[#111]">{customer.full_name || "Unnamed customer"}</h1>
            <p className="mt-2 text-sm text-black/50">{customer.email || "No email recorded"}</p>
          </div>
          <button onClick={load} className="inline-flex items-center justify-center gap-2 border border-black/15 px-4 py-3 text-sm hover:bg-black hover:text-white">
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="border border-black/10 bg-white/60 p-5">
            <p className="text-[10px] uppercase tracking-[0.25em] text-black/40">Orders</p>
            <p className="mt-3 font-serif text-3xl">{orders.length}</p>
          </div>
          <div className="border border-black/10 bg-white/60 p-5">
            <p className="text-[10px] uppercase tracking-[0.25em] text-black/40">Recorded spend</p>
            <p className="mt-3 font-serif text-3xl">{formatMoney(totalSpend)}</p>
          </div>
          <div className="border border-black/10 bg-white/60 p-5">
            <p className="text-[10px] uppercase tracking-[0.25em] text-black/40">Joined</p>
            <p className="mt-3 text-sm">{formatDate(customer.created_at)}</p>
          </div>
        </div>

        <section className="mt-10 border border-black/10 bg-white/50">
          <div className="border-b border-black/10 px-5 py-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-black/40">Customer information</p>
          </div>
          <div className="grid gap-px bg-black/10 md:grid-cols-3">
            <div className="bg-[#f5f1e8] p-5"><UserRound size={16} /><p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-black/40">Name</p><p className="mt-1 text-sm">{customer.full_name || "—"}</p></div>
            <div className="bg-[#f5f1e8] p-5"><Mail size={16} /><p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-black/40">Email</p><p className="mt-1 break-all text-sm">{customer.email || "—"}</p></div>
            <div className="bg-[#f5f1e8] p-5"><Phone size={16} /><p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-black/40">Phone</p><p className="mt-1 text-sm">{customer.phone || "—"}</p></div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-center gap-3"><ShoppingBag size={17} /><h2 className="font-serif text-2xl">Order history</h2></div>
          {orders.length === 0 ? (
            <div className="border border-dashed border-black/15 p-10 text-sm text-black/50">No orders recorded for this customer.</div>
          ) : (
            <div className="overflow-hidden border border-black/10 bg-white/60">
              {orders.map((order) => (
                <Link key={order.id} href={`/admin/orders?order=${encodeURIComponent(order.id)}`} className="grid gap-3 border-b border-black/10 p-5 last:border-b-0 hover:bg-white md:grid-cols-[1.3fr_1fr_1fr_auto] md:items-center">
                  <div><p className="font-medium">{order.order_number || order.id}</p><p className="mt-1 text-xs text-black/40">{formatDate(order.created_at)}</p></div>
                  <div><p className="text-[10px] uppercase tracking-[0.18em] text-black/40">Status</p><p className="mt-1 text-sm capitalize">{order.status.replaceAll("_", " ")}</p></div>
                  <div><p className="text-[10px] uppercase tracking-[0.18em] text-black/40">Payment</p><p className="mt-1 text-sm capitalize">{order.payment_status.replaceAll("_", " ")}</p></div>
                  <p className="font-medium">{formatMoney(order.total)}</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
