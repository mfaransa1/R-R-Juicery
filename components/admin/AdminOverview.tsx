"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  ClipboardList,
  Package,
  Users,
} from "lucide-react";

const stats = [
  {
    label: "Orders today",
    value: "24",
    change: "+8",
    icon: ClipboardList,
  },
  {
    label: "Revenue today",
    value: "KSh 8,420",
    change: "+12%",
    icon: ArrowUpRight,
  },
  {
    label: "Products",
    value: "10",
    change: "Active",
    icon: Package,
  },
  {
    label: "Customers",
    value: "186",
    change: "+14",
    icon: Users,
  },
];

const recentOrders = [
  {
    id: "RR-00124",
    customer: "Customer",
    items: "The First Move + The Green Rook",
    amount: "KSh 700",
    status: "PREPARING",
  },
  {
    id: "RR-00123",
    customer: "Customer",
    items: "Ruby Endgame",
    amount: "KSh 350",
    status: "READY",
  },
  {
    id: "RR-00122",
    customer: "Customer",
    items: "Golden Reed + Queen's Passage",
    amount: "KSh 700",
    status: "DELIVERY",
  },
  {
    id: "RR-00121",
    customer: "Customer",
    items: "The Long Game",
    amount: "KSh 300",
    status: "COMPLETED",
  },
];

export default function AdminOverview() {
  return (
    <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <div className="flex flex-col gap-6 border-b border-black/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-black/35">
            MONDAY / OPERATIONS
          </p>

          <h1 className="mt-3 font-serif text-5xl tracking-[-0.045em] sm:text-6xl">
            Good morning.
          </h1>

          <p className="mt-3 text-sm text-black/45">
            Here&apos;s what is moving at R&R.
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="flex w-fit items-center gap-3 bg-black px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#292929]"
        >
          View orders
          <ArrowUpRight size={15} strokeWidth={1.3} />
        </Link>
      </div>

      <div className="mt-8 grid gap-px overflow-hidden border border-black/10 bg-black/10 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="bg-white p-6 lg:p-7"
            >
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-black/35">
                  {stat.label}
                </p>

                <Icon
                  size={18}
                  strokeWidth={1.3}
                  className="text-black/25"
                />
              </div>

              <p className="mt-8 font-serif text-4xl tracking-[-0.04em]">
                {stat.value}
              </p>

              <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-black/35">
                {stat.change}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[1.5fr_0.5fr]">
        <section className="border border-black/10 bg-white">
          <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-black/35">
                LIVE QUEUE
              </p>

              <h2 className="mt-2 font-serif text-3xl">
                Recent orders
              </h2>
            </div>

            <Link
              href="/admin/orders"
              className="text-[9px] font-semibold uppercase tracking-[0.16em] underline underline-offset-4"
            >
              All orders
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b border-black/10 text-[9px] font-semibold uppercase tracking-[0.16em] text-black/30">
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-black/5 last:border-0"
                  >
                    <td className="px-6 py-5 text-xs font-semibold">
                      {order.id}
                    </td>

                    <td className="px-6 py-5 text-xs text-black/50">
                      {order.items}
                    </td>

                    <td className="px-6 py-5 text-xs">
                      {order.amount}
                    </td>

                    <td className="px-6 py-5">
                      <span className="border border-black/10 px-3 py-1.5 text-[8px] font-semibold tracking-[0.14em]">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-[#111] p-7 text-white">
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">
            HOUSE NOTE
          </p>

          <h2 className="mt-5 font-serif text-4xl leading-[0.9] tracking-[-0.04em]">
            Two identities.
            <br />
            One building.
          </h2>

          <div className="mt-10 border-t border-white/10 pt-6">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/30">
              R&R
            </p>

            <p className="mt-2 text-sm leading-relaxed text-white/55">
              Juice, jazz, books, conversation and hospitality.
            </p>
          </div>

          <div className="mt-6 border-t border-white/10 pt-6">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/30">
              SHoP
            </p>

            <p className="mt-2 text-sm leading-relaxed text-white/55">
              Chess, youth, learning, community and competition.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}