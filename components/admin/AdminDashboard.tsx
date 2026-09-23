"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ClipboardList, Droplets, Leaf, PackageCheck, RefreshCw, ShoppingBag, Wheat } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Stats = { products:number; ingredients:number; orders:number; pendingOrders:number; batches:number; messages:number };
type RecentOrder = { id:string; order_number:string; customer_email:string|null; total:number|string|null; status:string|null; created_at:string };

const statusLabels: Record<string,string> = {
  pending:"Pending", confirmed:"Confirmed", preparing:"Preparing", pressing:"Pressing",
  ready:"Ready", out_for_delivery:"Out for delivery", completed:"Completed", cancelled:"Cancelled",
};

function money(value:number|string|null){ return `KSh ${Number(value??0).toLocaleString("en-KE")}`; }
function dateLabel(value:string){ return new Intl.DateTimeFormat("en-KE",{day:"numeric",month:"short",year:"numeric"}).format(new Date(value)); }

export default function AdminDashboard(){
  const supabase=createClient();
  const [stats,setStats]=useState<Stats>({products:0,ingredients:0,orders:0,pendingOrders:0,batches:0,messages:0});
  const [recentOrders,setRecentOrders]=useState<RecentOrder[]>([]);
  const [loading,setLoading]=useState(true);
  const [refreshing,setRefreshing]=useState(false);
  const [error,setError]=useState("");

  const load=useCallback(async(refresh=false)=>{
    if(refresh)setRefreshing(true); else setLoading(true);
    setError("");
    try{
      const [p,i,o,po,b,m,r]=await Promise.all([
        supabase.from("products").select("id",{count:"exact",head:true}),
        supabase.from("ingredients").select("id",{count:"exact",head:true}),
        supabase.from("orders").select("id",{count:"exact",head:true}),
        supabase.from("orders").select("id",{count:"exact",head:true}).in("status",["pending","confirmed","preparing","pressing","ready","out_for_delivery"]),
        supabase.from("batches").select("id",{count:"exact",head:true}),
        supabase.from("contact_messages").select("id",{count:"exact",head:true}).eq("status","new"),
        supabase.from("orders").select("id, order_number, customer_email, total, status, created_at").order("created_at",{ascending:false}).limit(6),
      ]);
      const failures=[p.error,i.error,o.error,po.error,b.error,m.error,r.error].filter(Boolean);
      if(failures.length) throw new Error(failures[0]?.message??"Dashboard data could not be loaded.");
      setStats({products:p.count??0,ingredients:i.count??0,orders:o.count??0,pendingOrders:po.count??0,batches:b.count??0,messages:m.count??0});
      setRecentOrders((r.data??[]) as RecentOrder[]);
    }catch(err){ setError(err instanceof Error?err.message:"Dashboard data could not be loaded."); }
    finally{setLoading(false);setRefreshing(false);}
  },[supabase]);

  useEffect(()=>{load();},[load]);

  const cards=[
    ["Products",stats.products,Droplets,"/admin/products","Menu catalogue"],
    ["Ingredients",stats.ingredients,Leaf,"/admin/ingredients","Ingredient library"],
    ["Orders",stats.orders,ShoppingBag,"/admin/orders",`${stats.pendingOrders} active`],
    ["Batches",stats.batches,PackageCheck,"/admin/batches","Production traceability"],
    ["New messages",stats.messages,ClipboardList,"/admin/contact","Contact enquiries"],
  ] as const;

  return <main className="min-h-screen bg-[#f5f1e8] text-[#111]">
    <section className="border-b border-black/10 bg-[#111] py-16 text-white lg:py-24">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-14">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">R&R ADMIN</p>
            <h1 className="mt-5 font-serif text-6xl leading-[0.85] tracking-[-0.05em] sm:text-8xl">The control<br/>room.</h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/55">Products, ingredients, orders, production and customer activity in one working view.</p>
          </div>
          <button type="button" onClick={()=>load(true)} disabled={refreshing} className="inline-flex w-fit items-center gap-2 border border-white/20 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition hover:border-white/50 disabled:opacity-50"><RefreshCw size={14} className={refreshing?"animate-spin":""}/>Refresh</button>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:px-14 lg:py-16">
      {error&&<div className="mb-10 border border-black/15 bg-white p-5 text-sm"><p className="font-medium">Dashboard data could not be loaded.</p><p className="mt-2 text-black/55">{error}</p></div>}

      <div className="grid border-l border-t border-black/10 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map(([label,value,Icon,href,note])=><Link key={label} href={href} className="group border-b border-r border-black/10 bg-white p-6 transition hover:bg-[#eee9de]">
          <Icon size={18} strokeWidth={1.3}/><p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-black/40">{label}</p>
          <p className="mt-3 font-serif text-5xl">{loading?"—":value}</p>
          <div className="mt-6 flex items-center justify-between gap-4"><span className="text-xs text-black/45">{note}</span><ArrowRight size={14} className="transition-transform group-hover:translate-x-1"/></div>
        </Link>)}
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-[1.4fr_0.6fr]">
        <section>
          <div className="flex items-end justify-between border-b border-black/15 pb-5">
            <div><p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">RECENT ORDERS</p><h2 className="mt-3 font-serif text-4xl tracking-[-0.03em] sm:text-5xl">What is moving.</h2></div>
            <Link href="/admin/orders" className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] sm:flex">All orders<ArrowRight size={14}/></Link>
          </div>
          {loading?<p className="py-10 text-sm text-black/45">Loading orders…</p>:recentOrders.length===0?<div className="border-b border-black/10 py-10"><p className="font-serif text-2xl">No orders yet.</p><p className="mt-2 text-sm text-black/45">Customer orders will appear here once they are placed.</p></div>:
          <div className="divide-y divide-black/10">{recentOrders.map(order=><Link key={order.id} href={`/admin/orders?order=${encodeURIComponent(order.id)}`} className="group grid gap-4 py-6 transition hover:bg-black/[0.02] sm:grid-cols-[1fr_auto] sm:items-center">
            <div><div className="flex flex-wrap items-center gap-3"><span className="text-xs font-semibold uppercase tracking-[0.18em]">{order.order_number}</span><span className="text-xs text-black/35">{dateLabel(order.created_at)}</span></div><p className="mt-2 text-sm text-black/55">{order.customer_email??"Customer"}</p></div>
            <div className="flex items-center justify-between gap-8 sm:justify-end"><div className="text-left sm:text-right"><p className="font-serif text-xl">{money(order.total)}</p><p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-black/40">{statusLabels[order.status??"pending"]??order.status??"Pending"}</p></div><ArrowRight size={15} className="transition-transform group-hover:translate-x-1"/></div>
          </Link>)}</div>}
        </section>

        <aside><div className="border-b border-black/15 pb-5"><p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">QUICK WORK</p><h2 className="mt-3 font-serif text-4xl tracking-[-0.03em]">Move through the House.</h2></div>
          <div className="divide-y divide-black/10 border-b border-black/10">
            {[["Manage products","/admin/products"],["Update ingredients","/admin/ingredients"],["Review sourcing","/admin/sourcing"],["Manage batches","/admin/batches"],["Process orders","/admin/orders"]].map(([label,href])=><Link key={label} href={href} className="group flex items-center justify-between py-5"><span className="text-sm">{label}</span><ArrowRight size={15} className="transition-transform group-hover:translate-x-1"/></Link>)}
          </div>
          <div className="mt-10 border border-black/10 bg-white p-6"><Wheat size={18} strokeWidth={1.2}/><p className="mt-5 font-serif text-2xl">Traceability first.</p><p className="mt-2 text-sm leading-relaxed text-black/50">Keep product, ingredient, sourcing and batch information connected as the House grows.</p></div>
        </aside>
      </div>
    </section>
  </main>;
}
