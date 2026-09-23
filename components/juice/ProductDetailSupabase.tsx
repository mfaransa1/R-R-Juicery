"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ShoppingBag,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

import AddToCartButton from "@/components/cart/AddToCartButton";
import {
  getPublicProductBySlug,
  type PublicProduct,
} from "@/lib/supabase/catalog";

type Props = {
  slug: string;
};

export default function ProductDetailSupabase({ slug }: Props) {
  const [product, setProduct] = useState<PublicProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const data = await getPublicProductBySlug(slug);

        if (mounted) {
          setProduct(data);
          setError(data ? "" : "Product not found.");
        }
      } catch (err) {
        console.error(err);

        if (mounted) {
          setError("We could not load this product.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-[var(--rr-paper)]">
        <div className="rr-container flex min-h-[70vh] items-center justify-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em]">
            Loading the pour
          </p>
        </div>
      </main>
    );
  }

  if (!product || error) {
    return (
      <main className="min-h-[70vh] bg-[var(--rr-paper)]">
        <div className="rr-container flex min-h-[70vh] flex-col items-center justify-center text-center">
          <p className="rr-kicker">R&R MENU</p>

          <h1 className="rr-editorial mt-5 text-5xl">
            Product not found.
          </h1>

          <Link
            href="/menu"
            className="mt-8 inline-flex items-center gap-2 border border-black bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] !text-white transition hover:bg-white hover:!text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to menu
          </Link>
        </div>
      </main>
    );
  }

  const image =
    product.image_path ||
    `/images/products/${product.slug}.jpg`;

  return (
    <main className="bg-[var(--rr-paper)]">
      <section className="border-b border-black/10">
        <div className="grid min-h-[calc(100vh-80px)] lg:grid-cols-2">
          <motion.div
            className="relative min-h-[55vh] overflow-hidden bg-black/5 lg:min-h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={image}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/5" />

            <div className="absolute left-6 top-6 sm:left-8 sm:top-8">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 border border-white/30 bg-black/35 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] !text-white backdrop-blur-sm transition hover:bg-white hover:!text-black"
              >
                <ArrowLeft className="h-4 w-4" />
                Menu
              </Link>
            </div>
          </motion.div>

          <div className="flex items-center">
            <div className="w-full px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                {product.category_label || product.category}
              </p>

              <h1 className="rr-editorial mt-5 max-w-xl text-6xl leading-[0.88] sm:text-7xl">
                {product.name}
              </h1>

              {product.note && (
                <p className="mt-6 max-w-xl text-lg leading-8 text-black/65">
                  {product.note}
                </p>
              )}

              {product.description && (
                <p className="mt-5 max-w-xl text-sm leading-7 text-black/60">
                  {product.description}
                </p>
              )}

              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-black/10 py-5">
                <span className="text-lg font-semibold">
                  KSh {product.price.toLocaleString("en-KE")}
                </span>

                <span className="text-sm text-black/55">
                  {product.size}
                </span>
              </div>

              <div className="mt-8 max-w-sm">
                <AddToCartButton product={product} />
              </div>

              <div className="mt-10 grid gap-3 border-t border-black/10 pt-8 sm:grid-cols-2">
                {[
                  "Freshly prepared",
                  "Visible ingredients",
                  "No unnecessary additives",
                  "Know your juice",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-black/65"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-black/15">
                      <Check className="h-3.5 w-3.5" />
                    </span>

                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-5 text-xs font-semibold uppercase tracking-[0.15em]">
                <Link
                  href="/process"
                  className="inline-flex items-center gap-2"
                >
                  Our process
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  href="/ingredients"
                  className="inline-flex items-center gap-2"
                >
                  Know your juice
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  href="/checkout"
                  className="inline-flex items-center gap-2"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}