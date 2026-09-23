"use client";

import Link from "next/link";
import { Heart, ArrowRight, Trash2, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  getMyFavourites,
  removeFavourite,
  type AccountFavourite,
} from "@/lib/supabase/account";

export default function AccountFavouritesPageContent() {
  const [favourites, setFavourites] = useState<AccountFavourite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      setFavourites(await getMyFavourites());
    } catch {
      setError("Unable to load your saved moves.");
    } finally {
      setLoading(false);
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
      setFavourites((current) =>
        current.filter((item) => item.product_id !== productId)
      );
    } catch {
      setError("Unable to remove that saved juice. Please try again.");
    } finally {
      setRemoving(null);
    }
  }

  return (
    <section className="mx-auto max-w-[1280px] px-5 pb-24 sm:px-8 lg:px-14">
      <div className="flex items-end justify-between gap-8 border-b border-white/15 pb-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/35">
            YOUR FAVOURITES
          </p>
          <h2 className="mt-4 font-serif text-5xl leading-[0.9] tracking-[-0.045em] sm:text-7xl">
            Saved moves.
          </h2>
        </div>

        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="hidden items-center gap-2 border border-white/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition hover:border-white/40 disabled:opacity-50 sm:inline-flex"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error ? (
        <div className="mt-8 border border-red-900/50 bg-red-950/30 px-6 py-5 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="py-16 text-sm uppercase tracking-[0.2em] text-white/40">
          Loading saved moves...
        </div>
      ) : favourites.length === 0 ? (
        <div className="py-16">
          <Heart size={30} strokeWidth={1.2} className="text-white/45" />
          <h3 className="mt-6 font-serif text-4xl tracking-[-0.03em]">
            Nothing saved yet.
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/50">
            Save the juices you want to return to. Your favourites will stay
            with your R&R Passport.
          </p>
          <Link
            href="/menu"
            className="mt-8 inline-flex items-center gap-3 border border-white/20 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] transition hover:border-white/50"
          >
            Explore the menu
            <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="grid gap-x-8 gap-y-10 pt-10 sm:grid-cols-2 lg:grid-cols-3">
          {favourites.map((item) => {
            const product = item.product;

            if (!product) return null;

            return (
              <article
                key={`${item.profile_id}-${item.product_id}`}
                className="group border-b border-white/15 pb-8"
              >
                <div className="aspect-[4/3] overflow-hidden bg-white/10">
                  {product.image_path ? (
                    <img
                      src={product.image_path}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-white text-black/30">
                      <span className="font-serif text-5xl">
                        {product.name.slice(0, 1)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-start justify-between gap-5 pt-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
                      {product.size}
                    </p>
                    <h3 className="mt-2 font-serif text-3xl tracking-[-0.03em]">
                      {product.name}
                    </h3>
                    <p className="mt-3 text-sm text-white/55">
                      KSh {Number(product.price).toLocaleString()}
                    </p>
                  </div>

                  <button
                    type="button"
                    aria-label={`Remove ${product.name} from favourites`}
                    onClick={() => void handleRemove(product.id)}
                    disabled={removing === product.id}
                    className="mt-1 border border-white/15 p-3 text-white/65 transition hover:border-white/40 hover:text-white disabled:opacity-50"
                  >
                    <Trash2 size={16} strokeWidth={1.4} />
                  </button>
                </div>

                <div className="mt-6 flex gap-5">
                  <Link
                    href={`/menu/${product.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] transition hover:text-white/65"
                  >
                    View juice
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/menu"
                    className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45 transition hover:text-white"
                  >
                    Order
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
