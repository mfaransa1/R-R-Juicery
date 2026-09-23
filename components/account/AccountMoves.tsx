"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart, Package, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type OrderRow = {
  id: string;
  created_at: string;
  total: number | string | null;
  status: string | null;
  payment_status: string | null;
  fulfillment_type: string | null;
};

type OrderItemRow = {
  order_id: string;
  product_id: string | null;
  product_name: string | null;
  quantity: number;
  unit_price: number | string;
};

type FavouriteRow = {
  product_id: string;
  product?: { name?: string | null; slug?: string | null } | null;
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Order received",
  confirmed: "Confirmed",
  preparing: "Preparing",
  pressing: "Pressing",
  ready: "Ready",
  out_for_delivery: "Out for delivery",
  completed: "Completed",
  cancelled: "Cancelled",
};

function money(value: number | string | null) {
  return `KSh ${Number(value ?? 0).toLocaleString("en-KE")}`;
}

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function statusLabel(status: string | null) {
  if (!status) return "Order received";
  return STATUS_LABELS[status] ?? status.replaceAll("_", " ");
}

export default function AccountMoves() {
  const supabase = createClient();

  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [items, setItems] = useState<Record<string, OrderItemRow[]>>({});
  const [favourites, setFavourites] = useState<FavouriteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSignedIn(false);
      setOrders([]);
      setItems({});
      setFavourites([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    setSignedIn(true);

    const { data: orderData } = await supabase
      .from("orders")
      .select(
        "id, created_at, total, status, payment_status, fulfillment_type"
      )
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false });

    const nextOrders = (orderData ?? []) as OrderRow[];
    setOrders(nextOrders);

    if (nextOrders.length) {
      const ids = nextOrders.map((order) => order.id);
      const { data: itemData } = await supabase
        .from("order_items")
        .select("order_id, product_id, product_name, quantity, unit_price")
        .in("order_id", ids);

      const grouped: Record<string, OrderItemRow[]> = {};
      for (const item of (itemData ?? []) as OrderItemRow[]) {
        (grouped[item.order_id] ??= []).push(item);
      }
      setItems(grouped);
    } else {
      setItems({});
    }

    const { data: favouriteData } = await supabase
      .from("favourites")
      .select("product_id, product:products(name, slug)")
      .eq("profile_id", user.id)
      .order("created_at", { ascending: false });

    setFavourites((favouriteData ?? []) as FavouriteRow[]);
    setLoading(false);
    setRefreshing(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const completedCount = orders.filter(
    (order) => order.status === "completed"
  ).length;

  return (
    <section className="bg-[#111] py-24 text-white lg:py-32">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-14">
        <div className="flex flex-col gap-6 border-b border-white/15 pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
              R&R MOVES
            </p>
            <h2 className="mt-4 font-serif text-5xl leading-[0.9] tracking-[-0.04em] sm:text-7xl">
              Your moves.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/55">
              Your orders, saved juices and activity — kept together in one
              place.
            </p>
          </div>

          {signedIn && (
            <button
              type="button"
              onClick={() => load(true)}
              disabled={refreshing}
              className="inline-flex w-fit items-center gap-2 border border-white/20 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition hover:border-white/50 disabled:opacity-50"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          )}
        </div>

        {!signedIn && !loading ? (
          <div className="py-16">
            <Package size={22} strokeWidth={1.2} />
            <h3 className="mt-5 font-serif text-3xl">Sign in to see your moves.</h3>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/50">
              Your order history and saved juices will appear here once you sign
              in to your R&R account.
            </p>
            <Link
              href="/account"
              className="mt-7 inline-flex items-center gap-3 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] !text-black transition hover:bg-white/85"
            >
              Sign in
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-px border-x border-white/10 sm:grid-cols-3">
              <div className="border-b border-white/10 px-5 py-7 sm:border-b-0 sm:border-r">
                <p className="text-xs uppercase tracking-[0.2em] text-white/35">Orders</p>
                <p className="mt-3 font-serif text-4xl">{loading ? "—" : orders.length}</p>
              </div>
              <div className="border-b border-white/10 px-5 py-7 sm:border-b-0 sm:border-r">
                <p className="text-xs uppercase tracking-[0.2em] text-white/35">Completed</p>
                <p className="mt-3 font-serif text-4xl">{loading ? "—" : completedCount}</p>
              </div>
              <div className="px-5 py-7">
                <p className="text-xs uppercase tracking-[0.2em] text-white/35">Saved juices</p>
                <p className="mt-3 font-serif text-4xl">{loading ? "—" : favourites.length}</p>
              </div>
            </div>

            <div className="mt-20">
              <div className="flex items-end justify-between gap-6 border-b border-white/15 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/35">
                    ORDER HISTORY
                  </p>
                  <h3 className="mt-3 font-serif text-4xl tracking-[-0.03em] sm:text-5xl">
                    Every order.
                  </h3>
                </div>
                <Link
                  href="/menu"
                  className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/55 transition hover:text-white sm:flex"
                >
                  Make another move
                  <ArrowRight size={14} />
                </Link>
              </div>

              {loading ? (
                <div className="py-12 text-sm text-white/40">Loading your orders…</div>
              ) : orders.length === 0 ? (
                <div className="border-b border-white/10 py-12">
                  <p className="font-serif text-2xl">No orders yet.</p>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-white/45">
                    Your completed and current orders will appear here after you
                    place your first order.
                  </p>
                  <Link
                    href="/menu"
                    className="mt-6 inline-flex items-center gap-3 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] !text-black transition hover:bg-white/85"
                  >
                    Explore the menu
                    <ArrowRight size={15} />
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {orders.map((order, index) => {
                    const orderItems = items[order.id] ?? [];
                    const itemSummary = orderItems.length
                      ? orderItems
                          .map(
                            (item) =>
                              `${item.quantity} × ${item.product_name ?? "Juice"}`
                          )
                          .join(" · ")
                      : "Order items";

                    return (
                      <article
                        key={order.id}
                        className="group py-7 sm:py-8"
                      >
                        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
                          <div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                                ORDER {String(orders.length - index).padStart(3, "0")}
                              </p>
                              <span className="h-1 w-1 rounded-full bg-white/25" />
                              <p className="text-xs uppercase tracking-[0.16em] text-white/40">
                                {dateLabel(order.created_at)}
                              </p>
                            </div>

                            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65">
                              {itemSummary}
                            </p>

                            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-[0.15em]">
                              <span className="text-white/45">
                                Status: <strong className="font-medium text-white/80">{statusLabel(order.status)}</strong>
                              </span>
                              <span className="text-white/45">
                                Payment: <strong className="font-medium text-white/80">{(order.payment_status ?? "pending").replaceAll("_", " ")}</strong>
                              </span>
                              <span className="text-white/45">
                                {order.fulfillment_type === "delivery" ? "Delivery" : "Pickup"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-6 lg:block lg:text-right">
                            <p className="font-serif text-2xl">{money(order.total)}</p>
                            <Link
                              href={`/order?order=${encodeURIComponent(order.id)}`}
                              className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/60 transition hover:text-white"
                            >
                              Track order
                              <ArrowRight size={14} />
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-20 border-t border-white/15 pt-8">
              <div className="flex items-center gap-3">
                <Heart size={17} strokeWidth={1.3} />
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
                  SAVED JUICES
                </p>
              </div>

              {loading ? (
                <p className="py-8 text-sm text-white/40">Loading saved juices…</p>
              ) : favourites.length === 0 ? (
                <div className="py-8">
                  <p className="font-serif text-2xl">Nothing saved yet.</p>
                  <p className="mt-2 text-sm text-white/45">
                    Save a juice from the menu and it will appear here.
                  </p>
                </div>
              ) : (
                <div className="mt-6 grid gap-px border border-white/10 sm:grid-cols-2 lg:grid-cols-3">
                  {favourites.map((favourite) => (
                    <Link
                      key={favourite.product_id}
                      href={favourite.product?.slug ? `/menu/${favourite.product.slug}` : "/menu"}
                      className="group border-b border-r border-white/10 p-5 transition hover:bg-white/[0.04]"
                    >
                      <p className="font-serif text-xl">
                        {favourite.product?.name ?? "Saved juice"}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-white/45 group-hover:text-white">
                        View juice
                        <ArrowRight size={13} />
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
