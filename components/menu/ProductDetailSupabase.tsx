"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import AddToCartButton from "@/components/cart/AddToCartButton";
import FavouriteButton from "@/components/account/FavouriteButton";
import ProductTransparency from "@/components/menu/ProductTransparency";
import RelatedProducts from "@/components/menu/RelatedProducts";
import { getPublicProductBySlug, getPublicProducts, type PublicProduct } from "@/lib/supabase/catalog";
import { getProductIngredients, type ProductIngredient } from "@/lib/supabase/productIngredients";

export default function ProductDetailSupabase({ slug }: { slug: string }) {
  const [product, setProduct] = useState<PublicProduct | null>(null);
  const [ingredients, setIngredients] = useState<ProductIngredient[]>([]);
  const [related, setRelated] = useState<PublicProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [productData, allProducts] = await Promise.all([
          getPublicProductBySlug(slug),
          getPublicProducts(),
        ]);

        if (!mounted) return;
        if (!productData) {
          setError("Product not found.");
          return;
        }

        const ingredientData = await getProductIngredients(productData.id);
        if (!mounted) return;

        setProduct(productData);
        setIngredients(ingredientData);

        const matches = allProducts
          .filter((item) => item.id !== productData.id)
          .map((item) => {
            let score = 0;
            if (item.category === productData.category) score += 3;
            if (item.tone && productData.tone && item.tone === productData.tone) score += 2;
            if (item.featured) score += 0.25;
            return { item, score };
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
          .map(({ item }) => item);

        setRelated(matches);
      } catch (err) {
        console.error(err);
        if (mounted) setError("We could not load this product.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void load();
    return () => { mounted = false; };
  }, [slug]);

  const ingredientNames = useMemo(
    () => ingredients.map((row) => row.ingredient?.name).filter(Boolean).join(" · "),
    [ingredients],
  );

  if (loading) {
    return <main className="min-h-[70vh] bg-[var(--rr-paper)]"><div className="rr-container flex min-h-[70vh] items-center justify-center"><p className="text-xs font-semibold uppercase tracking-[0.18em]">Loading the pour</p></div></main>;
  }

  if (!product || error) {
    return <main className="min-h-[70vh] bg-[var(--rr-paper)]"><div className="rr-container flex min-h-[70vh] flex-col items-center justify-center text-center"><p className="rr-kicker">R&R MENU</p><h1 className="rr-editorial mt-5 text-5xl">Product not found.</h1><Link href="/menu" className="mt-8 inline-flex items-center gap-2 border border-black bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] !text-white"><ArrowLeft className="h-4 w-4" /> Back to menu</Link></div></main>;
  }

  const image = product.image_path || `/images/products/${product.slug}.jpg`;

  return (
    <main className="bg-[var(--rr-paper)]">
      <section className="border-b border-black/10">
        <div className="grid min-h-[calc(100vh-80px)] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative min-h-[60vh] overflow-hidden bg-black lg:min-h-[780px]">
            {product.video_path ? (
              <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline poster={image}>
                <source src={product.video_path} />
              </video>
            ) : (
              <Image src={image} alt={product.name} fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
            <div className="absolute left-5 top-5 sm:left-8 sm:top-8"><Link href="/menu" className="inline-flex items-center gap-2 border border-white/30 bg-black/35 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] !text-white backdrop-blur-sm"><ArrowLeft className="h-4 w-4" /> Menu</Link></div>
            <div className="absolute bottom-6 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/65">{product.category_label}</p><p className="mt-3 max-w-3xl font-serif text-3xl leading-none text-white sm:text-5xl">{ingredientNames || "The composition"}</p></div>
          </div>

          <div className="flex items-center">
            <div className="w-full px-6 py-14 sm:px-10 lg:px-14 lg:py-20">
              <div className="flex items-start justify-between gap-5"><div><p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/45">{product.category_label}</p><h1 className="rr-editorial mt-5 max-w-xl text-6xl leading-[0.86] sm:text-7xl">{product.name}</h1></div><FavouriteButton productId={product.id} /></div>
              {product.note && <p className="mt-7 max-w-xl text-lg leading-8 text-black/65">{product.note}</p>}
              {product.description && <p className="mt-5 max-w-xl text-sm leading-7 text-black/60">{product.description}</p>}
              <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-black/10 py-5"><span className="text-lg font-semibold">KSh {Number(product.price).toLocaleString("en-KE")}</span><span className="text-sm text-black/55">{product.size}</span></div>
              <div className="mt-8 max-w-sm"><AddToCartButton product={product} /></div>
              <div className="mt-10 grid gap-3 border-t border-black/10 pt-8 sm:grid-cols-2">{["Connected ingredients", "Visible sourcing data", product.preparation, product.freshness].map((item) => <div key={item} className="flex items-start gap-3 text-sm text-black/65"><span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border border-black/15"><Check className="h-3.5 w-3.5" /></span><span>{item}</span></div>)}</div>
              <div className="mt-10 flex flex-wrap gap-5 text-xs font-semibold uppercase tracking-[0.15em]"><Link href="#ingredients" className="inline-flex items-center gap-2">Ingredients <ArrowRight className="h-3.5 w-3.5" /></Link><Link href="/process" className="inline-flex items-center gap-2">Our process <ArrowRight className="h-3.5 w-3.5" /></Link><Link href="/checkout" className="inline-flex items-center gap-2"><ShoppingBag className="h-3.5 w-3.5" /> Basket</Link></div>
            </div>
          </div>
        </div>
      </section>

      {product.detailed_description && <section className="bg-[#111111] text-white"><div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-14 lg:py-24"><div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr]"><p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">THE STORY</p><div><h2 className="rr-editorial text-5xl sm:text-6xl">Made with intention.</h2><p className="mt-7 max-w-3xl whitespace-pre-line text-base leading-8 text-white/65">{product.detailed_description}</p></div></div></div></section>}

      <div id="ingredients"><ProductTransparency rows={ingredients} /></div>

      <section className="bg-[var(--rr-paper)]"><div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-14 lg:py-24"><div className="grid gap-px bg-black/10 lg:grid-cols-2"><InfoPanel label="PREPARATION" value={product.preparation} /><InfoPanel label="FRESHNESS" value={product.freshness} /><InfoPanel label="ADDITIVES" value={product.additives} /><InfoPanel label="CONCENTRATE" value={product.concentrate} /></div></div></section>

      <section className="border-y border-black/10 bg-white"><div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-14 lg:py-24"><div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]"><div><p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/40">NUTRITION</p><h2 className="rr-editorial mt-4 text-5xl">What we can verify.</h2></div><div>{product.health_benefits.length ? <ul className="divide-y divide-black/10 border-t border-black/10">{product.health_benefits.map((item) => <li key={item} className="py-5 text-sm leading-7 text-black/65">{item}</li>)}</ul> : <p className="border-t border-black/10 pt-5 text-sm leading-7 text-black/45">Nutrition notes will appear here once verified product information has been entered.</p>}<p className="mt-6 text-[10px] leading-5 text-black/40">Nutrition notes are informational and are not medical advice. R&R does not use this section for disease treatment or prevention claims.</p></div></div></div></section>

      <RelatedProducts products={related} />
    </main>
  );
}

function InfoPanel({ label, value }: { label: string; value: string }) {
  return <article className="bg-[var(--rr-paper)] p-7 sm:p-9"><p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/40">{label}</p><p className="mt-4 max-w-xl text-base leading-7 text-black/65">{value}</p></article>;
}
