/* Replace components/checkout/LiveCheckoutForm.tsx with this version.
   Only the order-confirmation tracking link is changed here. */
"use client";

import Link from "next/link";
import { CheckCircle2, Loader2, LogIn } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRRCart } from "@/components/cart/RRCartProvider";
import { placeOrder } from "@/lib/supabase/checkout";

type FulfillmentType = "pickup" | "delivery";
type PaymentMethod = "mpesa" | "card" | "cash";

export default function LiveCheckoutForm() {
  const { items, clearCart } = useRRCart();
  const supabase = createClient();
  const [userEmail, setUserEmail] = useState("");
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>("pickup");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [placedOrderId, setPlacedOrderId] = useState("");

  useEffect(() => {
    let active = true;

    async function loadAccount() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!active) return;

      if (!user) {
        setSignedIn(false);
        return;
      }

      setSignedIn(true);
      setUserEmail(user.email ?? "");
      setCustomerEmail(user.email ?? "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (!active) return;
      setCustomerName(profile?.full_name ?? user.user_metadata?.full_name ?? "");
    }

    void loadAccount();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const user = session?.user;

        if (!user) {
          setSignedIn(false);
          setUserEmail("");
          return;
        }

        setSignedIn(true);
        setUserEmail(user.email ?? "");
        setCustomerEmail(user.email ?? "");
      }
    );

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setSignedIn(false);
      setError("Please sign in to your R&R account before placing an order.");
      return;
    }

    if (!items.length) {
      setError("Your basket is empty. Add a juice before checking out.");
      return;
    }

    if (fulfillmentType === "delivery" && !deliveryAddress.trim()) {
      setError("Please enter a delivery address.");
      return;
    }

    setSubmitting(true);

    try {
      const order = await placeOrder({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim() || user.email || undefined,
        customerPhone: customerPhone.trim(),
        fulfillmentType,
        deliveryAddress: fulfillmentType === "delivery" ? deliveryAddress.trim() : undefined,
        deliveryNotes: fulfillmentType === "delivery" ? deliveryNotes.trim() || undefined : undefined,
        paymentMethod,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
        })),
      });

      clearCart();
      setOrderNumber(order.order_number);
      setPlacedOrderId(order.id);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "We could not place your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (signedIn === null) {
    return (
      <div className="flex min-h-[280px] items-center justify-center border border-black/10 bg-white p-8">
        <Loader2 size={20} className="animate-spin" />
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div className="border border-black/10 bg-white p-8 sm:p-10">
        <LogIn size={24} strokeWidth={1.3} />
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-black/45">R&R PASSPORT REQUIRED</p>
        <h2 className="mt-4 max-w-xl font-serif text-4xl leading-[0.95] sm:text-5xl">Sign in before you make your move.</h2>
        <p className="mt-5 max-w-xl text-sm leading-7 text-black/60">
          Orders are connected to your R&R Passport so you can view your order history, track orders and keep your account activity together.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/auth?mode=signin&next=/checkout" className="inline-flex items-center bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-black/80">Sign in</Link>
          <Link href="/auth?mode=signup&next=/checkout" className="inline-flex items-center border border-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em]">Create account</Link>
          <Link href="/menu" className="inline-flex items-center px-3 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-black/50 hover:text-black">Return to menu</Link>
        </div>
      </div>
    );
  }

  if (orderNumber) {
    return (
      <div className="border border-black/10 bg-white p-8 sm:p-10">
        <CheckCircle2 size={30} strokeWidth={1.3} />
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-black/45">Order confirmed</p>
        <h2 className="mt-3 font-serif text-4xl">Your move is in.</h2>
        <p className="mt-4 text-sm leading-7 text-black/60">We have received your order and will move it through preparation.</p>

        <div className="mt-8 border-y border-black/10 py-5">
          <p className="text-xs uppercase tracking-[0.16em] text-black/45">Order number</p>
          <p className="mt-2 text-2xl font-semibold">{orderNumber}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/order?order=${encodeURIComponent(orderNumber)}`}
            className="bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white"
          >
            Track order
          </Link>
          <Link href="/account#order-history" className="border border-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em]">View order history</Link>
          <Link href="/menu" className="border border-black/20 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em]">Back to menu</Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="border border-black/10 bg-white px-5 py-4 text-xs uppercase tracking-[0.16em] text-black/50">
        Signed in as <span className="font-semibold text-black">{userEmail}</span>
      </div>

      {error && <div className="border border-red-700/30 bg-red-50 p-4 text-sm leading-6 text-red-900">{error}</div>}

      <fieldset className="space-y-5">
        <legend className="font-serif text-3xl">Your details</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em]">Name *</span>
            <input required value={customerName} onChange={(event) => setCustomerName(event.target.value)} className="w-full border border-black/15 bg-white px-4 py-3 outline-none focus:border-black" />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em]">Phone *</span>
            <input required type="tel" value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} className="w-full border border-black/15 bg-white px-4 py-3 outline-none focus:border-black" />
          </label>
        </div>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em]">Email</span>
          <input type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} className="w-full border border-black/15 bg-white px-4 py-3 outline-none focus:border-black" />
        </label>
      </fieldset>

      <fieldset className="space-y-5 border-t border-black/10 pt-8">
        <legend className="font-serif text-3xl">How do you want it?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["pickup", "Pickup"],
            ["delivery", "Delivery"],
          ].map(([value, label]) => (
            <label key={value} className={`cursor-pointer border p-5 transition ${fulfillmentType === value ? "border-black bg-black text-white" : "border-black/15 bg-white"}`}>
              <input type="radio" name="fulfillment" value={value} checked={fulfillmentType === value} onChange={() => setFulfillmentType(value as FulfillmentType)} className="sr-only" />
              <span className="text-sm font-semibold uppercase tracking-[0.14em]">{label}</span>
            </label>
          ))}
        </div>

        {fulfillmentType === "delivery" && (
          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em]">Delivery address *</span>
              <textarea required rows={3} value={deliveryAddress} onChange={(event) => setDeliveryAddress(event.target.value)} className="w-full resize-none border border-black/15 bg-white px-4 py-3 outline-none focus:border-black" />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em]">Delivery notes</span>
              <textarea rows={2} value={deliveryNotes} onChange={(event) => setDeliveryNotes(event.target.value)} placeholder="Gate, landmark, floor, preferred contact..." className="w-full resize-none border border-black/15 bg-white px-4 py-3 outline-none focus:border-black" />
            </label>
          </div>
        )}
      </fieldset>

      <fieldset className="space-y-5 border-t border-black/10 pt-8">
        <legend className="font-serif text-3xl">Payment</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["mpesa", "M-Pesa"],
            ["card", "Card / PDQ"],
            ["cash", "Cash"],
          ].map(([value, label]) => (
            <label key={value} className={`cursor-pointer border p-5 transition ${paymentMethod === value ? "border-black bg-black text-white" : "border-black/15 bg-white"}`}>
              <input type="radio" name="payment" value={value} checked={paymentMethod === value} onChange={() => setPaymentMethod(value as PaymentMethod)} className="sr-only" />
              <span className="text-sm font-semibold uppercase tracking-[0.14em]">{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <button type="submit" disabled={submitting} className="inline-flex min-h-14 w-full items-center justify-center gap-3 bg-black px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50">
        {submitting && <Loader2 size={16} className="animate-spin" />}
        {submitting ? "Placing order…" : "Place order"}
      </button>
    </form>
  );
}
