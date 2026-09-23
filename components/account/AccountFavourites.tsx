"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  getMyFavourites,
  removeFavourite,
  type AccountFavourite,
} from "@/lib/supabase/account";

export default function AccountFavourites() {
  const [items, setItems] = useState<AccountFavourite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      setItems(await getMyFavourites());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load favourites."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(productId: string) {
    try {
      await removeFavourite(productId);
      setItems((current) =>
        current.filter((item) => item.product_id !== productId)
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to remove favourite."
      );
    }
  }

  return (
    <section className="border-t border-black/10 py-12">
      <div>
        <span className="rr-kicker">FAVOURITES</span>
        <h2 className="rr-editorial mt-3 text-4xl sm:text-5xl">
          Keep your favourites close.
        </h2>
      </div>

      {loading && (
        <p className="mt-8 text-sm text-black/50">
          Loading your favourites...
        </p>
      )}

      {error && (
        <div className="mt-8 border border-red-900/15 bg-red-50 p-4 text-sm text-red-900">
          {error}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="mt-8 border border-black/10 bg-white p-8">
          <p className="text-sm leading-7 text-black/60">
            You have not saved any juices yet.
          </p>
          <a
            href="/menu"
            className="mt-5 inline-flex bg-black px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white"
          >
            Find a move
          </a>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="mt-8 grid gap-px bg-black/10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const product = item.product;
            if (!product) return null;

            return (
              <article key={item.id} className="bg-[var(--rr-paper)]">
                <a href={`/menu/${product.slug}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-white">
                    <Image
                      src={
                        product.image_path ||
                        `/images/products/${product.slug}.jpg`
                      }
                      alt={product.name}
                      fill
                      className="object-cover transition duration-500 hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  <div className="p-6">
                    <span className="rr-kicker">{product.size}</span>
                    <h3 className="rr-editorial mt-2 text-3xl">
                      {product.name}
                    </h3>
                    <p className="mt-3 text-sm font-semibold">
                      KSh {Number(product.price).toLocaleString()}
                    </p>
                  </div>
                </a>

                <div className="px-6 pb-6">
                  <button
                    type="button"
                    onClick={() => remove(product.id)}
                    className="text-[10px] font-bold uppercase tracking-[0.14em] underline underline-offset-4"
                  >
                    Remove favourite
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
