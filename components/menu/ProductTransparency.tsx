import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProductIngredient } from "@/lib/supabase/productIngredients";

function organicLabel(status: string) {
  return status.replaceAll("_", " ");
}

export default function ProductTransparency({ rows }: { rows: ProductIngredient[] }) {
  return (
    <section className="border-y border-black/10 bg-white">
      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/40">KNOW YOUR JUICE</p>
            <h2 className="rr-editorial mt-4 text-5xl sm:text-6xl">What is in the glass.</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-black/55">
              Every ingredient is connected to its own transparency record. Quantities are shown only when the recipe has been entered and approved for display.
            </p>
          </div>

          <div className="divide-y divide-black/10 border-t border-black/10">
            {rows.map((row, index) => {
              const ingredient = row.ingredient;
              if (!ingredient) return null;

              return (
                <article key={`${row.product_id}-${row.ingredient_id}`} className="grid gap-5 py-6 sm:grid-cols-[64px_1fr_auto] sm:items-center">
                  <div className="relative h-16 w-16 overflow-hidden bg-[#f5f1e8]">
                    {ingredient.image_path ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={ingredient.image_path} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full" style={ingredient.color ? { backgroundColor: ingredient.color } : undefined} />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-[10px] uppercase tracking-[0.16em] text-black/35">{String(index + 1).padStart(2, "0")}</span>
                      <h3 className="font-serif text-2xl">{ingredient.name}</h3>
                      {row.quantity !== null && row.unit && (
                        <span className="text-xs text-black/45">{row.quantity}{row.unit}</span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.1em] text-black/45">
                      <span>Organic status: {organicLabel(ingredient.organic_status)}</span>
                      {ingredient.source && <span>Source: {ingredient.source}</span>}
                      {ingredient.origin && <span>Origin: {ingredient.origin}</span>}
                    </div>
                  </div>

                  <Link href={`/ingredients/${ingredient.slug}`} className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] underline underline-offset-4">
                    Explore ingredient <ArrowUpRight size={13} />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
