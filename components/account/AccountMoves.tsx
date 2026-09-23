"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Heart,
  Package,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import {
  getMyFavourites,
  getMyOrders,
  type AccountFavourite,
  type AccountOrder,
} from "@/lib/supabase/account";
import { createClient } from "@/lib/supabase/client";

const statusLabels: Record<string, string> = {
  pending: "Order received",
  confirmed: "Confirmed",
  preparing: "Preparing",
  pressing: "Pressing",
  ready: "Ready",
  out_for_delivery: "On the move",
  completed: "Completed",
  cancelled: "Cancelled",
};

function money(value: number) {
  return `KSh ${Number(value).toLocaleString()}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AccountMoves() {
  const [signedIn, setSignedIn] = useState(false);
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [favourites, setFavourites] = useState<AccountFavourite[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function loadAccountData(showRefresh = false) {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    setError("");

    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setSignedIn(false);
        setOrders([]);
        setFavourites([]);
        return;
      }

      setSignedIn(true);

      const [orderData, favouriteData] = await Promise.all([
        getMyOrders(),
        getMyFavourites(),
      ]);

      setOrders(orderData);
      setFavourites(favouriteData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your R&R account activity."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadAccountData();

    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadAccountData(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <section className="bg-[#111] py-20 text-white lg:py-28">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-14">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/35">
            R&R MOVES
          </p>
          <h2 className="mt-5 font-serif text-5xl leading-[0.9] tracking-[-0.05em] sm:text-7xl">
            Your
            <br />
            activity.
          </h2>
          <p className="mt-8 text-sm text-white/45">
            Loading your R&R Passport...
          </p>
        </div>
      </section>
    );
  }

  if (!signedIn) {
    return (
      <section className="bg-[#111] py-20 text-white lg:py-28">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-14">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/35">
                R&R MOVES
              </p>

              <h2 className="mt-5 font-serif text-5xl leading-[0.9] tracking-[-0.05em] sm:text-7xl">
                Every
                <br />
                move
                <br />
                counts.
              </h2>
            </div>

            <div className="border-t border-white/10 pt-7">
              <p className="max-w-lg text-sm leading-7 text-white/55">
                Sign in to see your order history and saved favourites.
                Your R&R Passport keeps your House activity together.
              </p>

              <Link
                href="/auth"
                className="mt-7 inline-flex items-center gap-3 bg-white px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-[#f5f1e8]"
              >
                Enter your account
                <ArrowRight size={15} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const latestOrder = orders[0];
  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  ).length;

  return (
    <section className="bg-[#111] py-20 text-white lg:py-28">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-14">
        <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-10 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/35">
              R&R MOVES
            </p>

            <h2 className="mt-5 font-serif text-5xl leading-[0.9] tracking-[-0.05em] sm:text-7xl">
              Your
              <br />
              activity.
            </h2>
          </div>

          <button
            type="button"
            onClick={() => loadAccountData(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 self-start border border-white/15 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] transition hover:bg-white hover:text-black disabled:opacity-40 sm:self-auto"
          >
            <RefreshCw
              size={13}
              strokeWidth={1.5}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mt-8 border border-red-300/20 bg-red-950/30 p-5 text-sm leading-7 text-red-100">
            {error}
          </div>
        )}

        <div className="mt-10 grid gap-px bg-white/10 md:grid-cols-3">
          <div className="bg-[#111] p-7">
            <Package size={19} strokeWidth={1.3} className="text-white/55" />
            <p className="mt-6 text-3xl font-serif">{orders.length}</p>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
              Orders
            </p>
          </div>

          <div className="bg-[#111] p-7">
            <Heart size={19} strokeWidth={1.3} className="text-white/55" />
            <p className="mt-6 text-3xl font-serif">{favourites.length}</p>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
              Favourites
            </p>
          </div>

          <div className="bg-[#111] p-7">
            <Sparkles size={19} strokeWidth={1.3} className="text-white/55" />
            <p className="mt-6 text-3xl font-serif">{completedOrders}</p>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
              Completed moves
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="flex items-end justify-between gap-6 border-b border-white/10 pb-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  YOUR ORDERS
                </p>
                <h3 className="mt-3 font-serif text-4xl tracking-[-0.04em]">
                  Recent moves.
                </h3>
              </div>

              <Link
                href="/account/orders"
                className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45 underline underline-offset-4 transition hover:text-white sm:block"
              >
                View all orders
              </Link>
            </div>

            {latestOrder ? (
              <div className="border-b border-white/10 py-7">
                <div className="flex flex-col justify-between gap-5 sm:flex-row">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.12em] text-white/40">
                      {latestOrder.order_number || latestOrder.id.slice(0, 8).toUpperCase()}
                    </p>

                    <p className="mt-3 text-sm font-medium">
                      {statusLabels[latestOrder.status] ??
                        latestOrder.status}
                    </p>

                    <p className="mt-2 text-xs text-white/40">
                      {formatDate(latestOrder.created_at)} ·{" "}
                      {latestOrder.fulfillment_type}
                    </p>
                  </div>

                  <p className="text-sm font-semibold">
                    {money(Number(latestOrder.total))}
                  </p>
                </div>

                <Link
                  href={`/order?order=${encodeURIComponent(latestOrder.order_number || latestOrder.id)}`}
                  className="mt-6 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55 transition hover:text-white"
                >
                  Track this order
                  <ArrowRight size={14} strokeWidth={1.5} />
                </Link>
              </div>
            ) : (
              <div className="py-8">
                <p className="text-sm leading-7 text-white/45">
                  Your first move is waiting.
                </p>

                <Link
                  href="/menu"
                  className="mt-5 inline-flex items-center gap-2 bg-white px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-[#f5f1e8]"
                >
                  Explore the menu
                  <ArrowRight size={14} strokeWidth={1.5} />
                </Link>
              </div>
            )}

            {orders.length > 1 && (
              <div className="mt-5 space-y-1">
                {orders.slice(1, 4).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between gap-5 border-b border-white/10 py-4"
                  >
                    <div>
                      <p className="font-mono text-[9px] tracking-[0.1em] text-white/35">
                        {order.order_number || order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="mt-1 text-xs text-white/60">
                        {statusLabels[order.status] ?? order.status}
                      </p>
                    </div>

                    <p className="text-xs">{money(Number(order.total))}</p>
                  </div>
                ))}
              </div>
            )}
            <Link
              href="/account/orders"
              className="mt-6 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white underline underline-offset-4 transition hover:text-white/70"
            >
              View full order history
              <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </div>

          <div>
            <div className="border-b border-white/10 pb-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                FAVOURITES
              </p>
              <h3 className="mt-3 font-serif text-4xl tracking-[-0.04em]">
                Saved moves.
              </h3>
            </div>

            {favourites.length > 0 ? (
              <div className="mt-6 space-y-1">
                {favourites.slice(0, 4).map((favourite) => {
                  const product = favourite.product;

                  if (!product) return null;

                  return (
                    <Link
                      key={`${favourite.profile_id}-${favourite.product_id}`}
                      href={`/menu/${product.slug}`}
                      className="group flex gap-4 border-b border-white/10 py-4"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-white/5">
                        <Image
                          src={
                            product.image_path ||
                            `/images/products/${product.slug}.jpg`
                          }
                          alt={product.name}
                          fill
                          sizes="64px"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>

                      <div className="min-w-0 flex-1 self-center">
                        <p className="text-sm">{product.name}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/35">
                          {product.size} · {money(Number(product.price))}
                        </p>
                      </div>

                      <ArrowRight
                        size={15}
                        strokeWidth={1.5}
                        className="mt-6 shrink-0 text-white/30 transition group-hover:translate-x-1 group-hover:text-white"
                      />
                    </Link>
                  );
                })}

                <Link
                  href="/menu"
                  className="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50 underline underline-offset-4 transition hover:text-white"
                >
                  Find another move
                  <ArrowRight size={14} strokeWidth={1.5} />
                </Link>
              </div>
            ) : (
              <div className="mt-6">
                <p className="text-sm leading-7 text-white/45">
                  Save the juices you want to return to.
                </p>

                <Link
                  href="/menu"
                  className="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white underline underline-offset-4"
                >
                  Explore the menu
                  <ArrowRight size={14} strokeWidth={1.5} />
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                R&R MOVES
              </p>
              <p className="mt-3 max-w-xl text-sm leading-7 text-white/45">
                Your loyalty journey will live here as the R&R MOVES programme
                is connected to the House.
              </p>
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/25">
              COMING WITH THE HOUSE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
