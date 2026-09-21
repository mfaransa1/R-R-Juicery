"use client";

import Image from "next/image";
import Link from "next/link";

const demoItems = [
  {
    name: "The First Move",
    details: "500ml · Pineapple · Orange · Ginger",
    quantity: 1,
    price: 350,
    image: "/images/products/the-first-move.jpg",
  },
  {
    name: "The Green Rook",
    details: "500ml · Cucumber · Green Apple · Spinach",
    quantity: 1,
    price: 350,
    image: "/images/products/the-green-rook.jpg",
  },
];

export default function CheckoutSummary() {
  const subtotal = demoItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <aside className="lg:sticky lg:top-28 lg:h-fit">
      <div className="border border-black/10 bg-white">
        <div className="border-b border-black/10 p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">
            YOUR ORDER
          </p>

          <h2 className="mt-3 font-serif text-4xl tracking-[-0.035em]">
            The basket.
          </h2>
        </div>

        <div className="divide-y divide-black/10">
          {demoItems.map((item) => (
            <div
              key={item.name}
              className="flex gap-4 p-5"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-[#f5f1e8]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="min-w-0">
                <p className="font-serif text-xl leading-none">
                  {item.name}
                </p>

                <p className="mt-2 text-[11px] leading-relaxed text-black/40">
                  {item.details}
                </p>

                <div className="mt-3 flex items-center justify-between gap-5">
                  <span className="text-[10px] uppercase tracking-[0.12em] text-black/35">
                    Qty {item.quantity}
                  </span>

                  <span className="text-sm font-medium">
                    KSh {item.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 p-6">
          <div className="flex justify-between text-sm">
            <span className="text-black/45">Subtotal</span>
            <span>KSh {subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-black/45">Delivery</span>
            <span className="text-black/45">Calculated</span>
          </div>

          <div className="flex justify-between border-t border-black/10 pt-5">
            <span className="font-serif text-2xl">
              Total
            </span>

            <span className="font-serif text-2xl">
              KSh {subtotal.toLocaleString()}
            </span>
          </div>

          <p className="pt-2 text-[10px] leading-relaxed text-black/35">
            This basket is placeholder data for the front-end
            checkout experience. Live cart data will be connected
            to the product and order system.
          </p>
        </div>
      </div>

      <Link
        href="/menu"
        className="mt-4 block text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45 underline underline-offset-8 transition hover:text-black"
      >
        Continue shopping
      </Link>
    </aside>
  );
}