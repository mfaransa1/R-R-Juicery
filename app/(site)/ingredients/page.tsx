import Container from "@/components/ui/Container";
import FadeIn from "@/components/motion/FadeIn";
import IngredientExplorer from "@/components/juice/IngredientExplorer";
import { ingredients } from "@/data/ingredients";

export default function IngredientsPage() {
  return (
    <main className="bg-[#f5f1e8] text-[#111111]">
      {/* Hero */}
      <section className="border-b border-black/10 pt-32 sm:pt-40">
        <Container>
          <div className="pb-20 sm:pb-28 lg:pb-32">
            <FadeIn>
              <p className="rr-kicker text-black/40">
                Know Your Juice
              </p>
            </FadeIn>

            <FadeIn delay={0.08}>
              <h1 className="rr-editorial mt-6 max-w-6xl text-[clamp(5rem,12vw,10rem)] font-medium leading-[0.82] tracking-[-0.055em]">
                Start with
                <br />
                the ingredient.
              </h1>
            </FadeIn>

            <FadeIn delay={0.16}>
              <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.55fr]">
                <p className="max-w-2xl text-base leading-8 text-black/60 sm:text-lg">
                  What's in your glass starts long before
                  the juice reaches it. Explore the ingredients
                  behind the R&R menu.
                </p>

                <div className="border-t border-black/10 pt-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-black/35">
                    Transparency
                  </p>

                  <p className="mt-3 text-sm leading-6 text-black/55">
                    Explore ingredient origin, organic
                    status, seasonality, preparation and
                    storage.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* Explorer */}
      <section className="bg-white">
        <Container>
          <div className="py-20 sm:py-28 lg:py-36">
            <FadeIn>
              <div className="mb-12">
                <p className="rr-kicker text-black/35">
                  Ingredient Explorer
                </p>

                <h2 className="rr-editorial mt-3 text-5xl font-medium leading-none tracking-[-0.04em] sm:text-6xl">
                  Know what's
                  <br />
                  in the glass.
                </h2>
              </div>
            </FadeIn>

            <IngredientExplorer
              ingredients={ingredients}
            />
          </div>
        </Container>
      </section>

      {/* Transparency promise */}
      <section className="bg-[#111111] text-white">
        <Container>
          <div className="grid gap-12 py-24 sm:py-32 lg:grid-cols-[0.7fr_1.3fr] lg:py-40">
            <FadeIn>
              <div>
                <p className="rr-kicker text-white/35">
                  The R&R promise
                </p>

                <h2 className="rr-editorial mt-5 text-5xl font-medium leading-[0.88] tracking-[-0.04em] sm:text-6xl">
                  We don't just
                  <br />
                  tell you.
                  <br />
                  We show you.
                </h2>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div>
                <p className="max-w-2xl text-base leading-8 text-white/55 sm:text-lg">
                  Ingredient information will become
                  increasingly connected to R&R sourcing,
                  production and batch data as the operational
                  system develops.
                </p>

                <div className="mt-10 grid gap-px bg-white/10 sm:grid-cols-2">
                  {[
                    "Origin",
                    "Organic status",
                    "Seasonality",
                    "Preparation",
                    "Storage",
                    "Products",
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