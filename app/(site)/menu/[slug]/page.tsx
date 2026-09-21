import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/motion/FadeIn";
import { getProduct, products } from "@/data/products";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const toneClasses: Record<string, string> = {
  pineapple: "bg-[#e7b83c]",
  mango: "bg-[#d99b28]",
  passion: "bg-[#c96a3d]",
  watermelon: "bg-[#d85c55]",
  beet: "bg-[#7d2638]",
  cucumber: "bg-[#5d8062]",
  mint: "bg-[#86a982]",
  lime: "bg-[#a6b93b]",
  cane: "bg-[#78905a]",
};

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  const related = products
    .filter(
      (item) =>
        item.category === product.category &&
        item.slug !== product.slug,
    )
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#111111]">
      {/* Product hero */}
      <section className="pt-20">
        <div className="grid min-h-[calc(100svh-80px)] lg:grid-cols-2">
          {/* Visual */}
          <div
            className={`relative min-h-[65vh] overflow-hidden lg:min-h-0 ${
              toneClasses[product.tone] ?? "bg-[#d8d2c7]"
            }`}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="rr-editorial text-[9rem] font-medium leading-none tracking-[-0.08em] text-black/80 sm:text-[12rem] lg:text-[15rem]">
                  R&R
                </span>

                <div className="mx-auto mt-5 h-px w-16 bg-black/25" />

                <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.22em] text-black/55">
                  Freshly prepared
                </p>
              </div>
            </div>

            <div className="absolute left-6 top-6 sm:left-10 sm:top-10">
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/45">
                {product.categoryLabel}
              </span>
            </div>
          </div>

          {/* Product information */}
          <div className="flex items-center bg-[#f5f1e8] px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
            <div className="w-full max-w-xl">
              <FadeIn>
                <Link
                  href="/menu"
                  className="text-[9px] font-bold uppercase tracking-[0.16em] text-black/40 transition-colors hover:text-black"
                >
                  ← Back to menu
                </Link>
              </FadeIn>

              <FadeIn delay={0.08}>
                <p className="rr-kicker mt-12 text-black/35">
                  {product.categoryLabel}
                </p>

                <h1 className="rr-editorial mt-5 text-6xl font-medium leading-[0.85] tracking-[-0.045em] sm:text-7xl lg:text-8xl">
                  {product.name}
                </h1>
              </FadeIn>

              <FadeIn delay={0.14}>
                <p className="mt-7 text-base leading-7 text-black/60">
                  {product.description}
                </p>

                <p className="mt-4 text-base italic text-black/55">
                  {product.note}
                </p>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="mt-8 flex items-center justify-between border-y border-black/10 py-5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-black/40">
                    {product.size}
                  </span>

                  <span className="text-xl font-medium">
                    KSh {product.price}
                  </span>
                </div>
              </FadeIn>

              <FadeIn delay={0.24}>
                <Button
                  href="/checkout"
                  variant="primary"
                  className="mt-7 w-full"
                >
                  Add to bag
                </Button>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Know your juice */}
      <section className="bg-white">
        <Container>
          <div className="py-24 sm:py-32 lg:py-40">
            <FadeIn>
              <p className="rr-kicker text-black/40">
                Know Your Juice
              </p>

              <h2 className="rr-editorial mt-5 max-w-3xl text-6xl font-medium leading-[0.88] tracking-[-0.04em] sm:text-7xl lg:text-8xl">
                What's in
                <br />
                the glass.
              </h2>
            </FadeIn>

            <div className="mt-16 grid gap-16 lg:grid-cols-[1.15fr_0.85fr]">
              <FadeIn delay={0.08}>
                <div>
                  <div className="border-t border-black/10">
                    {product.ingredients.map(
                      (ingredient, index) => (
                        <div
                          key={ingredient.name}
                          className="grid grid-cols-[45px_1fr_auto] items-center gap-4 border-b border-black/10 py-5"
                        >
                          <span className="text-[9px] font-bold tracking-[0.15em] text-black/30">
                            {String(index + 1).padStart(
                              2,
                              "0",
                            )}
                          </span>

                          <span className="text-base font-medium">
                            {ingredient.name}
                          </span>

                          <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-black/35">
                            {ingredient.organicStatus ===
                            "unknown"
                              ? "To verify"
                              : ingredient.organicStatus.replace(
                                  "_",
                                  " ",
                                )}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.16}>
                <div>
                  <div className="border-t border-black/10">
                    <InfoRow
                      label="Preparation"
                      value={product.preparation}
                    />

                    <InfoRow
                      label="Freshness"
                      value={product.freshness}
                    />

                    <InfoRow
                      label="Additives"
                      value={product.additives}
                    />

                    <InfoRow
                      label="Concentrate"
                      value={product.concentrate}
                    />
                  </div>

                  <p className="mt-7 text-xs leading-6 text-black/45">
                    Ingredient sourcing and organic status
                    will be connected to verified supplier
                    and batch data as the R&R transparency
                    system develops.
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="bg-[#111111] text-white">
        <Container>
          <div className="py-24 sm:py-32 lg:py-40">
            <FadeIn>
              <p className="rr-kicker text-white/40">
                The Process
              </p>

              <h2 className="rr-editorial mt-5 text-6xl font-medium leading-[0.88] tracking-[-0.04em] sm:text-7xl lg:text-8xl">
                Select.
                <br />
                Prepare.
                <br />
                Press.
                <br />
                Pour.
              </h2>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="mt-16 grid border-t border-white/15 sm:grid-cols-2 lg:grid-cols-5">
                {[
                  "Select",
                  "Wash",
                  "Prepare",
                  "Press / Blend",
                  "Pour",
                ].map((step, index) => (
                  <div
                    key={step}
                    className="border-b border-white/15 py-6 sm:border-r sm:px-5 lg:border-b-0"
                  >
                    <span className="text-[9px] font-bold tracking-[0.15em] text-white/30">
                      0{index + 1}
                    </span>

                    <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em]">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </FadeIn>

            <Button
              href="/process"
              variant="outline-light"
              className="mt-10"
            >
              See the full process
            </Button>
          </div>
        </Container>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-[#f5f1e8]">
          <Container>
            <div className="py-24 sm:py-32">
              <FadeIn>
                <p className="rr-kicker text-black/40">
                  More from the House
                </p>

                <h2 className="rr-editorial mt-4 text-5xl font-medium leading-none tracking-[-0.04em] sm:text-6xl">
                  Keep exploring.
                </h2>
              </FadeIn>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/menu/${item.slug}`}
                    className="border-t border-black/10 py-5"
                  >
                    <p className="rr-editorial text-3xl">
                      {item.name}
                    </p>

                    <p className="mt-3 text-xs uppercase tracking-[0.06em] text-black/40">
                      {item.ingredients
                        .map(
                          (ingredient) =>
                            ingredient.name,
                        )
                        .join(" · ")}
                    </p>

                    <span className="mt-5 block text-sm">
                      KSh {item.price} →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}
    </main>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-5 border-b border-black/10 py-5">
      <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-black/35">
        {label}
      </span>

      <span className="text-sm leading-6 text-black/70">
        {value}
      </span>
    </div>
  );
}