"use client";

import Image from "next/image";

const options = [
  {
    label: "PICKUP",
    title: "Come to the House.",
    text: "Collect your order from Rook & Reed Plaza, Kilimani.",
    image: "/images/order/pickup.jpg",
  },
  {
    label: "DELIVERY",
    title: "Bring R&R to you.",
    text: "Delivery is available within the applicable R&R service area.",
    image: "/images/order/delivery.jpg",
  },
];

export default function OrderPickupDelivery() {
  return (
    <section className="bg-white py-24 text-[#111] lg:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/35">
            FULFILMENT
          </p>

          <h2 className="mt-5 max-w-3xl font-serif text-6xl leading-[0.82] tracking-[-0.055em] sm:text-8xl">
            Two ways
            <br />
            to receive.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {options.map((option) => (
            <div
              key={option.label}
              className="group relative min-h-[460px] overflow-hidden bg-black"
            >
              <Image
                src={option.image}
                alt={option.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/50 transition group-hover:bg-black/40" />

              <div className="absolute inset-x-0 bottom-0 p-8 text-white sm:p-10">
                <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/45">
                  {option.label}
                </p>

                <h3 className="mt-4 font-serif text-5xl tracking-[-0.04em]">
                  {option.title}
                </h3>

                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
                  {option.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}