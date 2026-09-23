"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, ChevronRight, RefreshCw, ShoppingBag } from "lucide-react";
import { getMyOrders, type AccountOrder } from "@/lib/supabase/account";

const money = (v: number) => new Intl.NumberFormat("en-KE",{style:"currency",currency:"KES",maximumFractionDigits:0}).format(v);
const date = (v: string) => new Intl.DateTimeFormat("en-KE",{dateStyle:"medium",timeStyle:"short"}).format(new Date(v));
const status = (v: string) => v.replaceAll("_"," ");

export default function AccountOrdersPolished() {
  const [orders,setOrders]=useState<AccountOrder[]>([]);
  const [loading,setLoading]=useState(true);
  const [refreshing,setRefreshing]=useState(false);
  const [error,setError]=useState("");
  const load=useCallback(async()=>{try{setError("");setOrders(await getMyOrders());}catch(e){setError(e instanceof Error?e.message:"Unable to load your orders.");}finally{setLoading(false);setRefreshing(false);}},[]);
  useEffect(()=>{load();},[load]);
  return <main className="min-h-screen bg-[#f5f1e8] px-5 pb-20 pt-28 lg:px-10 lg:pt-36"><div className="mx-auto max-w-[1200px]">
    <Link href="/account" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-black/40 hover:text-black"><ArrowLeft size={14}/>Passport</Link>
    <header className="mt-10 flex flex-col gap-5 border-b border-black/10 pb-8 md:flex-row md:items-end md:justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/35">R&R PASSPORT / ORDERS</p><h1 className="mt-3 font-serif text-5xl tracking-[-0.045em]">Your Moves</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-black/50">Every order you've made at Rook & Reed, in one place.</p></div><button onClick={async()=>{setRefreshing(true);await load();}} disabled={refreshing} className="inline-flex items-center gap-2 border border-black/10 bg-white px-4 py-2.5 text-xs font-medium hover:bg-black hover:text-white disabled:opacity-50"><RefreshCw size={14} className={refreshing?"animate-spin":""}/>Refresh</button></header>
    {error&&<div className="mt-8 border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
    {loading?<div className="mt-8 h-64 animate-pulse bg-white/60"/>:orders.length===0?<div className="mt-8 border border-black/10 bg-white p-10 text-center md:p-16"><ShoppingBag size={30} className="mx-auto text-black/20"/><h2 className="mt-5 font-serif text-3xl">No moves yet.</h2><p className="mx-auto mt-3 max-w-md text-sm leading-7 text-black/45">Your order history will appear here after your first order.</p><Link href="/menu" className="mt-7 inline-flex items-center gap-2 bg-[#111111] px-5 py-3 text-sm font-medium text-white">Explore the menu<ArrowUpRight size={15}/></Link></div>:<div className="mt-8 divide-y divide-black/10 border-y border-black/10">{orders.map(order=><div key={order.id} className="grid gap-5 py-7 md:grid-cols-[1fr_auto_auto]"><div><p className="font-serif text-2xl">{order.order_number??"R&R Order"}</p><p className="mt-2 text-xs text-black/40">{date(order.created_at)}</p><p className="mt-2 text-xs capitalize text-black/50">{status(order.fulfillment_type)} · {status(order.payment_status)}</p></div><div className="md:text-right"><p className="text-sm text-black/45">Total</p><p className="mt-1 font-serif text-2xl">{money(Number(order.total))}</p><p className="mt-2 text-xs capitalize text-black/40">{status(order.status)}</p></div><Link href={`/order?order=${encodeURIComponent(order.order_number??order.id)}`} className="inline-flex items-center justify-center gap-2 self-center border border-black/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] hover:bg-black hover:text-white">Track<ChevronRight size={14}/></Link></div>)}</div>}
  </div></main>;
}
