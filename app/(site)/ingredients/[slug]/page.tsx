import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/motion/FadeIn";
import { getIngredient, ingredients } from "@/data/ingredients";
import { products } from "@/data/products";

type IngredientPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const toneClasses: Record<string, string> = {
  pineapple: "bg-[#e7b83c]",
  orange: "bg-[#f29a24]",
  ginger: "bg-[#d89a42]",
  cucumber: "bg-[#5d8062]",
  apple: "bg-[#9bb34a]",
  spinach: "bg-[#527553]",
  lemon: "bg-[#ead34c]",
  mint: "bg-[#86a982]",
  beet: "bg-[#7d2638]",
  mango: "bg-[#d99b28]",
  passion: "bg-[#c96a3d]",
  watermelon: "bg-[#d85c55]",
  lime: "bg-[#a6b93b]",
  cane: "bg-[#78905a]",
};

export function generateStaticParams() {
  return ingredients.map((ingredient) => ({
    slug: ingredient.slug,
  }));
}

export default async function IngredientPage({
  params,
}: IngredientPageProps) {
  const { slug } = await params;
  const ingredient = getIngredient(slug);

  if (!ingredient) {
    notFound();
  }

  const ingredientProducts = products.filter((product) =>
    product.ingredients.some(
      (item) =>
        item.name.toLowerCase() ===
        ingredient.name.toLowerCase(),
    ),
  );

  return (
    <main className="bg-[#f5f1e8] text-[#111111]">
      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="pt-20">
        <div className="grid min-h-[calc(100svh-80px)] lg:grid-cols-2">
          <div
            className={`relative min-h-[65vh] overflow-hidden lg:min-h-0 ${
              toneClasses[ingredient.tone] ??
              "bg-[#d8d2c7]"
            }`}
          >
            <div className="absolute inset-0">
              <div className="absolute left-[12%] top-[15%] h-48 w-48 rounded-full border border-black/10" />

              <div className="absolute right-[12%] top-[30%] h-32 w-32 rounded-full border border-black/10" />

              <div className="absolute bottom-[12%] left-[30%] h-64 w-64 rounded-full border border-black/10" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center px-6">
              <h1 className="rr-editorial text-center text-[clamp(4rem,9vw,9rem)] font-medium leading-[0.82] tracking-[-0.055em] text-black/80">
                {ingredient.name}
              </h1>
            </div>

            <div className="absolute left-6 top-6 sm:left-10 sm:top-10">
              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-black/40">
                Ingredient
              </span>
            </div>
          </div>

          <div className="flex items-center bg-[#f5f1e8] px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
            <div className="w-full max-w-xl">
              <FadeIn>
                <Link
                  href="/ingredients"
                  className="text-[9px] font-bold uppercase tracking-[0.16em] text-black/40 hover:text-black"
                >
                  ← All ingredients
                </Link>
              </FadeIn>

              <FadeIn delay={0.08}>
                <p className="rr-kicker mt-12 text-black/35">
                  Know Your Juice
                </p>

                <h2 className="rr-editorial mt-5 text-6xl font-medium leading-[0.85] tracking-[-0.045em] sm:text-7xl lg:text-8xl">
                  {ingredient.name}
                </h2>
              </FadeIn>

              <FadeIn delay={0.14}>
                <p className="mt-8 text-base leading-8 text-black/60">
                  {ingredient.description}
                </p>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="mt-8 border-y border-black/10">
                  <IngredientInfo
                    label="Origin"
                    value={ingredient.origin}
                  />

                  <IngredientInfo
                    label="Organic status"
                    value={formatOrganicStatus(
                      ingredient.organicStatus,
                    )}
                  />

                  <IngredientInfo
                    label="Seasonality"
                    value={ingredient.seasonality}
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          HANDLING
      ===================================================== */}
      <section className="bg-white">
        <Container>
          <div className="grid gap-16 py-24 sm:py-32 lg:grid-cols-[0.7fr_1.3fr] lg:py-40">
            <FadeIn>
              <div>
                <p className="rr-kicker text-black/35">
                  Behind the ingredient
                </p>

                <h2 className="rr-editorial mt-5 text-5xl font-medium leading-[0.88] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                  From
                  <br />
                  source
                  <br />
                  to juice.
                </h2>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="border-t border-black/10">
                <IngredientInfo
                  label="Preparation"
                  value={ingredient.preparation}
                />

                <IngredientInfo
                  label="Storage"
                  value={ingredient.storage}
                />

                <IngredientInfo
                  label="R&R note"
                  value={ingredient.notes}
                />
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* =====================================================
          PRODUCTS
      ===================================================== */}
      <section className="bg-[#f5f1e8]">
        <Container>
          <div className="py-24 sm:py-32">
            <FadeIn>
              <p className="rr-kicker text-black/35">
                On the menu
              </p>

              <h2 className="rr-editorial mt-4 text-5xl font-medium leading-none tracking-[-0.04em] sm:text-6xl">
                Find it in these.
              </h2>
            </FadeIn>

            {ingredientProducts.length > 0 ? (
              <div className="mt-12 border-t border-black/10">
                {ingredientProducts.map((product, index) => (
                  <FadeIn
                    key={product.slug}
                    delay={index * 0.05}
                  >
                    <Link
                      href={`/menu/${product.slug}`}
                      className="group grid gap-4 border-b border-black/10 py-7 transition-colors hover:bg-black/[0.025] sm:grid-cols-[70px_1fr_auto] sm:items-center sm:px-4"
                    >
                      <span className="text-[9px] font-bold tracking-[0.15em] text-black/30">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div>
                        <h3 className="rr-editorial text-3xl font-medium tracking-[-0.025em]">
                          {product.name}
                        </h3>

                        <p className="mt-2 text-xs uppercase tracking-[0.05em] text-black/40">
                          {product.ingredients
                            .map(
                              (item) => item.name,
                            )
                            .join(" · ")}
                        </p>
                      </div>

                      <span className="text-sm text-black/45 transition-transform duration-300 group-hover:translate-x-1">
                        KSh {product.price} →
                      </span>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            ) : (
              <p className="mt-10 text-sm text-black/50">
                This ingredient has not yet been connected
                to a published R&R product.
              </p>
            )}
          </div>
        </Container>
      </section>

      {/* =====================================================
          TRACEABILITY
      ===================================================== */}
      <section className="bg-[#111111] text-white">
        <Container>
          <div className="grid gap-12 py-24 sm:py-32 lg:grid-cols-[0.7fr_1.3fr] lg:py-40">
            <FadeIn>
              <div>
                <p className="rr-kicker text-white/35">
                  Transparency
                </p>

                <h2 className="rr-editorial mt-5 text-5xl font-medium leading-[0.88] tracking-[-0.04em] sm:text-6xl">
                  The more we
                  <br />
                  know, the more
                  <br />
                  we show.
                </h2>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div>
                <p className="max-w-2xl text-base leading-8 text-white/55 sm:text-lg">
                  Ingredient sourcing and batch information
                  will become progressively more detailed as
                  the R&R operational system is connected to
                  verified supplier and production data.
                </p>

                <div className="mt-10 grid gap-px bg-white/10 sm:grid-cols-2">
                  {[
                    "Supplier",
                    "Origin",
                    "Organic status",
                    "Season",
                    "Batch",
                    "Preparation date",
                  ].map((item) => (
                    <div
                      key={item}
                      className="bg-[#111111] px-5 py-5"
                    >
                      <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/40">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>
    </main>
  );
}

function IngredientInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="grid gap-3 border-b border-black/10 py-5 sm:grid-cols-[140px_1fr]">
      <span className="text-[9px] font-bold uppercase tracking-[0.13em] text-black/35">
        {label}
      </span>

      <span className="text-sm leading-6 text-black/60">
        {value}
      </span>
    </div>
  );
}

function formatOrganicStatus(
  status: "verified_organic" | "supplier_claimed" | "conventional" | "unknown",
) {
  switch (status) {
    case "verified_organic":
      return "Verified organic";

    case "supplier_claimed":
      return "Supplier claimed";

    case "conventional":
      return "Conventional";

    default:
      return "Status to verify";
  }
}