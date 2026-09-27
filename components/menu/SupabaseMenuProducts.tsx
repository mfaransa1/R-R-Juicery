"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Loader2, Search, Sparkles } from "lucide-react";
import Link from "next/link";

import AddToCartButton from "@/components/cart/AddToCartButton";
import { getPublicProducts, type PublicProduct } from "@/lib/supabase/catalog";

const CATEGORY_LABELS: Record<string, string> = {
  presses: "The Presses",
  "house-compositions": "The House Compositions",
  cane: "The Cane",
  interludes: "The Interludes",
  blenders: "The Blenders",
  "seasonal-records": "The Seasonal Records",
};

const CATEGORY_ORDER = ["presses", "house-compositions", "cane", "interludes", "blenders", "seasonal-records"];

const TONE_LABELS: Record<string, string> = {
  pineapple: "Pineapple",
  cucumber: "Cucumber",
  beetroot: "Beetroot",
  mango: "Mango",
  watermelon: "Watermelon",
  passion: "Passion",
  sugarcane: "Sugarcane",
  mint: "Mint",
  citrus: "Citrus",
  seasonal: "Seasonal",
};

export default function SupabaseMenuProducts() {
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await getPublicProducts();
        if (mounted) setProducts(data);
      } catch (err) {
        console.error(err);
        if (mounted) setError("The live menu is temporarily unavailable. Please refresh and try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    void load();
    return () => { mounted = false; };
  }, []);

  const categories = useMemo(() => {
    const available = new Set(products.map((product) => product.category));
    return CATEGORY_ORDER.filter((category) => available.has(category));
  }, [products]);

  const featured = useMemo(() => products.filter((product) => product.featured).slice(0, 3), [products]);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return products.filter((product) => {
      const categoryMatch = activeCategory === "all" || product.category === activeCategory;
      if (!categoryMatch) return false;
      if (!normalized) return true;
      return [product.name, product.description, product.note, product.category_label, product.category, product.size, product.tone ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });
  }, [products, activeCategory, query]);

  if (loading) return <section className="border-t border-black/10 bg-[var(--rr-paper)]"><div className="mx-auto flex min-h-[420px] max-w-[1440px] items-center justify-center px-6"><div className="flex items-center gap-3 text-sm uppercase tracking-[0.18em]"><Loader2 className="h-4 w-4 animate-spin" /> Loading the menu</div></div></section>;

  if (error) return <section className="border-t border-black/10 bg-[var(--rr-paper)]"><div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-14"><div className="border border-red-900/15 bg-red-50 p-6 text-sm text-red-900">{error}</div></div></section>;

  return (
    <section className="border-t border-black/10 bg-[var(--rr-paper)]">
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-14 lg:py-20">
        {featured.length > 0 && activeCategory === "all" && !query && (
          <div className="mb-16">
            <div className="flex items-end justify-between gap-6 border-b border-black/10 pb-5"><div><p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/40">HOUSE COMPOSITIONS</p><h2 className="rr-editorial mt-3 text-5xl sm:text-6xl">Start with a move.</h2></div><Sparkles size={20} className="text-black/25" /></div>
            <div className="mt-7 grid gap-px bg-black/10 md:grid-cols-3">
              {featured.map((product) => <MenuCard key={product.id} product={product} featured />)}
            </div>
          </div>
        )}

        <div className="sticky top-0 z-20 -mx-5 border-y border-black/10 bg-[var(--rr-paper)]/95 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8 lg:-mx-14 lg:px-14">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/35" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search juices, ingredients or flavours..." className="w-full border border-black/15 bg-white px-10 py-3 text-sm outline-none focus:border-black" /></div>
            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
              <FilterButton active={activeCategory === "all"} onClick={() => setActiveCategory("all")}>All</FilterButton>
              {categories.map((category) => <FilterButton key={category} active={activeCategory === category} onClick={() => setActiveCategory(category)}>{CATEGORY_LABELS[category]}</FilterButton>)}
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-end justify-between gap-6 border-b border-black/10 pb-5"><div><p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/40">THE MENU</p><h2 className="rr-editorial mt-3 text-5xl sm:text-6xl">Choose your pour.</h2></div><p className="hidden text-xs text-black/40 sm:block">{filteredProducts.length} composition{filteredProducts.length === 1 ? "" : "s"}</p></div>

        {filteredProducts.length === 0 ? <div className="py-20 text-center"><p className="font-serif text-3xl">Nothing matched that move.</p><button type="button" onClick={() => { setQuery(""); setActiveCategory("all"); }} className="mt-6 border border-black bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] !text-white">Reset menu</button></div> : <div className="mt-7 grid gap-px bg-black/10 sm:grid-cols-2 lg:grid-cols-3">{filteredProducts.map((product) => <MenuCard key={product.id} product={product} />)}</div>}
      </div>
    </section>
  );
}

function MenuCard({ product, featured = false }: { product: PublicProduct; featured?: boolean }) {
  const tone = product.tone ? TONE_LABELS[product.tone] ?? product.tone : null;
  return <article className={`group bg-white ${featured ? "md:min-h-[520px]" : ""}`}>
    <Link href={`/menu/${product.slug}`} className="block">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#e7e2d8]">
        <Image src={product.image_path || `/images/products/${product.slug}.jpg`} alt={product.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-700 group-hover:scale-[1.035]" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/45 to-transparent p-4 pt-12 text-white"><span className="text-[9px] font-semibold uppercase tracking-[0.16em]">{product.category_label}</span>{tone && <span className="border border-white/30 bg-black/20 px-2 py-1 text-[9px] uppercase tracking-[0.12em] backdrop-blur-sm">{tone}</span>}</div>
      </div>
    </Link>
    <div className="p-5">
      <Link href={`/menu/${product.slug}`}><h3 className="font-serif text-3xl leading-none transition group-hover:translate-x-0.5">{product.name}</h3></Link>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-black/55">{product.description}</p>
      <p className="mt-4 text-[10px] uppercase tracking-[0.12em] text-black/35">{product.size} · KSh {Number(product.price).toLocaleString("en-KE")}</p>
      <div className="mt-5 flex items-center justify-between gap-4"><AddToCartButton product={product} /><Link href={`/menu/${product.slug}`} className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em]">Explore <ArrowRight size={14} /></Link></div>
    </div>
  </article>;
}

function FilterButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`shrink-0 border px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.14em] transition ${active ? "border-black bg-black !text-white" : "border-black/10 bg-white text-black/55 hover:border-black/30 hover:text-black"}`}>{children}</button>;
}
