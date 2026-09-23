"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  LogIn,
  MapPin,
  Smartphone,
} from "lucide-react";
import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { createClient } from "@/lib/supabase/client";
import { useRRCart } from "@/components/cart/RRCartProvider";
import { placeOrder } from "@/lib/supabase/checkout";

type FulfillmentType = "pickup" | "delivery";
type PaymentMethod = "mpesa" | "cash";

type PaymentStartResponse = {
  customerMessage?: string;
  error?: string;
};

export default function LiveCheckoutForm() {
  const { items, clearCart } = useRRCart();

  const supabase = createClient();

  const [userEmail, setUserEmail] = useState("");
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

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
  const [paymentStarting, setPaymentStarting] = useState(false);

  const [error, setError] = useState("");

  const [orderNumber, setOrderNumber] = useState("");
  const [placedOrderId, setPlacedOrderId] = useState("");

  const [paymentMessage, setPaymentMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadAccount() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

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

      setCustomerName(
        profile?.full_name ??
          user.user_metadata?.full_name ??
          "",
      );
    }

    void loadAccount();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
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
      },
    );

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function startMpesaPayment(
    orderId: string,
    phone: string,
  ) {
    setPaymentStarting(true);
    setPaymentMessage("");
    setError("");

    try {
      /*
       * This is the live R&R M-Pesa STK endpoint already
       * used by the MpesaPayment component.
       *
       * The browser does NOT mark the order as paid.
       * The server/Daraja callback is responsible for that.
       */
      const response = await fetch(
        "/api/payments/mpesa/stk",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
            phone,
          }),
        },
      );

      const data =
        (await response.json()) as PaymentStartResponse;

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to start the M-Pesa payment.",
        );
      }

      setPaymentMessage(
        data.customerMessage ||
          "M-Pesa payment request sent. Check your phone and enter your PIN.",
      );

      return true;
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to start the M-Pesa payment.",
      );

      return false;
    } finally {
      setPaymentStarting(false);
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setPaymentMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSignedIn(false);
      setError(
        "Please sign in to your R&R account before placing an order.",
      );
      return;
    }

    if (!items.length) {
      setError(
        "Your basket is empty. Add a juice before checking out.",
      );
      return;
    }

    if (!customerName.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!customerPhone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (
      fulfillmentType === "delivery" &&
      !deliveryAddress.trim()
    ) {
      setError("Please enter a delivery address.");
      return;
    }

    setSubmitting(true);

    try {
      /*
       * STEP 1
       *
       * Create the order.
       *
       * For M-Pesa this creates the order in a pending/
       * payment-required state. It does NOT mean the order
       * has been paid.
       *
       * For cash this is the final checkout action.
       */
      const order = await placeOrder({
        customerName: customerName.trim(),
        customerEmail:
          customerEmail.trim() ||
          user.email ||
          undefined,
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

      setOrderNumber(order.order_number);
      setPlacedOrderId(order.id);

      /*
       * CASH
       *
       * Cash orders can be placed without immediate payment.
       */
      if (paymentMethod === "cash") {
        clearCart();
        return;
      }

      /*
       * M-PESA
       *
       * Immediately trigger the STK Push.
       */
      const started = await startMpesaPayment(
        order.id,
        customerPhone.trim(),
      );

      if (started) {
        /*
         * The order exists and the STK request has been
         * accepted by the payment layer.
         *
         * The callback/server verification will determine
         * whether it becomes PAID.
         */
        clearCart();
      }
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "We could not place your order. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (signedIn === null) {
    return (
      <div className="flex min-h-[300px] items-center justify-center border border-black/10 bg-white p-8">
        <Loader2
          size={20}
          className="animate-spin text-black/50"
        />
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div className="border border-black/10 bg-white p-8 sm:p-10">
        <LogIn size={24} strokeWidth={1.3} />

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-black/45">
          R&R PASSPORT REQUIRED
        </p>

        <h2 className="mt-4 max-w-xl font-serif text-4xl leading-[0.95] sm:text-5xl">
          Sign in before you make your move.
        </h2>

        <p className="mt-5 max-w-xl text-sm leading-7 text-black/60">
          Orders are connected to your R&R Passport so you can
          view order history, track orders and keep your account
          activity together.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/auth?mode=signin&next=/checkout"
            className="inline-flex items-center bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] !text-white transition hover:bg-black/80"
          >
            Sign in
          </Link>

          <Link
            href="/auth?mode=signup&next=/checkout"
            className="inline-flex items-center border border-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em]"
          >
            Create account
          </Link>

          <Link
            href="/menu"
            className="inline-flex items-center px-3 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-black/50 hover:text-black"
          >
            Return to menu
          </Link>
        </div>
      </div>
    );
  }

  /*
   * Order created.
   *
   * We deliberately distinguish:
   *
   * CASH → order placed, payment later
   *
   * M-PESA → payment request sent, awaiting customer PIN
   *
   * Neither state is treated as browser-confirmed payment.
   */
  if (orderNumber) {
    const isMpesa = paymentMethod === "mpesa";

    return (
      <div className="border border-black/10 bg-white p-8 sm:p-10">
        <div
          className={`flex h-14 w-14 items-center justify-center ${
            isMpesa
              ? "border border-black"
              : "bg-black !text-white"
          }`}
        >
          {isMpesa ? (
            <Smartphone
              size={23}
              strokeWidth={1.4}
            />
          ) : (
            <CheckCircle2
              size={24}
              strokeWidth={1.4}
            />
          )}
        </div>

        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-black/45">
          {isMpesa
            ? "PAYMENT REQUIRED"
            : "ORDER RECEIVED"}
        </p>

        <h2 className="mt-3 font-serif text-4xl leading-none sm:text-5xl">
          {isMpesa
            ? "Complete your payment."
            : "Your move is in."}
        </h2>

        {isMpesa ? (
          <div className="mt-5 max-w-lg">
            <p className="text-sm leading-7 text-black/60">
              We have created your order and sent an
              M-Pesa payment request to:
            </p>

            <p className="mt-3 text-lg font-semibold">
              {customerPhone}
            </p>

            <div className="mt-5 border border-black/10 bg-[#f5f1e8] p-5">
              <div className="flex items-start gap-3">
                <Smartphone
                  size={19}
                  strokeWidth={1.4}
                />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em]">
                    M-Pesa
                  </p>

                  <p className="mt-2 text-sm leading-6 text-black/60">
                    Check your phone and enter your M-Pesa
                    PIN to complete the payment.
                  </p>
                </div>
              </div>
            </div>

            {paymentMessage && (
              <p className="mt-4 text-sm leading-6 text-black/60">
                {paymentMessage}
              </p>
            )}

            <p className="mt-4 text-xs leading-5 text-black/40">
              Your order will only proceed as a paid order
              after the payment provider confirms the
              transaction.
            </p>
          </div>
        ) : (
          <p className="mt-5 max-w-lg text-sm leading-7 text-black/60">
            We have received your cash order. Payment can be
            completed in person when you collect your order.
          </p>
        )}

        <div className="mt-8 border-y border-black/10 py-5">
          <p className="text-xs uppercase tracking-[0.16em] text-black/45">
            Order number
          </p>

          <p className="mt-2 text-2xl font-semibold">
            {orderNumber}
          </p>
        </div>

        {error && (
          <div className="mt-6 border border-red-700/20 bg-red-50 p-4 text-sm leading-6 text-red-900">
            {error}
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/order?order=${encodeURIComponent(
              orderNumber,
            )}`}
            className="inline-flex items-center gap-2 bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] !text-white"
          >
            Track order
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <Link
            href="/account/orders"
            className="border border-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em]"
          >
            Order history
          </Link>

          <Link
            href="/menu"
            className="border border-black/20 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em]"
          >
            Back to menu
          </Link>
        </div>

        {placedOrderId && (
          <p className="mt-8 text-[10px] uppercase tracking-[0.12em] text-black/25">
            Order secured to your R&R Passport.
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-10"
    >
      <div className="border border-black/10 bg-white px-5 py-4 text-xs uppercase tracking-[0.16em] text-black/50">
        Signed in as{" "}
        <span className="font-semibold text-black">
          {userEmail}
        </span>
      </div>

      {error && (
        <div
          role="alert"
          className="border border-red-700/20 bg-red-50 p-4 text-sm leading-6 text-red-900"
        >
          {error}
        </div>
      )}

      {/* DETAILS */}
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
              onChange={(event) =>
                setCustomerName(event.target.value)
              }
              className="h-14 w-full border border-black/15 bg-white px-4 text-sm outline-none transition focus:border-black"
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
              onChange={(event) =>
                setCustomerPhone(event.target.value)
              }
              placeholder="07XXXXXXXX"
              className="h-14 w-full border border-black/15 bg-white px-4 text-sm outline-none transition focus:border-black"
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
            onChange={(event) =>
              setCustomerEmail(event.target.value)
            }
            className="h-14 w-full border border-black/15 bg-white px-4 text-sm outline-none transition focus:border-black"
          />
        </label>
      </fieldset>

      {/* FULFILLMENT */}
      <fieldset className="space-y-5 border-t border-black/10 pt-8">
        <legend className="font-serif text-3xl">
          How do you want it?
        </legend>

        <div className="grid gap-3 sm:grid-cols-2">
          <label
            className={`cursor-pointer border p-5 transition ${
              fulfillmentType === "pickup"
                ? "border-black bg-black !text-white"
                : "border-black/15 bg-white"
            }`}
          >
            <input
              type="radio"
              name="fulfillment"
              value="pickup"
              checked={fulfillmentType === "pickup"}
              onChange={() =>
                setFulfillmentType("pickup")
              }
              className="sr-only"
            />

            <MapPin
              size={19}
              strokeWidth={1.4}
            />

            <span className="mt-5 block text-sm font-semibold uppercase tracking-[0.14em]">
              Pickup
            </span>

            <span
              className={`mt-2 block text-xs leading-6 ${
                fulfillmentType === "pickup"
                  ? "text-white/55"
                  : "text-black/45"
              }`}
            >
              Pick up from Rook & Reed Plaza, Kilimani.
            </span>
          </label>

          <label
            className={`cursor-pointer border p-5 transition ${
              fulfillmentType === "delivery"
                ? "border-black bg-black !text-white"
                : "border-black/15 bg-white"
            }`}
          >
            <input
              type="radio"
              name="fulfillment"
              value="delivery"
              checked={fulfillmentType === "delivery"}
              onChange={() =>
                setFulfillmentType("delivery")
              }
              className="sr-only"
            />

            <Smartphone
              size={19}
              strokeWidth={1.4}
            />

            <span className="mt-5 block text-sm font-semibold uppercase tracking-[0.14em]">
              Delivery
            </span>

            <span
              className={`mt-2 block text-xs leading-6 ${
                fulfillmentType === "delivery"
                  ? "text-white/55"
                  : "text-black/45"
              }`}
            >
              Have your order delivered within the
              available service area.
            </span>
          </label>
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
                onChange={(event) =>
                  setDeliveryAddress(event.target.value)
                }
                className="w-full resize-none border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
                placeholder="Building, street, area..."
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em]">
                Delivery notes
              </span>

              <textarea
                rows={2}
                value={deliveryNotes}
                onChange={(event) =>
                  setDeliveryNotes(event.target.value)
                }
                placeholder="Gate, landmark, floor, preferred contact..."
                className="w-full resize-none border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </label>
          </div>
        )}
      </fieldset>

      {/* PAYMENT */}
      <fieldset className="space-y-5 border-t border-black/10 pt-8">
        <legend className="font-serif text-3xl">
          Payment
        </legend>

        <div className="grid gap-3 sm:grid-cols-2">
          {/* M-PESA */}
          <label
            className={`cursor-pointer border p-5 transition ${
              paymentMethod === "mpesa"
                ? "border-black bg-black !text-white"
                : "border-black/15 bg-white"
            }`}
          >
            <input
              type="radio"
              name="payment"
              value="mpesa"
              checked={paymentMethod === "mpesa"}
              onChange={() =>
                setPaymentMethod("mpesa")
              }
              className="sr-only"
            />

            <Smartphone
              size={19}
              strokeWidth={1.4}
            />

            <span className="mt-5 block text-sm font-semibold uppercase tracking-[0.14em]">
              M-Pesa
            </span>

            <span
              className={`mt-2 block text-xs leading-6 ${
                paymentMethod === "mpesa"
                  ? "text-white/55"
                  : "text-black/45"
              }`}
            >
              Pay now using an M-Pesa payment request.
            </span>
          </label>

          {/* CASH */}
          <label
            className={`cursor-pointer border p-5 transition ${
              paymentMethod === "cash"
                ? "border-black bg-black !text-white"
                : "border-black/15 bg-white"
            }`}
          >
            <input
              type="radio"
              name="payment"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={() =>
                setPaymentMethod("cash")
              }
              className="sr-only"
            />

            <span className="flex h-5 w-5 items-center justify-center border border-current text-[8px]">
              KSh
            </span>

            <span className="mt-5 block text-sm font-semibold uppercase tracking-[0.14em]">
              Cash
            </span>

            <span
              className={`mt-2 block text-xs leading-6 ${
                paymentMethod === "cash"
                  ? "text-white/55"
                  : "text-black/45"
              }`}
            >
              Place the order now and pay in person later.
            </span>
          </label>
        </div>

        {paymentMethod === "mpesa" && (
          <div className="border border-black/10 bg-[#f5f1e8] p-5">
            <div className="flex gap-3">
              <Smartphone
                size={19}
                strokeWidth={1.4}
                className="shrink-0"
              />

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em]">
                  M-Pesa payment
                </p>

                <p className="mt-2 text-sm leading-6 text-black/55">
                  When you place the order, R&R will send
                  an M-Pesa payment request directly to the
                  phone number above.
                </p>
              </div>
            </div>
          </div>
        )}

        {paymentMethod === "cash" && (
          <div className="border border-black/10 bg-[#f5f1e8] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em]">
              Pay later
            </p>

            <p className="mt-2 text-sm leading-6 text-black/55">
              Your order will be recorded as unpaid and can
              be settled when you collect it.
            </p>
          </div>
        )}
      </fieldset>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={submitting || paymentStarting}
        className="group flex min-h-14 w-full items-center justify-between bg-black px-6 text-xs font-semibold uppercase tracking-[0.2em] !text-white transition hover:bg-[#292929] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span>
          {paymentStarting
            ? "Starting M-Pesa…"
            : submitting
              ? "Creating order…"
              : paymentMethod === "mpesa"
                ? "Continue to M-Pesa"
                : "Place cash order"}
        </span>

        {submitting || paymentStarting ? (
          <Loader2
            size={18}
            className="animate-spin"
          />
        ) : (
          <ArrowRight
            size={18}
            strokeWidth={1.4}
            className="transition-transform group-hover:translate-x-1"
          />
        )}
      </button>
    </form>
  );
}