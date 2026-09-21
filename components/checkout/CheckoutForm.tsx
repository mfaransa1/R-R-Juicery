"use client";

import { useState } from "react";
import {
  ArrowRight,
  Check,
  CreditCard,
  MapPin,
  Smartphone,
} from "lucide-react";

type Fulfilment = "pickup" | "delivery";
type Payment = "cash" | "mpesa" | "card";

export default function CheckoutForm() {
  const [fulfilment, setFulfilment] =
    useState<Fulfilment>("pickup");

  const [payment, setPayment] =
    useState<Payment>("mpesa");

  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="border border-black/10 bg-white p-8 text-center sm:p-14">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-black text-white">
          <Check size={22} strokeWidth={1.5} />
        </div>

        <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">
          ORDER RECEIVED / FRONT-END DEMO
        </p>

        <h2 className="mt-5 font-serif text-5xl leading-none tracking-[-0.045em]">
          Your move is in.
        </h2>

        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-black/50">
          The checkout interface is ready. Connect the order
          API and payment provider to make this flow live.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      <section>
        <div className="mb-7 flex items-end justify-between border-b border-black/15 pb-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">
              01
            </p>

            <h2 className="mt-2 font-serif text-4xl tracking-[-0.035em]">
              Your details
            </h2>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <label>
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">
              Full name
            </span>

            <input
              required
              type="text"
              name="name"
              className="h-14 w-full border-b border-black/20 bg-transparent outline-none transition focus:border-black"
            />
          </label>

          <label>
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">
              Phone
            </span>

            <input
              required
              type="tel"
              name="phone"
              className="h-14 w-full border-b border-black/20 bg-transparent outline-none transition focus:border-black"
            />
          </label>

          <label className="sm:col-span-2">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">
              Email
            </span>

            <input
              required
              type="email"
              name="email"
              className="h-14 w-full border-b border-black/20 bg-transparent outline-none transition focus:border-black"
            />
          </label>
        </div>
      </section>

      <section>
        <div className="mb-7 border-b border-black/15 pb-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">
            02
          </p>

          <h2 className="mt-2 font-serif text-4xl tracking-[-0.035em]">
            How do you want it?
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setFulfilment("pickup")}
            className={`border p-5 text-left transition ${
              fulfilment === "pickup"
                ? "border-black bg-black text-white"
                : "border-black/15 bg-white"
            }`}
          >
            <MapPin size={19} strokeWidth={1.4} />

            <p className="mt-6 text-sm font-semibold">
              Pickup
            </p>

            <p
              className={`mt-2 text-xs leading-relaxed ${
                fulfilment === "pickup"
                  ? "text-white/55"
                  : "text-black/45"
              }`}
            >
              Pick up from Rook & Reed Plaza, Kilimani.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setFulfilment("delivery")}
            className={`border p-5 text-left transition ${
              fulfilment === "delivery"
                ? "border-black bg-black text-white"
                : "border-black/15 bg-white"
            }`}
          >
            <Smartphone size={19} strokeWidth={1.4} />

            <p className="mt-6 text-sm font-semibold">
              Delivery
            </p>

            <p
              className={`mt-2 text-xs leading-relaxed ${
                fulfilment === "delivery"
                  ? "text-white/55"
                  : "text-black/45"
              }`}
            >
              Have your order delivered within the available
              service area.
            </p>
          </button>
        </div>

        {fulfilment === "delivery" && (
          <div className="mt-6">
            <label>
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">
                Delivery address
              </span>

              <textarea
                required
                name="address"
                rows={3}
                className="w-full resize-none border border-black/15 bg-white p-4 text-sm outline-none transition focus:border-black"
                placeholder="Building, street, area..."
              />
            </label>
          </div>
        )}
      </section>

      <section>
        <div className="mb-7 border-b border-black/15 pb-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">
            03
          </p>

          <h2 className="mt-2 font-serif text-4xl tracking-[-0.035em]">
            Payment
          </h2>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setPayment("mpesa")}
            className={`flex w-full items-center gap-4 border p-5 text-left transition ${
              payment === "mpesa"
                ? "border-black bg-black text-white"
                : "border-black/15 bg-white"
            }`}
          >
            <Smartphone size={19} strokeWidth={1.4} />

            <div>
              <p className="text-sm font-semibold">M-PESA</p>

              <p
                className={`mt-1 text-xs ${
                  payment === "mpesa"
                    ? "text-white/50"
                    : "text-black/40"
                }`}
              >
                Mobile payment
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPayment("card")}
            className={`flex w-full items-center gap-4 border p-5 text-left transition ${
              payment === "card"
                ? "border-black bg-black text-white"
                : "border-black/15 bg-white"
            }`}
          >
            <CreditCard size={19} strokeWidth={1.4} />

            <div>
              <p className="text-sm font-semibold">
                CARD / PDQ
              </p>

              <p
                className={`mt-1 text-xs ${
                  payment === "card"
                    ? "text-white/50"
                    : "text-black/40"
                }`}
              >
                Card payment
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPayment("cash")}
            className={`flex w-full items-center gap-4 border p-5 text-left transition ${
              payment === "cash"
                ? "border-black bg-black text-white"
                : "border-black/15 bg-white"
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center border border-current text-[8px]">
              KSh
            </span>

            <div>
              <p className="text-sm font-semibold">CASH</p>

              <p
                className={`mt-1 text-xs ${
                  payment === "cash"
                    ? "text-white/50"
                    : "text-black/40"
                }`}
              >
                Pay in person
              </p>
            </div>
          </button>
        </div>
      </section>

      <button
        type="submit"
        className="group flex w-full items-center justify-between bg-black px-6 py-5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#292929]"
      >
        <span>Place order</span>

        <ArrowRight
          size={18}
          strokeWidth={1.4}
          className="transition-transform group-hover:translate-x-1"
        />
      </button>
    </form>
  );
}