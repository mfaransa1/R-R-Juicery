"use client";

import { useState } from "react";
import { Loader2, Smartphone } from "lucide-react";

export default function MpesaPayment({
  orderId,
  total,
  phone,
  onStarted,
}: {
  orderId: string;
  total: number;
  phone: string;
  onStarted?: (message: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function startPayment() {
    setBusy(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/payments/mpesa/stk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to start M-Pesa payment.");
      }

      const nextMessage =
        data.customerMessage ||
        "Check your phone and enter your M-Pesa PIN.";

      setMessage(nextMessage);
      onStarted?.(nextMessage);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to start M-Pesa payment.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border border-black/10 bg-[#f5f1e8] p-5">
      <div className="flex items-start gap-3">
        <Smartphone size={19} strokeWidth={1.4} />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em]">
            M-Pesa
          </p>
          <p className="mt-1 text-sm text-black/55">
            KSh {total.toLocaleString("en-KE")} · {phone}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => void startPayment()}
        disabled={busy}
        className="mt-5 flex w-full items-center justify-center gap-2 border border-black bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] !text-white hover:bg-white hover:!text-black disabled:opacity-50"
      >
        {busy ? <Loader2 size={15} className="animate-spin" /> : null}
        {busy ? "Starting..." : "Pay with M-Pesa"}
      </button>

      {message && (
        <p className="mt-4 text-sm leading-6 text-black/65">{message}</p>
      )}

      {error && (
        <p className="mt-4 border border-red-900/15 bg-red-50 p-3 text-sm text-red-900">
          {error}
        </p>
      )}
    </div>
  );
}
