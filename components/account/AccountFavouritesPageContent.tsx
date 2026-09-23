"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, Bookmark, ChevronRight, RefreshCw, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getMyFavourites, type AccountFavourite } from "@/lib/supabase/account";

const money=(v:number)=>new Intl.NumberFormat("en-KE",{style:"currency",currency:"KES",maximumFractionDigits:0}).format(v);

export default function AccountFavouritesPolished(){
  const [items,setItems]=useState<AccountFavourite[]>([]);
  const [loading,setLoading]=useState(true);
  const [refreshing,setRefreshing]=useState(false);
  const [removing,setRemoving]=useState<string|null>(null);
  const [error,setError]=useState("");
  const load=useCallback(async()=>{try{setError("");setItems(await getMyFavourites());}catch(e){setError(e instanceof Error?e.message:"Unable to load your saved moves.");}finally{setLoading(false);setRefreshing(false);}},[]);
  useEffect(()=>{load();},[load]);
  async function remove(item:AccountFavourite){try{setRemoving(item.product_id);const supabase=createClient();const {data:{user}}=await supabase.auth.getUser();if(!user){window.location.href="/auth";return;}const {error:e}=await supabase.from("favourites").delete().eq("profile_id",user.id).eq("product_id",item.product_id);if(e)throw e;setItems(c=>c.filter(x=>x.product_id!==item.product_id));}catch(e){setError(e instanceof Error?e.message:"Unable to remove this saved move.");}finally{setRemoving(null);}}
  return <main className="min-h-screen bg-[#f5f1e8] px-5 pb-20 pt-28 lg:px-10 lg:pt-36"><div className="mx-auto max-w-[1200px]">
    <Link href="/account" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-black/40 hover:text-black"><ArrowLeft size={14}/>Passport</Link>
    <header className="mt-10 flex flex-col gap-5 border-b border-black/10 pb-8 md:flex-row md:items-end md:justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/35">R&R PASSPORT / SAVED MOVES</p><h1 className="mt-3 font-serif text-5xl tracking-[-0.045em]">Saved Moves</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-black/50">The juices you've kept close.</p></div><button onClick={async()=>{setRefreshing(true);await load();}} disabled={refreshing} className="inline-flex items-center gap-2 border border-black/10 bg-white px-4 py-2.5 text-xs font-medium hover:bg-black hover:text-white disabled:opacity-50"><RefreshCw size={14} className={refreshing?"animate-spin":""}/>Refresh</button></header>
    {error&&<div className="mt-8 border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
    {loading?<div className="mt-8 grid gap-px bg-black/10 md:grid-cols-2"><div className="h-64 bg-white"/><div className="h-64 bg-white"/></div>:items.length===0?<div className="mt-8 border border-black/10 bg-white p-10 text-center md:p-16"><Bookmark size={30} className="mx-auto text-black/20"/><h2 className="mt-5 font-serif text-3xl">Nothing saved yet.</h2><p className="mx-auto mt-3 max-w-md text-sm leading-7 text-black/45">When a juice catches your attention, save it here for your next move.</p><Link href="/menu" className="mt-7 inline-flex items-center gap-2 bg-[#111111] px-5 py-3 text-sm font-medium text-white">Explore the menu<ArrowUpRight size={15}/></Link></div>:<div className="mt-8 grid gap-px border border-black/10 bg-black/10 md:grid-cols-2">{items.map(item=><article key={`${item.profile_id}-${item.product_id}`} className="group relative bg-white p-6 md:p-8"><div className="flex min-h-[230px] flex-col justify-between"><div><div className="flex items-start justify-between gap-4"><span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">SAVED MOVE</span><button type="button" onClick={()=>remove(item)} disabled={removing===item.product_id} className="rounded-sm p-1.5 text-black/30 hover:bg-black/[0.04] hover:text-black disabled:opacity-50" aria-label={`Remove ${item.product?.name??"saved move"}`}>{removing===item.product_id?<RefreshCw size={16} className="animate-spin"/>:<X size={16}/>}</button></div><h2 className="mt-10 font-serif text-4xl tracking-[-0.04em]">{item.product?.name??"Saved juice"}</h2>{item.product&&<p className="mt-3 text-sm text-black/45">{item.product.size} · {money(Number(item.product.price))}</p>}</div><Link href={item.product?`/menu/${item.product.slug}`:"/menu"} className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-black/45 hover:text-black">View juice<ChevronRight size={14}/></Link></div></article>)}</div>}
  </div></main>;
}
