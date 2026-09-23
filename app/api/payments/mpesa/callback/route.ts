import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";

type CallbackItem = { Name: string; Value?: string | number };
type CallbackPayload = {
  Body?: {
    stkCallback?: {
      MerchantRequestID?: string;
      CheckoutRequestID?: string;
      ResultCode?: number;
      ResultDesc?: string;
      CallbackMetadata?: { Item?: CallbackItem[] };
    };
  };
};

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !secret) throw new Error("Missing Supabase server credentials.");

  return createSupabaseAdmin(url, secret, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function metadataValue(items: CallbackItem[] | undefined, name: string) {
  return items?.find((item) => item.Name === name)?.Value ?? null;
}

function parseMpesaDate(value: string) {
  if (!/^\d{14}$/.test(value)) return null;

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6)) - 1;
  const day = Number(value.slice(6, 8));
  const hour = Number(value.slice(8, 10));
  const minute = Number(value.slice(10, 12));
  const second = Number(value.slice(12, 14));

  return new Date(Date.UTC(year, month, day, hour - 3, minute, second)).toISOString();
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as CallbackPayload;
    const callback = payload.Body?.stkCallback;

    if (!callback?.CheckoutRequestID) {
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    const admin = getAdminSupabase();
    const items = callback.CallbackMetadata?.Item;
    const resultCode = Number(callback.ResultCode ?? -1);
    const successful = resultCode === 0;

    const receipt = metadataValue(items, "MpesaReceiptNumber");
    const amount = metadataValue(items, "Amount");
    const phone = metadataValue(items, "PhoneNumber");
    const transactionDate = metadataValue(items, "TransactionDate");

    const { data: payment, error: paymentError } = await admin
      .from("payment_transactions")
      .select("id,order_id,status,amount,phone")
      .eq("checkout_request_id", callback.CheckoutRequestID)
      .maybeSingle();

    if (paymentError) throw paymentError;

    if (!payment) {
      console.warn(
        "M-Pesa callback received for unknown CheckoutRequestID:",
        callback.CheckoutRequestID,
      );
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    if (payment.status === "paid" || payment.status === "reconciled") {
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Already processed" });
    }

    if (successful && amount !== null && Number(amount) !== Number(payment.amount)) {
      await admin
        .from("payment_transactions")
        .update({
          status: "failed",
          result_code: String(resultCode),
          result_description: "Paid amount does not match the stored order amount.",
          raw_response: payload,
          updated_at: new Date().toISOString(),
        })
        .eq("id", payment.id);

      console.error("M-Pesa amount mismatch", {
        paymentId: payment.id,
        expected: payment.amount,
        received: amount,
      });

      return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    const { error: updatePaymentError } = await admin
      .from("payment_transactions")
      .update({
        status: successful ? "paid" : "failed",
        phone: typeof phone === "number" || typeof phone === "string" ? String(phone) : payment.phone,
        mpesa_receipt_number: typeof receipt === "string" ? receipt : null,
        transaction_date: transactionDate ? parseMpesaDate(String(transactionDate)) : null,
        result_code: String(resultCode),
        result_description: callback.ResultDesc || null,
        raw_response: payload,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment.id);

    if (updatePaymentError) throw updatePaymentError;

    if (successful) {
      const { error: orderError } = await admin
        .from("orders")
        .update({
          payment_status: "paid",
          status: "confirmed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", payment.order_id)
        .neq("payment_status", "paid");

      if (orderError) throw orderError;
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (error) {
    console.error("MPESA CALLBACK ERROR:", error);

    // Always acknowledge Safaricom. Any unresolved record remains available
    // for reconciliation/manual investigation.
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
}
