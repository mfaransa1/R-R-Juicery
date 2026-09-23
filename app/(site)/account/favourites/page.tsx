import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AccountFavouritesPageContent from "@/components/account/AccountFavouritesPageContent";

export const metadata = {
  title: "Saved Moves | R&R Passport",
  description: "Your saved juices at The Rook & Reed Juicery.",
};

export default function AccountFavouritesPage() {
  return (
    <main className="min-h-screen bg-[#111] text-white">
      <section className="mx-auto max-w-[1280px] px-5 pb-16 pt-28 sm:px-8 lg:px-14 lg:pb-24 lg:pt-36">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/55 transition-colors hover:text-white"
        >
          <ArrowLeft size={15} strokeWidth={1.5} />
          Back to passport
        </Link>

        <div className="mt-10 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/35">
            R&R PASSPORT
          </p>
          <h1 className="mt-5 font-serif text-6xl leading-[0.86] tracking-[-0.055em] sm:text-8xl">
            Saved moves.
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/55 sm:text-lg">
            Keep the juices you want to return to close at hand.
          </p>
        </div>
      </section>

      <AccountFavouritesPageContent />
    </main>
  );
}
