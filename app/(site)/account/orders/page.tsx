import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AccountOrderHistory from "@/components/account/AccountOrderHistory";

export const metadata = {
  title: "Order History | R&R Passport",
  description: "View your Rook & Reed Juicery order history.",
};

export default function AccountOrdersPage() {
  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#111]">
      <section className="mx-auto max-w-[1280px] px-5 pb-16 pt-28 sm:px-8 lg:px-14 lg:pb-24 lg:pt-36">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-black/55 transition-colors hover:text-black"
        >
          <ArrowLeft size={15} strokeWidth={1.5} />
          Back to passport
        </Link>

        <div className="mt-10 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/35">
            R&R PASSPORT
          </p>
          <h1 className="mt-5 font-serif text-6xl leading-[0.86] tracking-[-0.055em] sm:text-8xl">
            Your orders.
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-black/55 sm:text-lg">
            View your orders, check their status, revisit what you ordered,
            and open live tracking whenever you need it.
          </p>
        </div>
      </section>

      <AccountOrderHistory />
    </main>
  );
}
