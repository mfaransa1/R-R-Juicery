import CheckoutHero from "@/components/checkout/CheckoutHero";
import LiveCheckoutForm from "@/components/checkout/LiveCheckoutForm";
import LiveCheckoutSummary from "@/components/checkout/LiveCheckoutSummary";
import CheckoutTrust from "@/components/checkout/CheckoutTrust";
import CheckoutClosing from "@/components/checkout/CheckoutClosing";

export const metadata = {
  title: "Checkout | The Rook & Reed Juicery",
  description:
    "Complete your R&R juice order for pickup or delivery.",
};

export default function CheckoutPage() {
  return (
    <main className="bg-[var(--rr-paper)]">
      <CheckoutHero />

      <section className="bg-[var(--rr-paper)] py-16 text-[#111] sm:py-20 lg:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 lg:px-10">
          <LiveCheckoutForm />
          <LiveCheckoutSummary />
        </div>
      </section>

      <CheckoutTrust />

      <CheckoutClosing />
    </main>
  );
}