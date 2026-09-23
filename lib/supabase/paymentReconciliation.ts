import { createClient } from "@/lib/supabase/client";

export type PaymentReconciliationStatus =
  | "initiated"
  | "processing"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded"
  | "reconciled";

export type PaymentReconciliationRow = {
  id: string;
  order_id: string;
  provider: string;
  status: PaymentReconciliationStatus;
  amount: number;
  phone: string | null;
  merchant_request_id: string | null;
  checkout_request_id: string | null;
  mpesa_receipt_number: string | null;
  transaction_date: string | null;
  result_code: number | null;
  result_description: string | null;
  created_at: string;
  updated_at: string;
  order: {
    id: string;
    order_number: string | null;
    total: number;
    payment_status: string;
    status: string;
    created_at: string;
  } | null;
};

export type PaymentReconciliationSummary = {
  total: number;
  paid: number;
  processing: number;
  failed: number;
  unmatched: number;
  expectedPaidValue: number;
  recordedPaidValue: number;
};

export async function getPaymentReconciliation() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("payment_transactions")
    .select(`
      id,
      order_id,
      provider,
      status,
      amount,
      phone,
      merchant_request_id,
      checkout_request_id,
      mpesa_receipt_number,
      transaction_date,
      result_code,
      result_description,
      created_at,
      updated_at,
      order:orders(
        id,
        order_number,
        total,
        payment_status,
        status,
        created_at
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const payments = (data ?? []) as unknown as PaymentReconciliationRow[];

  let paid = 0;
  let processing = 0;
  let failed = 0;
  let unmatched = 0;
  let expectedPaidValue = 0;
  let recordedPaidValue = 0;

  for (const payment of payments) {
    if (payment.status === "paid" || payment.status === "reconciled") {
      paid += 1;
      recordedPaidValue += Number(payment.amount || 0);

      if (payment.order) {
        expectedPaidValue += Number(payment.order.total || 0);

        if (Number(payment.amount || 0) !== Number(payment.order.total || 0)) {
          unmatched += 1;
        }
      } else {
        unmatched += 1;
      }
    }

    if (payment.status === "processing") processing += 1;
    if (payment.status === "failed") failed += 1;
  }

  return {
    payments,
    summary: {
      total: payments.length,
      paid,
      processing,
      failed,
      unmatched,
      expectedPaidValue,
      recordedPaidValue,
    } satisfies PaymentReconciliationSummary,
  };
}

export async function markPaymentReconciled(paymentId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("payment_transactions")
    .update({
      status: "reconciled",
      updated_at: new Date().toISOString(),
    })
    .eq("id", paymentId)
    .eq("status", "paid")
    .select()
    .single();

  if (error) throw error;

  return data;
}
