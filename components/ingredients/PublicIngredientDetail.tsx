"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { getProductsUsingIngredient, getPublicIngredientBySlug, type PublicIngredient, type PublicIngredientProduct } from "@/lib/supabase/publicIngredients";

export default function PublicIngredientDetail({ slug }: { slug: string }) {
  const [ingredient, setIngredient] = useState<PublicIngredient | null>(null);
  const [products, setProducts] = useState<PublicIngredientProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await getPublicIngredientBySlug(slug);
      if (!data) { setIngredient(null); return; }
      setIngredient(data);
      setProducts(await getProductsUsingIngredient(data.id));
    } catch (err) {
      console.error("PUBLIC INGREDIENT ERROR:", err);
      setError(err instanceof Error ? err.message : "We could not load this ingredient.");
    } finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, [slug]);

  if (loading) return <main className="min-h-[70vh] bg-[var(--rr-paper)]"><div className="rr-container flex min-h-[70vh] items-center justify-center"><p className="text-[10px] font-semibold uppercase tracking-[0.2em]">Loading ingredient</p></div></main>;

  if (error || !ingredient) return <main className="min-h-[70vh] bg-[var(--rr-paper)]"><div className="rr-container flex min-h-[70vh] flex-col items-center justify-center text-center"><p className="rr-kicker">R&R INGREDIENTS</p><h1 className="rr-editorial mt-5 text-5xl">Ingredient not found.</h1>{error && <p className="mt-5 max-w-xl text-sm leading-7 text-black/55">{error}</p>}<Link href="/ingredients" className="mt-8 inline-flex items-center gap-2 border border-black bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] !text-white"><ArrowLeft className="h-4 w-4" />Back to ingredients</Link></div></main>;

  const image = ingredient.image_path || `/images/ingredients/${ingredient.slug}.jpg`;

  return <main className="bg-[var(--rr-paper)]">
    <section className="border-b border-black/10"><div className="grid min-h-[calc(100vh-80px)] lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative min-h-[58vh] overflow-hidden bg-[#e7e2d8] lg:min-h-[720px]"><Image src={image} alt={ingredient.name} fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/5" /><Link href="/ingredients" className="absolute left-5 top-5 inline-flex items-center gap-2 border border-white/30 bg-black/35 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] !text-white backdrop-blur-sm sm:left-8 sm:top-8"><ArrowLeft className="h-4 w-4" />Ingredients</Link><div className="absolute bottom-6 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/65">{ingredient.category || "Ingredient"}</p><h1 className="mt-3 font-serif text-5xl leading-none text-white sm:text-7xl">{ingredient.name}</h1></div></div>
      <div className="flex items-center"><div className="w-full px-6 py-14 sm:px-10 lg:px-14 lg:py-20"><div className="flex items-start justify-between gap-6"><div><p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/40">INGREDIENT RECORD</p><h2 className="rr-editorial mt-5 text-6xl leading-[0.86] sm:text-7xl">{ingredient.name}</h2></div><button type="button" onClick={() => void load()} className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-black/15 hover:border-black" aria-label="Refresh ingredient"><RefreshCw className="h-4 w-4" /></button></div>{ingredient.short_description && <p className="mt-7 max-w-xl text-lg leading-8 text-black/65">{ingredient.short_description}</p>}{ingredient.description && <p className="mt-5 max-w-xl whitespace-pre-line text-sm leading-7 text-black/60">{ingredient.description}</p>}<div className="mt-9 grid gap-px bg-black/10 sm:grid-cols-2"><DataItem label="Organic status" value={formatStatus(ingredient.organic_status)} /><DataItem label="Source" value={ingredient.source} /><DataItem label="Origin" value={ingredient.origin} /><DataItem label="Seasonality" value={ingredient.seasonality} /></div><div className="mt-10 grid gap-3 border-t border-black/10 pt-8"><CheckItem label="Preparation" value={ingredient.preparation} /><CheckItem label="Storage" value={ingredient.storage} /></div></div></div>
    </div></section>

    {ingredient.video_path && <section className="bg-black"><video className="mx-auto block aspect-video w-full max-w-[1440px] object-cover" controls playsInline preload="metadata" poster={image}><source src={ingredient.video_path} /></video></section>}

    <section className="border-b border-black/10 bg-white"><div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-14 lg:py-24"><div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr]"><div><p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-black/40">KNOW YOUR INGREDIENT</p><h2 className="rr-editorial mt-4 text-5xl sm:text-6xl">What we know.</h2></div><div><div className="grid gap-px bg-black/10 sm:grid-cols-2"><DataItem label="Organic status" value={formatStatus(ingredient.organic_status)} /><DataItem label="Source" value={ingredient.source} /><DataItem label="Origin" value={ingredient.origin} /><DataItem label="Seasonality" value={ingredient.seasonality} /><DataItem label="Preparation" value={ingredient.preparation} /><DataItem label="Storage" value={ingredient.storage} /></div><p className="mt-6 text-[10px] leading-5 text-black/40">R&R only presents sourcing and ingredient information that has been entered and verified by the R&R team. Unknown information remains marked as unknown or required input.</p></div></div></div></section>

    <section className="bg-[var(--rr-paper)]"><div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-14 lg:py-24"><div className="flex items-end justify-between gap-6 border-b border-black/10 pb-6"><div><p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-black/40">USED IN</p><h2 className="rr-editorial mt-3 text-5xl">The R&R menu.</h2></div></div>{products.length ? <div className="mt-10 grid gap-px bg-black/10 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <Link key={product.id} href={`/menu/${product.slug}`} className="group bg-[var(--rr-paper)]"><div className="relative aspect-[4/5] overflow-hidden bg-white"><Image src={product.image_path || `/images/products/${product.slug}.jpg`} alt={product.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" /></div><div className="flex items-end justify-between gap-4 p-6"><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/40">{product.category_label}</p><h3 className="mt-2 font-serif text-2xl">{product.name}</h3><p className="mt-2 text-sm text-black/50">{product.size} · KSh {Number(product.price).toLocaleString("en-KE")}</p></div><ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" /></div></Link>)}</div> : <div className="mt-10 border border-black/10 bg-white p-8"><p className="text-sm leading-7 text-black/55">This ingredient is not currently connected to an active R&R product.</p></div>}</div></section>
  </main>;
}

function DataItem({ label, value }: { label: string; value: string | null | undefined }) { return <div className="bg-[var(--rr-paper)] p-6 sm:p-7"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">{label}</p><p className="mt-3 text-sm leading-6 text-black/65">{value && value.trim() ? value : "REQUIRED INPUT"}</p></div>; }
function CheckItem({ label, value }: { label: string; value: string | null | undefined }) { return <div className="flex items-start gap-3 text-sm text-black/65"><span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border border-black/15"><Check className="h-3.5 w-3.5" /></span><span><span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-black/40">{label}</span><span className="mt-1 block leading-6">{value && value.trim() ? value : "REQUIRED INPUT"}</span></span></div>; }
function formatStatus(value: PublicIngredient["organic_status"]) { return value.replaceAll("_", " "); }
