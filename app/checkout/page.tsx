import CheckoutHero from "@/components/checkout/CheckoutHero";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import CheckoutTrust from "@/components/checkout/CheckoutTrust";
import CheckoutClosing from "@/components/checkout/CheckoutClosing";

export const metadata = {
  title: "Checkout | The Rook & Reed Juicery",
  description:
    "Complete your R&R juice order for pickup or delivery.",
};

export default function CheckoutPage() {
  return (
    <main>
      <CheckoutHero />

      <section className="bg-[#f5f1e8] py-20 text-[#111] lg:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-5 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-14">
          <CheckoutForm />
          <CheckoutSummary />
        </div>
      </section>

      <CheckoutTrust />
      <CheckoutClosing />
    </main>
  );
}