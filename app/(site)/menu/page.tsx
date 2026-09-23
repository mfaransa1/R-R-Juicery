import MenuHero from "@/components/juice/MenuHero";
import MenuCategories from "@/components/juice/MenuCategories";
import MenuTransparency from "@/components/juice/MenuTransparency";
import SupabaseMenuProducts from "@/components/menu/SupabaseMenuProducts";

export const metadata = {
  title: "Menu | The Rook & Reed Juicery",
  description:
    "Explore fresh pressed juices, house compositions, sugarcane, interludes, smoothies and seasonal records from Rook & Reed.",
};

export default function MenuPage() {
  return (
    <main className="bg-[var(--rr-paper)]">
      <MenuHero />

      <SupabaseMenuProducts />

      <MenuCategories />

      <MenuTransparency />

      <section className="bg-[var(--rr-brass)]">
        <div className="rr-container py-20 sm:py-28">
          <div className="flex flex-col justify-between gap-10 sm:flex-row sm:items-end">
            <div>
              <span className="rr-kicker">THE HOUSE</span>

              <h2 className="rr-editorial mt-5 max-w-3xl text-5xl leading-[0.88] sm:text-7xl">
                Come in.
                <br />
                Stay awhile.
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-7 text-black/60">
              Juice tastes better when there is good music, good company and
              somewhere worth sitting.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}