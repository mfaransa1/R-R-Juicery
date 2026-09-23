"use client";

import Link from "next/link";
import { ArrowUpRight, Crown, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { getMyLoyalty, type LoyaltyAccount } from "@/lib/supabase/loyalty";

export default function AccountLoyaltyCard() {
  const [account, setAccount] = useState<LoyaltyAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyLoyalty()
      .then(({ account }) => setAccount(account))
      .catch(() => setAccount(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="mt-12 h-48 animate-pulse bg-black/5" />;
  }

  return (
    <section className="mt-12 overflow-hidden bg-[#171717] text-white">
      <div className="grid lg:grid-cols-[1fr_auto]">
        <div className="p-7 md:p-10">
          <div className="flex items-center gap-2 text-white/45">
            <Sparkles size={15} />
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em]">
              R&R MOVES
            </p>
          </div>

          <h3 className="mt-5 max-w-2xl font-serif text-4xl tracking-[-0.04em] md:text-5xl">
            Every move counts.
          </h3>

          <p className="mt-4 max-w-xl text-sm leading-7 text-white/55">
            Earn Moves as you order and turn your R&R routine into rewards.
          </p>

          <Link
            href="/account/rewards"
            className="mt-7 inline-flex items-center gap-2 border border-white/20 px-5 py-3 text-sm text-white transition-colors hover:bg-white hover:!text-black"
          >
            View rewards
            <ArrowUpRight size={15} />
          </Link>
        </div>

        <div className="border-t border-white/10 bg-white/[0.03] p-7 lg:min-w-[260px] lg:border-l lg:border-t-0 md:p-10">
          <Crown size={20} className="text-white/35" />
          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
            YOUR BALANCE
          </p>
          <p className="mt-2 font-serif text-6xl tracking-[-0.05em]">
            {account?.balance ?? 0}
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/35">
            Moves
          </p>
        </div>
      </div>
    </section>
  );
}
