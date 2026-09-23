"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Check, ChevronRight, RefreshCw, Sparkles } from "lucide-react";
import {
  getMyLoyalty,
  redeemReward,
  type LoyaltyAccount,
  type LoyaltyReward,
  type LoyaltyTransaction,
} from "@/lib/supabase/loyalty";

function date(value: string) {
  return new Intl.DateTimeFormat("en-KE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function AccountRewardsContent() {
  const [account, setAccount] = useState<LoyaltyAccount | null>(null);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      const data = await getMyLoyalty();
      setAccount(data.account);
      setTransactions(data.transactions);
      setRewards(data.rewards);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load R&R Moves.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function redeem(rewardId: string) {
    try {
      setRedeeming(rewardId);
      setNotice("");
      setError("");
      const result = await redeemReward(rewardId);
      setNotice(`Reward reserved. Your code is ${result.redemption_code}.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to redeem this reward.");
    } finally {
      setRedeeming(null);
    }
  }

  if (loading) {
    return <main className="min-h-screen bg-[#f5f1e8] px-5 pb-20 pt-28 lg:px-10 lg:pt-36"><div className="mx-auto max-w-[1200px]"><div className="h-10 w-48 animate-pulse bg-black/10" /></div></main>;
  }

  return (
    <main className="min-h-screen bg-[#f5f1e8] px-5 pb-20 pt-28 lg:px-10 lg:pt-36">
      <div className="mx-auto max-w-[1200px]">
        <Link href="/account" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] !text-black/40 hover:!text-black">
          <ArrowLeft size={14} /> Passport
        </Link>

        <header className="mt-10 border-b border-black/10 pb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/35">R&R PASSPORT / R&R MOVES</p>
          <h1 className="mt-3 font-serif text-5xl tracking-[-0.045em]">Every move counts.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-black/50">
            Your loyalty balance, rewards and R&R activity.
          </p>
        </header>

        {notice && <div className="mt-8 flex items-center gap-3 border border-green-200 bg-green-50 p-4 text-sm text-green-800"><Check size={17} />{notice}</div>}
        {error && <div className="mt-8 border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}

        <section className="mt-8 grid gap-px border border-black/10 bg-black/10 md:grid-cols-3">
          <div className="bg-[#111111] p-7 text-white md:col-span-2 md:p-10">
            <div className="flex items-center gap-2 text-white/40"><Sparkles size={16} /><span className="text-[10px] font-semibold uppercase tracking-[0.25em]">CURRENT BALANCE</span></div>
            <p className="mt-5 font-serif text-7xl tracking-[-0.06em]">{account?.balance ?? 0}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/35">Moves available</p>
          </div>
          <div className="bg-white p-7 md:p-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">LIFETIME MOVES</p>
            <p className="mt-4 font-serif text-5xl">{account?.lifetime_moves ?? 0}</p>
            <p className="mt-2 text-sm leading-6 text-black/45">Your running R&R record.</p>
          </div>
        </section>

        <section className="mt-14">
          <div className="flex items-end justify-between border-b border-black/10 pb-4">
            <div><p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/35">REWARDS</p><h2 className="mt-2 font-serif text-3xl">Choose your next reward</h2></div>
            <button onClick={async()=>{setRefreshing(true);await load();}} disabled={refreshing} className="inline-flex items-center gap-2 border border-black/10 bg-white px-4 py-2.5 text-xs font-medium !text-black hover:bg-black hover:!text-white disabled:opacity-50"><RefreshCw size={14} className={refreshing?"animate-spin":""}/>Refresh</button>
          </div>

          <div className="mt-2 grid gap-px border border-black/10 bg-black/10 md:grid-cols-3">
            {rewards.map((reward) => {
              const canRedeem = (account?.balance ?? 0) >= reward.move_cost;
              return <article key={reward.id} className="bg-white p-7 md:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">{reward.move_cost} MOVES</p>
                <h3 className="mt-8 font-serif text-3xl tracking-[-0.03em]">{reward.name}</h3>
                <p className="mt-3 min-h-12 text-sm leading-6 text-black/45">{reward.description}</p>
                <button onClick={()=>redeem(reward.id)} disabled={!canRedeem || redeeming===reward.id} className={`mt-8 inline-flex w-full items-center justify-between border px-4 py-3 text-sm ${canRedeem?"border-black bg-black !text-white hover:bg-[#292929] hover:!text-white":"border-black/10 bg-black/[0.03] !text-black/30"}`}>
                  <span>{redeeming===reward.id?"Redeeming…":canRedeem?"Redeem reward":"Keep moving"}</span>
                  <ChevronRight size={15}/>
                </button>
              </article>;
            })}
          </div>
        </section>

        <section className="mt-14">
          <div className="border-b border-black/10 pb-4"><p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/35">MOVE HISTORY</p><h2 className="mt-2 font-serif text-3xl">Your R&R record</h2></div>
          <div className="divide-y divide-black/10 border-b border-black/10">
            {transactions.length ? transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between gap-5 py-5">
                <div><p className="font-medium capitalize">{tx.type} · {tx.source}</p><p className="mt-1 text-xs text-black/40">{date(tx.created_at)}{tx.note ? ` · ${tx.note}` : ""}</p></div>
                <span className={`font-serif text-2xl ${tx.moves >= 0 ? "text-[#111111]" : "text-black/45"}`}>{tx.moves > 0 ? "+" : ""}{tx.moves}</span>
              </div>
            )) : <p className="py-10 text-sm text-black/45">Your Moves history will appear here after your first eligible activity.</p>}
          </div>
        </section>
      </div>
    </main>
  );
}
