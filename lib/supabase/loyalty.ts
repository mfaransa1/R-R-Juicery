import { createClient } from "@/lib/supabase/client";

export type LoyaltyAccount = {
  profile_id: string;
  balance: number;
  lifetime_moves: number;
  updated_at: string;
};

export type LoyaltyTransaction = {
  id: string;
  moves: number;
  type: "earned" | "redeemed" | "adjusted" | "expired";
  source: string;
  source_id: string | null;
  note: string | null;
  created_at: string;
};

export type LoyaltyReward = {
  id: string;
  name: string;
  description: string | null;
  move_cost: number;
  reward_type: "product" | "discount" | "experience";
  product_id: string | null;
  discount_amount: number | null;
  active: boolean;
  sort_order: number;
};

export async function getMyLoyalty() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("You must be signed in.");

  const [{ data: account, error: accountError }, { data: transactions, error: transactionError }, { data: rewards, error: rewardsError }] =
    await Promise.all([
      supabase.from("loyalty_accounts").select("*").eq("profile_id", user.id).maybeSingle(),
      supabase.from("loyalty_transactions").select("*").eq("profile_id", user.id).order("created_at", { ascending: false }).limit(10),
      supabase.from("loyalty_rewards").select("*").eq("active", true).order("sort_order", { ascending: true }),
    ]);

  if (accountError) throw accountError;
  if (transactionError) throw transactionError;
  if (rewardsError) throw rewardsError;

  return {
    account: account as LoyaltyAccount | null,
    transactions: (transactions ?? []) as LoyaltyTransaction[],
    rewards: (rewards ?? []) as LoyaltyReward[],
  };
}

export async function redeemReward(rewardId: string) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("redeem_loyalty_reward", {
    p_reward_id: rewardId,
  });

  if (error) throw error;
  return data;
}
