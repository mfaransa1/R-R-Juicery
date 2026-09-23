"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Bookmark,
  ChevronRight,
  Clock3,
  Droplets,
  Heart,
  RefreshCw,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getMyFavourites,
  getMyOrders,
  type AccountFavourite,
  type AccountOrder,
} from "@/lib/supabase/account";
import {
  getMyOrderDetail,
  type CustomerOrderDetailItem,
} from "@/lib/supabase/accountOrderDetails";
import AccountPassportHero from "./AccountPassportHero";
import AccountLoyaltyCard from "./AccountLoyaltyCard";

function money(value: number | string) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function date(value: string) {
  return new Intl.DateTimeFormat("en-KE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function status(value: string) {
  return value.replaceAll("_", " ");
}

function productImage(slug?: string | null) {
  return slug ? `/images/products/${slug}.jpg` : "/images/products/the-first-move.jpg";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AccountPassportDashboard() {
  const [name, setName] = useState("there");
  const [email, setEmail] = useState("");
  const [passportId, setPassportId] = useState("");
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [favourites, setFavourites] = useState<AccountFavourite[]>([]);
  const [recentItems, setRecentItems] = useState<CustomerOrderDetailItem[]>([]);
  const [usualItem, setUsualItem] = useState<CustomerOrderDetailItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/auth";
        return;
      }

      setEmail(user.email ?? "");
      setPassportId(`RR-${user.id.replaceAll("-", "").slice(-8).toUpperCase()}`);

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      setName(profile?.full_name?.trim() || "there");

      const [orderData, favouriteData] = await Promise.all([
        getMyOrders(),
        getMyFavourites(),
      ]);

      setOrders(orderData);
      setFavourites(favouriteData);

      const completedOrders = orderData.filter((order) => order.status === "completed");
      const latestOrder = orderData[0];

      if (latestOrder) {
        try {
          const detail = await getMyOrderDetail(
            latestOrder.order_number ?? latestOrder.id,
          );
          setRecentItems(detail.items);
        } catch {
          setRecentItems([]);
        }
      } else {
        setRecentItems([]);
      }

      if (completedOrders.length >= 3) {
        const details = await Promise.all(
          completedOrders.slice(0, 5).map(async (order) => {
            try {
              return await getMyOrderDetail(order.order_number ?? order.id);
            } catch {
              return null;
            }
          }),
        );

        const counts = new Map<string, { item: CustomerOrderDetailItem; count: number }>();
        for (const detail of details) {
          for (const item of detail?.items ?? []) {
            const key = item.product_id ?? item.product_name;
            const existing = counts.get(key);
            counts.set(key, {
              item,
              count: (existing?.count ?? 0) + item.quantity,
            });
          }
        }

        const mostFrequent = [...counts.values()].sort((a, b) => b.count - a.count)[0];
        setUsualItem(mostFrequent?.item ?? null);
      } else {
        setUsualItem(null);
      }
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your R&R Passport.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const completed = useMemo(
    () => orders.filter((order) => order.status === "completed").length,
    [orders],
  );

  const activeOrder = useMemo(
    () =>
      orders.find(
        (order) => !["completed", "cancelled"].includes(order.status),
      ) ?? null,
    [orders],
  );

  const latestOrder = orders[0] ?? null;

  if (loading) {
    return (
      <section className="bg-[#f5f1e8] px-5 py-16 lg:px-10">
        <div className="mx-auto max-w-[1440px]">
          <div className="h-10 w-56 animate-pulse bg-black/10" />
          <div className="mt-8 grid gap-px bg-black/10 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-28 bg-white" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <AccountPassportHero name={name} passportId={passportId} />

      <section className="bg-[#f5f1e8] px-5 py-12 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          {error ? (
            <div className="mb-8 border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col gap-4 border-b border-black/10 pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/35">
                YOUR PASSPORT
              </p>
              <h2 className="mt-2 font-serif text-3xl tracking-[-0.03em] md:text-4xl">
                Your R&R activity
              </h2>
            </div>

            <button
              type="button"
              onClick={async () => {
                setRefreshing(true);
                await load();
              }}
              disabled={refreshing}
              className="inline-flex items-center gap-2 self-start border border-black/10 bg-white px-4 py-2.5 text-xs font-medium !text-black/65 hover:bg-black hover:!text-white disabled:opacity-50 md:self-auto"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          <div className="mt-6 grid gap-px border border-black/10 bg-black/10 md:grid-cols-4">
            <Metric label="Orders" value={orders.length} icon={<ShoppingBag size={17} />} />
            <Metric label="Saved moves" value={favourites.length} icon={<Bookmark size={17} />} />
            <Metric label="Completed" value={completed} icon={<Droplets size={17} />} />
            <Metric label="Passport" value="R&R" icon={<Sparkles size={17} />} compact />
          </div>

          {activeOrder ? (
            <section className="mt-12 overflow-hidden border border-black/10 bg-white">
              <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
                <div className="p-7 md:p-10">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-black/35">
                    YOUR NEXT MOVE
                  </p>
                  <h3 className="mt-4 font-serif text-4xl tracking-[-0.04em]">
                    {activeOrder.order_number ?? "Current order"}
                  </h3>
                  <p className="mt-3 text-sm capitalize text-black/50">
                    {date(activeOrder.created_at)} · {status(activeOrder.status)}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href={`/order?order=${encodeURIComponent(activeOrder.order_number ?? activeOrder.id)}`}
                      className="inline-flex items-center gap-2 bg-[#111111] px-5 py-3 text-sm font-medium !text-white hover:bg-[#292929] hover:!text-white"
                    >
                      Track order <ArrowUpRight size={15} />
                    </Link>
                    <Link
                      href={`/account/orders/${encodeURIComponent(activeOrder.order_number ?? activeOrder.id)}`}
                      className="inline-flex items-center gap-2 border border-black/15 px-5 py-3 text-sm !text-black hover:bg-black hover:!text-white"
                    >
                      View details <ArrowUpRight size={15} />
                    </Link>
                  </div>
                </div>

                <div className="flex items-center border-t border-black/10 bg-[#faf8f3] p-7 lg:border-l lg:border-t-0 md:p-10">
                  <div>
                    <Clock3 size={22} className="text-black/35" />
                    <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">
                      Current status
                    </p>
                    <p className="mt-2 font-serif text-3xl capitalize">
                      {status(activeOrder.status)}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-black/45">
                      Your order is moving through the R&R process.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          ) : latestOrder ? (
            <section className="mt-12 border border-black/10 bg-white p-8 md:p-12">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-black/35">
                    YOUR MOST RECENT MOVE
                  </p>
                  <h3 className="mt-4 font-serif text-4xl tracking-[-0.04em]">
                    {recentItems.length
                      ? recentItems.map((item) => item.product_name).join(" · ")
                      : latestOrder.order_number}
                  </h3>
                  <p className="mt-3 text-sm text-black/50">
                    {date(latestOrder.created_at)} · {money(latestOrder.total)} · {status(latestOrder.status)}
                  </p>
                </div>
                <Link
                  href={`/account/orders/${encodeURIComponent(latestOrder.order_number ?? latestOrder.id)}`}
                  className="inline-flex items-center gap-2 border border-black/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] !text-black hover:bg-black hover:!text-white"
                >
                  View move <ArrowUpRight size={14} />
                </Link>
              </div>
            </section>
          ) : (
            <section className="mt-12 border border-black/10 bg-white p-8 md:p-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-black/35">
                WELCOME TO THE HOUSE
              </p>
              <h3 className="mt-4 max-w-xl font-serif text-4xl tracking-[-0.04em]">
                Your Passport is ready.
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-7 text-black/50">
                Start with a juice, save a favourite, or explore what is happening at Rook & Reed.
              </p>
              <div className="mt-8 grid gap-px border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-4">
                <PassportExplore href="/menu" label="Menu" />
                <PassportExplore href="/house" label="House" />
                <PassportExplore href="/jazz" label="Jazz" />
                <PassportExplore href="/chess" label="Chess" />
              </div>
            </section>
          )}

          {usualItem ? (
            <section className="mt-12 overflow-hidden border border-black/10 bg-white">
              <div className="grid md:grid-cols-[0.72fr_1.28fr]">
                <div className="relative min-h-[280px] bg-black/5">
                  <img
                    src={productImage(slugify(usualItem.product_name))}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.src = "/images/products/the-first-move.jpg";
                    }}
                  />
                </div>
                <div className="p-8 md:p-12">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-black/35">
                    YOUR USUAL
                  </p>
                  <h3 className="mt-4 font-serif text-4xl tracking-[-0.04em]">
                    {usualItem.product_name}
                  </h3>
                  <p className="mt-3 text-sm text-black/50">
                    A repeat pattern in your completed orders.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/menu"
                      className="inline-flex items-center gap-2 bg-[#111111] px-5 py-3 text-sm font-medium !text-white hover:bg-[#292929] hover:!text-white"
                    >
                      Find it on the menu <ArrowUpRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          <div className="mt-14 grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <ActivitySection title="Recent moves" eyebrow="ORDER HISTORY" href="/account/orders">
              {orders.slice(0, 4).length ? (
                orders.slice(0, 4).map((order) => (
                  <Link
                    key={order.id}
                    href={`/account/orders/${encodeURIComponent(order.order_number ?? order.id)}`}
                    className="group flex items-center justify-between gap-6 border-b border-black/10 py-5"
                  >
                    <div>
                      <p className="font-medium">{order.order_number ?? "R&R Order"}</p>
                      <p className="mt-1 text-xs capitalize text-black/40">
                        {date(order.created_at)} · {status(order.status)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-black/60">{money(order.total)}</span>
                      <ChevronRight size={16} className="text-black/25 group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-10 text-sm text-black/45">
                  Your first move starts at the menu.
                </div>
              )}
            </ActivitySection>

            <ActivitySection title="Saved moves" eyebrow="YOUR COLLECTION" href="/account/favourites">
              {favourites.slice(0, 3).length ? (
                <div className="grid gap-3">
                  {favourites.slice(0, 3).map((fav) => (
                    <Link
                      key={`${fav.profile_id}-${fav.product_id}`}
                      href={fav.product ? `/menu/${fav.product.slug}` : "/menu"}
                      className="group grid grid-cols-[76px_1fr_auto] items-center gap-4 border border-black/10 bg-white p-3 transition hover:bg-[#faf8f3]"
                    >
                      <div className="relative h-20 overflow-hidden bg-black/5">
                        <img
                          src={productImage(fav.product?.slug)}
                          alt={fav.product?.name ?? "Saved juice"}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          onError={(event) => {
                            event.currentTarget.src = "/images/products/the-first-move.jpg";
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{fav.product?.name ?? "Saved juice"}</p>
                        <p className="mt-1 text-xs text-black/40">
                          {fav.product
                            ? `${fav.product.size} · ${money(fav.product.price)}`
                            : "View menu"}
                        </p>
                      </div>
                      <ChevronRight size={16} className="text-black/25 group-hover:translate-x-1" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-sm text-black/45">
                  <Heart size={22} strokeWidth={1.2} className="mb-4 text-black/30" />
                  Save a juice and it will live here.
                </div>
              )}
            </ActivitySection>
          </div>

          <AccountLoyaltyCard />

          <section className="mt-16 border-t border-black/10 pt-10">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <QuickLink href="/account/orders" label="Your Orders" />
              <QuickLink href="/account/favourites" label="Saved Moves" />
              <QuickLink href="/account/rewards" label="R&R Moves" />
              <QuickLink href="/menu" label="Make a Move" />
              <QuickLink href="/account/settings" label="Account Settings" />
            </div>
          </section>

          <section className="mt-16 overflow-hidden bg-[#111111] text-white">
            <div className="grid lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="p-8 md:p-12">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
                  THE HOUSE
                </p>
                <h3 className="mt-4 max-w-2xl font-serif text-4xl tracking-[-0.04em] md:text-5xl">
                  Juice. Jazz. Chess. Books. Conversation.
                </h3>
                <p className="mt-5 max-w-xl text-sm leading-7 text-white/55">
                  Your Passport is your way back into the world of Rook & Reed.
                </p>
                <Link
                  href="/house"
                  className="mt-7 inline-flex items-center gap-2 border border-white/20 px-5 py-3 text-sm !text-white hover:bg-white hover:!text-black"
                >
                  Enter the House <ArrowUpRight size={15} />
                </Link>
              </div>
              <div className="border-t border-white/10 p-8 lg:border-l lg:border-t-0 md:p-12">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
                  SIGNED IN AS
                </p>
                <p className="mt-3 max-w-xs break-all text-sm text-white/70">{email}</p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}

function Metric({
  label,
  value,
  icon,
  compact = false,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div className="bg-white p-6">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
          {label}
        </p>
        <span className="text-black/25">{icon}</span>
      </div>
      <p className={`mt-4 font-serif tracking-[-0.03em] ${compact ? "text-3xl" : "text-4xl"}`}>
        {value}
      </p>
    </div>
  );
}

function ActivitySection({
  title,
  eyebrow,
  href,
  children,
}: {
  title: string;
  eyebrow: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-end justify-between border-b border-black/10 pb-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/35">
            {eyebrow}
          </p>
          <h3 className="mt-2 font-serif text-3xl">{title}</h3>
        </div>
        <Link
          href={href}
          className="hidden items-center gap-1 text-xs font-semibold uppercase tracking-[0.14em] !text-black/45 hover:!text-black md:flex"
        >
          View all <ChevronRight size={14} />
        </Link>
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between border border-black/10 bg-white px-5 py-5 text-sm !text-black transition-colors hover:bg-[#111111] hover:!text-white"
    >
      <span>{label}</span>
      <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}

function PassportExplore({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group bg-white p-5 !text-black transition hover:bg-[#111111] hover:!text-white"
    >
      <span className="text-xs font-semibold uppercase tracking-[0.14em]">{label}</span>
      <ArrowUpRight size={15} className="mt-7 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
    </Link>
  );
}
