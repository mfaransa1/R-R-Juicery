"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Bookmark, ChevronRight, Clock3, Droplets, RefreshCw, ShoppingBag } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getMyFavourites, getMyOrders, type AccountFavourite, type AccountOrder } from "@/lib/supabase/account";
import AccountPassportHero from "./AccountPassportHero";
import AccountLoyaltyCard from "./AccountLoyaltyCard";

function money(value: number) {
  return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(value);
}
function date(value: string) {
  return new Intl.DateTimeFormat("en-KE", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}
function status(value: string) { return value.replaceAll("_", " "); }

export default function AccountPassportDashboard() {
  const [name, setName] = useState("there");
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [favourites, setFavourites] = useState<AccountFavourite[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/auth"; return; }
      setEmail(user.email ?? "");
      const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
      setName(profile?.full_name?.trim() || "there");
      const [orderData, favouriteData] = await Promise.all([getMyOrders(), getMyFavourites()]);
      setOrders(orderData);
      setFavourites(favouriteData);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unable to load your R&R Passport.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const completed = useMemo(() => orders.filter((o) => o.status === "completed").length, [orders]);
  const activeOrder = useMemo(() => orders.find((o) => !["completed", "cancelled"].includes(o.status)) ?? null, [orders]);

  if (loading) {
    return <section className="bg-[#f5f1e8] px-5 py-16 lg:px-10"><div className="mx-auto max-w-[1440px]"><div className="h-10 w-56 animate-pulse bg-black/10" /><div className="mt-8 grid gap-px bg-black/10 md:grid-cols-3"><div className="h-28 bg-white" /><div className="h-28 bg-white" /><div className="h-28 bg-white" /></div></div></section>;
  }

  return (
    <>
      <AccountPassportHero name={name} />
      <section className="bg-[#f5f1e8] px-5 py-12 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          {error && <div className="mb-8 border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}

          <div className="flex flex-col gap-4 border-b border-black/10 pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/35">YOUR PASSPORT</p>
              <h2 className="mt-2 font-serif text-3xl tracking-[-0.03em] md:text-4xl">Your R&R activity</h2>
            </div>
            <button onClick={async () => { setRefreshing(true); await load(); }} disabled={refreshing} className="inline-flex items-center gap-2 self-start border border-black/10 bg-white px-4 py-2.5 text-xs font-medium text-black/65 hover:bg-black hover:text-white disabled:opacity-50 md:self-auto">
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} /> Refresh
            </button>
          </div>

          <div className="mt-6 grid gap-px border border-black/10 bg-black/10 md:grid-cols-3">
            <Metric label="Orders" value={orders.length} icon={<ShoppingBag size={17} />} />
            <Metric label="Saved moves" value={favourites.length} icon={<Bookmark size={17} />} />
            <Metric label="Completed" value={completed} icon={<Droplets size={17} />} />
          </div>

          {activeOrder ? (
            <section className="mt-12 overflow-hidden border border-black/10 bg-white">
              <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
                <div className="p-7 md:p-10">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-black/35">YOUR NEXT MOVE</p>
                  <h3 className="mt-4 font-serif text-4xl tracking-[-0.04em]">{activeOrder.order_number ?? "Current order"}</h3>
                  <p className="mt-3 text-sm text-black/50">{date(activeOrder.created_at)} · {status(activeOrder.status)}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href={`/order?order=${encodeURIComponent(activeOrder.order_number ?? activeOrder.id)}`} className="inline-flex items-center gap-2 bg-[#111111] px-5 py-3 text-sm font-medium text-white hover:opacity-80">Track Order <ArrowUpRight size={15} /></Link>
                    <Link href="/account/orders" className="inline-flex items-center gap-2 border border-black/15 px-5 py-3 text-sm hover:bg-black hover:text-white">Order History</Link>
                  </div>
                </div>
                <div className="flex items-center border-t border-black/10 bg-[#faf8f3] p-7 lg:border-l lg:border-t-0 md:p-10">
                  <div><Clock3 size={22} className="text-black/35" /><p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">Current status</p><p className="mt-2 font-serif text-3xl capitalize">{status(activeOrder.status)}</p><p className="mt-3 text-sm leading-6 text-black/45">Your order is moving through the R&R process.</p></div>
                </div>
              </div>
            </section>
          ) : (
            <section className="mt-12 border border-black/10 bg-white p-8 md:p-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-black/35">MAKE A MOVE</p>
              <h3 className="mt-4 max-w-xl font-serif text-4xl tracking-[-0.04em]">Your next bottle is waiting.</h3>
              <p className="mt-4 max-w-xl text-sm leading-7 text-black/50">Explore the R&R menu, find your flavour and make your next move.</p>
              <Link href="/menu" className="mt-7 inline-flex items-center gap-2 bg-[#111111] px-5 py-3 text-sm font-medium !text-white">Explore the menu <ArrowUpRight size={15} /></Link>
            </section>
          )}

          <div className="mt-14 grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <ActivitySection title="Order history" eyebrow="RECENT MOVES" href="/account/orders">
              {orders.slice(0, 3).length ? orders.slice(0, 3).map((order) => (
                <Link key={order.id} href={`/order?order=${encodeURIComponent(order.order_number ?? order.id)}`} className="group flex items-center justify-between gap-6 border-b border-black/10 py-5">
                  <div><p className="font-medium">{order.order_number ?? "R&R Order"}</p><p className="mt-1 text-xs capitalize text-black/40">{date(order.created_at)} · {status(order.status)}</p></div>
                  <div className="flex items-center gap-4"><span className="text-sm text-black/60">{money(Number(order.total))}</span><ChevronRight size={16} className="text-black/25 group-hover:translate-x-1" /></div>
                </Link>
              )) : <div className="py-10 text-sm text-black/45">No orders yet. Your first move starts at the menu.</div>}
            </ActivitySection>

            <ActivitySection title="Your favourites" eyebrow="SAVED MOVES" href="/account/favourites">
              {favourites.slice(0, 3).length ? favourites.slice(0, 3).map((fav) => (
                <Link key={`${fav.profile_id}-${fav.product_id}`} href={fav.product ? `/menu/${fav.product.slug}` : "/menu"} className="group flex items-center justify-between gap-4 border-b border-black/10 py-5">
                  <div className="min-w-0"><p className="truncate font-medium">{fav.product?.name ?? "Saved juice"}</p><p className="mt-1 text-xs text-black/40">{fav.product ? `${fav.product.size} · ${money(Number(fav.product.price))}` : "View menu"}</p></div>
                  <ChevronRight size={16} className="shrink-0 text-black/25 group-hover:translate-x-1" />
                </Link>
              )) : <div className="py-10 text-sm text-black/45">No saved moves yet.</div>}
            </ActivitySection>
          </div>

          <AccountLoyaltyCard />

          <section className="mt-16 border-t border-black/10 pt-10">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <QuickLink href="/account/orders" label="Your Orders" />
              <QuickLink href="/account/favourites" label="Saved Moves" />
              <QuickLink href="/account/rewards" label="R&R Moves" />
              <QuickLink href="/menu" label="Make a Move" />
              <QuickLink href="/account/settings" label="Account Settings" />
            </div>
          </section>

          <section className="mt-16 overflow-hidden bg-[#111111] text-white">
            <div className="p-8 md:p-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">THE HOUSE</p>
              <h3 className="mt-4 max-w-2xl font-serif text-4xl tracking-[-0.04em] md:text-5xl">Juice. Jazz. Chess. Books. Conversation.</h3>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/55">Your Passport is your way back into the world of Rook & Reed.</p>
              <Link href="/house" className="mt-7 inline-flex items-center gap-2 border border-white/20 px-5 py-3 text-sm text-white hover:bg-white hover:!text-black">Enter the House <ArrowUpRight size={15} /></Link>
            </div>
          </section>

          <p className="mt-8 text-xs text-black/35">Signed in as {email}</p>
        </div>
      </section>
    </>
  );
}

function Metric({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return <div className="bg-white p-6"><div className="flex items-center justify-between"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">{label}</p><span className="text-black/25">{icon}</span></div><p className="mt-4 font-serif text-4xl tracking-[-0.03em]">{value}</p></div>;
}

function ActivitySection({ title, eyebrow, href, children }: { title: string; eyebrow: string; href: string; children: React.ReactNode }) {
  return <section><div className="flex items-end justify-between border-b border-black/10 pb-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/35">{eyebrow}</p><h3 className="mt-2 font-serif text-3xl">{title}</h3></div><Link href={href} className="hidden items-center gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-black/45 hover:text-black md:flex">View all <ChevronRight size={14} /></Link></div><div className="mt-2">{children}</div></section>;
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return <Link href={href} className="group flex items-center justify-between border border-black/10 bg-white px-5 py-5 text-sm transition-colors hover:bg-[#111111] hover:text-white"><span>{label}</span><ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>;
}
