import { createClient } from "@/lib/supabase/client";

export type PaymentTransaction = {
  id: string;
  order_id: string;
  provider: string;
  status: string;
  amount: number;
  phone: string | null;
  merchant_request_id: string | null;
  checkout_request_id: string | null;
  mpesa_receipt_number: string | null;
  transaction_date: string | null;
  result_code: string | null;
  result_description: string | null;
  raw_response: unknown;
  created_at: string;
  updated_at: string;
};

export async function getMyPaymentTransactions(orderId?: string) {
  const supabase = createClient();

  let query = supabase
    .from("payment_transactions")
    .select("*")
    .order("created_at", { ascending: false });

  if (orderId) query = query.eq("order_id", orderId);

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []) as PaymentTransaction[];
}
