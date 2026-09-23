"use client";

import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";

import { useRRCart } from "@/components/cart/RRCartProvider";
import { placeOrder } from "@/lib/supabase/checkout";

type FulfillmentType = "pickup" | "delivery";
type PaymentMethod = "mpesa" | "card" | "cash";

export default function LiveCheckoutForm() {
  const {
    items,
    clearCart,
  } = useRRCart();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [fulfillmentType, setFulfillmentType] =
    useState<FulfillmentType>("pickup");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("mpesa");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!items.length) {
      setError(
        "Your basket is empty. Add a juice before checking out."
      );
      return;
    }

    if (fulfillmentType === "delivery" && !deliveryAddress.trim()) {
      setError("Please enter a delivery address.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const order = await placeOrder({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim() || undefined,
        customerPhone: customerPhone.trim(),
        fulfillmentType,
        deliveryAddress:
          fulfillmentType === "delivery"
            ? deliveryAddress.trim()
            : undefined,
        deliveryNotes:
          fulfillmentType === "delivery"
            ? deliveryNotes.trim() || undefined
            : undefined,
        paymentMethod,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
        })),
      });

      clearCart();
      setOrderNumber(order.order_number);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "We could not place your order. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (orderNumber) {
    return (
      <div className="border border-black/10 bg-white p-8 sm:p-10">
        <CheckCircle2 className="h-8 w-8" />

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-black/45">
          Order confirmed
        </p>

        <h2 className="mt-3 font-serif text-4xl">
          Your move is in.
        </h2>

        <p className="mt-4 text-sm leading-7 text-black/60">
          We have received your order and will move it through preparation.
        </p>

        <div className="mt-8 border-y border-black/10 py-5">
          <p className="text-xs uppercase tracking-[0.16em] text-black/45">
            Order number
          </p>

          <p className="mt-2 text-2xl font-semibold">
            {orderNumber}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/order?number=${encodeURIComponent(orderNumber)}`}
            className="bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white"
          >
            Track order
          </Link>

          <Link
            href="/menu"
            className="border border-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em]"
          >
            Back to menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="border border-red-700/30 bg-red-50 p-4 text-sm leading-6 text-red-900">
          {error}
        </div>
      )}

      <fieldset className="space-y-5">
        <legend className="font-serif text-3xl">
          Your details
        </legend>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em]">
              Name *
            </span>

            <input
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border border-black/15 bg-white px-4 py-3 outline-none focus:border-black"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em]">
              Phone *
            </span>

            <input
              required
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full border border-black/15 bg-white px-4 py-3 outline-none focus:border-black"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em]">
            Email
          </span>

          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="w-full border border-black/15 bg-white px-4 py-3 outline-none focus:border-black"
          />
        </label>
      </fieldset>

      <fieldset className="space-y-5 border-t border-black/10 pt-8">
        <legend className="font-serif text-3xl">
          How do you want it?
        </legend>

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["pickup", "Pickup"],
            ["delivery", "Delivery"],
          ].map(([value, label]) => (
            <label
              key={value}
              className={`cursor-pointer border p-5 transition ${
                fulfillmentType === value
                  ? "border-black bg-black text-white"
                  : "border-black/15 bg-white"
              }`}
            >
              <input
                type="radio"
                name="fulfillment"
                value={value}
                checked={fulfillmentType === value}
                onChange={() =>
                  setFulfillmentType(value as FulfillmentType)
                }
                className="sr-only"
              />

              <span className="text-sm font-semibold uppercase tracking-[0.14em]">
                {label}
              </span>
            </label>
          ))}
        </div>

        {fulfillmentType === "delivery" && (
          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em]">
                Delivery address *
              </span>

              <textarea
                required
                rows={3}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full resize-none border border-black/15 bg-white px-4 py-3 outline-none focus:border-black"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em]">
                Delivery notes
              </span>

              <textarea
                rows={2}
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="Gate, landmark, floor, preferred contact..."
                className="w-full resize-none border border-black/15 bg-white px-4 py-3 outline-none focus:border-black"
              />
            </label>
          </div>
        )}
      </fieldset>

      <fieldset className="space-y-5 border-t border-black/10 pt-8">
        <legend className="font-serif text-3xl">
          Payment
        </legend>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["mpesa", "M-Pesa"],
            ["card", "Card / PDQ"],
            ["cash", "Cash"],
          ].map(([value, label]) => (
            <label
              key={value}
              className={`cursor-pointer border p-5 transition ${
                paymentMethod === value
                  ? "border-black bg-black text-white"
                  : "border-black/15 bg-white"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={value}
                checked={paymentMethod === value}
                onChange={() =>
                  setPaymentMethod(value as PaymentMethod)
                }
                className="sr-only"
              />

              <span className="text-sm font-semibold uppercase tracking-[0.12em]">
                {label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={submitting || !items.length}
        className="flex w-full items-center justify-center gap-3 bg-black px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        {submitting && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}

        {submitting ? "Placing order..." : "Place order"}
      </button>
    </form>
  );
}
