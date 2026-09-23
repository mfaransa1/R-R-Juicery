"use client";

import Link from "next/link";
import { ArrowRight, Heart, RefreshCw, ShoppingBag, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  getMyFavourites,
  removeFavourite,
  type AccountFavourite,
} from "@/lib/supabase/account";

function money(value: number | string) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function productImage(slug?: string | null) {
  return slug ? `/images/products/${slug}.jpg` : "/images/products/the-first-move.jpg";
}

export default function AccountFavouritesPageContent() {
  const [favourites, setFavourites] = useState<AccountFavourite[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState<string | null>(null);

  const load = useCallback(async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);
    setError("");
    try {
      setFavourites(await getMyFavourites());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load your saved moves.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleRemove(productId: string) {
    setRemoving(productId);
    setError("");
    try {
      await removeFavourite(productId);
      setFavourites((current) => current.filter((item) => item.product_id !== productId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to remove that saved move.");
    } finally {
      setRemoving(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f1e8] px-5 pb-24 pt-28 text-[#111] sm:px-8 lg:px-10 lg:pt-36">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col gap-7 border-b border-black/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/35">
              R&R PASSPORT / YOUR COLLECTION
            </p>
            <h1 className="mt-4 font-serif text-5xl leading-[0.9] tracking-[-0.045em] sm:text-7xl">
              Saved moves.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-black/50">
              Keep the juices you want to return to close at hand.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void load(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 self-start border border-black/10 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] !text-black hover:bg-black hover:!text-white disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {error ? (
          <div className="mt-8 border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>
        ) : null}

        {loading ? (
          <div className="mt-10 grid gap-px border border-black/10 bg-black/10 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-[380px] animate-pulse bg-white" />
            ))}
          </div>
        ) : favourites.length === 0 ? (
          <section className="mt-10 border border-black/10 bg-white p-8 md:p-14">
            <Heart size={30} strokeWidth={1.15} className="text-black/30" />
            <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.25em] text-black/35">
              YOUR COLLECTION IS EMPTY
            </p>
            <h2 className="mt-3 font-serif text-4xl tracking-[-0.04em]">Nothing saved yet.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-black/50">
              Find a juice you want to remember, save it to your Passport, and it will appear here.
            </p>
            <Link
              href="/menu"
              className="mt-8 inline-flex items-center gap-3 bg-black px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] !text-white hover:bg-[#292929] hover:!text-white"
            >
              Explore the menu <ArrowRight size={15} />
            </Link>
          </section>
        ) : (
          <div className="mt-10 grid gap-px border border-black/10 bg-black/10 md:grid-cols-2 lg:grid-cols-3">
            {favourites.map((fav) => (
              <article key={`${fav.profile_id}-${fav.product_id}`} className="group bg-white">
                <Link href={fav.product ? `/menu/${fav.product.slug}` : "/menu"} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
                    <img
                      src={productImage(fav.product?.slug)}
                      alt={fav.product?.name ?? "Saved juice"}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
                      onError={(event) => {
                        event.currentTarget.src = "/images/products/the-first-move.jpg";
                      }}
                    />
                    <div className="absolute left-4 top-4 border border-white/30 bg-black/45 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] !text-white backdrop-blur-sm">
                      Saved move
                    </div>
                  </div>
                </Link>

                <div className="p-6 md:p-7">
                  <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0">
                      <h2 className="font-serif text-3xl tracking-[-0.03em]">
                        {fav.product?.name ?? "Saved juice"}
                      </h2>
                      <p className="mt-2 text-xs text-black/45">
                        {fav.product
                          ? `${fav.product.size} · ${money(fav.product.price)}`
                          : "View the current menu"}
                      </p>
                    </div>
                    <ShoppingBag size={18} strokeWidth={1.25} className="shrink-0 text-black/25" />
                  </div>

                  <div className="mt-7 flex items-center justify-between gap-3 border-t border-black/10 pt-5">
                    <Link
                      href={fav.product ? `/menu/${fav.product.slug}` : "/menu"}
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] !text-black hover:!text-black"
                    >
                      View move <ArrowRight size={14} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => void handleRemove(fav.product_id)}
                      disabled={removing === fav.product_id}
                      className="inline-flex items-center gap-2 px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] !text-black/40 hover:!text-black disabled:opacity-40"
                    >
                      <Trash2 size={13} />
                      {removing === fav.product_id ? "Removing" : "Remove"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-14 flex flex-wrap gap-3 border-t border-black/10 pt-8">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 border border-black/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] !text-black hover:bg-black hover:!text-white"
          >
            Back to Passport <ArrowRight size={14} />
          </Link>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] !text-white hover:bg-[#292929] hover:!text-white"
          >
            Make a move <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </main>
  );
}
