"use client";

import { useState } from "react";
import {
  ArrowRight,
  Check,
  Clock3,
  Package,
  Search,
  Truck,
} from "lucide-react";

const stages = [
  {
    number: "01",
    title: "Order received",
    description: "Your order has reached R&R.",
    icon: Check,
  },
  {
    number: "02",
    title: "Preparing",
    description: "Your ingredients are being prepared.",
    icon: Package,
  },
  {
    number: "03",
    title: "Freshly made",
    description: "Your juice is being pressed or blended.",
    icon: Clock3,
  },
  {
    number: "04",
    title: "On the way",
    description: "Your order is ready for pickup or delivery.",
    icon: Truck,
  },
];

export default function OrderTracker() {
  const [orderNumber, setOrderNumber] = useState("");
  const [searched, setSearched] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!orderNumber.trim()) return;

    setSearched(true);
  }

  return (
    <section
      id="track"
      className="bg-[#f5f1e8] py-24 text-[#111] lg:py-36"
    >
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-14">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/35">
            ORDER LOOKUP
          </p>

          <h2 className="mt-5 font-serif text-6xl leading-[0.82] tracking-[-0.055em] sm:text-8xl">
            Where&apos;s
            <br />
            my juice?
          </h2>

          <p className="mt-7 text-base leading-relaxed text-black/50">
            Enter your order number to view its current status.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-10 flex max-w-xl border-b border-black"
          >
            <Search
              size={18}
              strokeWidth={1.4}
              className="mr-4 shrink-0 self-center text-black/35"
            />

            <input
              value={orderNumber}
              onChange={(event) =>
                setOrderNumber(event.target.value)
              }
              type="text"
              placeholder="e.g. RR-000123"
              className="h-16 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-black/25"
            />

            <button
              type="submit"
              className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em]"
            >
              Track
              <ArrowRight size={16} strokeWidth={1.4} />
            </button>
          </form>
        </div>

        {searched && (
          <div className="mt-20">
            <div className="border border-black/10 bg-white p-6 sm:p-10">
              <div className="flex flex-col gap-6 border-b border-black/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-black/35">
                    ORDER
                  </p>

                  <h3 className="mt-2 font-serif text-3xl">
                    {orderNumber.toUpperCase()}
                  </h3>
                </div>

                <span className="w-fit border border-black/15 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.18em]">
                  Status pending API
                </span>
              </div>

              <div className="mt-10 grid gap-0 md:grid-cols-4">
                {stages.map((stage, index) => {
                  const Icon = stage.icon;

                  return (
                    <div
                      key={stage.number}
                      className="relative border-b border-black/10 py-7 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
                    >
                      <div className="flex items-start justify-between md:block">
                        <span className="text-[10px] text-black/25">
                          {stage.number}
                        </span>

                        <Icon
                          size={19}
                          strokeWidth={1.3}
                          className="text-black/35 md:mt-8"
                        />
                      </div>

                      <h4 className="mt-7 font-serif text-2xl">
                        {stage.title}
                      </h4>

                      <p className="mt-3 text-sm leading-relaxed text-black/45">
                        {stage.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <p className="mt-8 text-center text-[10px] leading-relaxed text-black/30">
                Live order status will appear here once the R&R
                order system is connected.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}