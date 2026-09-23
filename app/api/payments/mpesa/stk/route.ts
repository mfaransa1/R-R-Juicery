import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { initiateMpesaStkPush } from "@/lib/mpesa/server";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {}
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !secret) {
    throw new Error("Missing Supabase server credentials.");
  }

  return createSupabaseAdmin(url, secret, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("254") && digits.length === 12) return digits;
  if (digits.startsWith("0") && digits.length === 10) return `254${digits.slice(1)}`;
  if (digits.startsWith("7") && digits.length === 9) return `254${digits}`;

  throw new Error("Enter a valid Kenyan M-Pesa phone number.");
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in before starting payment." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const orderId = typeof body.orderId === "string" ? body.orderId : "";
    const phone =
      typeof body.phone === "string" ? normalizePhone(body.phone) : "";

    if (!orderId || !phone) {
      return NextResponse.json(
        { error: "Order ID and M-Pesa phone number are required." },
        { status: 400 },
      );
    }

    const admin = getAdminSupabase();

    const { data: order, error: orderError } = await admin
      .from("orders")
      .select("id,order_number,customer_id,total,payment_status,status")
      .eq("id", orderId)
      .eq("customer_id", user.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Order could not be found." },
        { status: 404 },
      );
    }

    if (order.payment_status === "paid") {
      return NextResponse.json(
        { error: "This order is already marked as paid." },
        { status: 409 },
      );
    }

    const { data: transaction, error: transactionError } = await admin
      .from("payment_transactions")
      .insert({
        order_id: order.id,
        provider: "mpesa",
        status: "initiated",
        amount: Number(order.total),
        phone,
      })
      .select("id")
      .single();

    if (transactionError || !transaction) {
      throw transactionError || new Error("Unable to create payment transaction.");
    }

    try {
      const stk = await initiateMpesaStkPush({
        amount: Number(order.total),
        phone,
        accountReference: order.order_number || order.id.slice(0, 12),
        transactionDesc: `R&R order ${order.order_number || order.id.slice(0, 8)}`,
      });

      const { error: updateError } = await admin
        .from("payment_transactions")
        .update({
          status:
            stk.ResponseCode === "0" ? "processing" : "failed",
          merchant_request_id: stk.MerchantRequestID || null,
          checkout_request_id: stk.CheckoutRequestID || null,
          result_code: stk.ResponseCode || null,
          result_description:
            stk.ResponseDescription ||
            stk.CustomerMessage ||
            null,
          raw_response: stk,
          updated_at: new Date().toISOString(),
        })
        .eq("id", transaction.id);

      if (updateError) throw updateError;

      if (stk.ResponseCode !== "0") {
        return NextResponse.json(
          {
            error:
              stk.ResponseDescription ||
              stk.CustomerMessage ||
              "M-Pesa could not start the payment request.",
          },
          { status: 400 },
        );
      }

      return NextResponse.json({
        success: true,
        paymentTransactionId: transaction.id,
        merchantRequestId: stk.MerchantRequestID || null,
        checkoutRequestId: stk.CheckoutRequestID || null,
        customerMessage:
          stk.CustomerMessage ||
          "Check your phone and enter your M-Pesa PIN.",
      });
    } catch (error) {
      await admin
        .from("payment_transactions")
        .update({
          status: "failed",
          result_description:
            error instanceof Error ? error.message : "STK request failed.",
          updated_at: new Date().toISOString(),
        })
        .eq("id", transaction.id);

      throw error;
    }
  } catch (error) {
    console.error("MPESA STK ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to start M-Pesa payment.",
      },
      { status: 500 },
    );
  }
}
