"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";

type OrderStatus =
  | "ALL"
  | "NEW"
  | "PREPARING"
  | "READY"
  | "DELIVERY"
  | "COMPLETED";

const orders = [
  {
    id: "RR-00124",
    customer: "Customer",
    items: "The First Move × 1, The Green Rook × 1",
    type: "PICKUP",
    amount: 700,
    status: "PREPARING",
    time: "10:42",
  },
  {
    id: "RR-00123",
    customer: "Customer",
    items: "Ruby Endgame × 1",
    type: "PICKUP",
    amount: 350,
    status: "READY",
    time: "10:21",
  },
  {
    id: "RR-00122",
    customer: "Customer",
    items: "Golden Reed × 1, Queen's Passage × 1",
    type: "DELIVERY",
    amount: 700,
    status: "DELIVERY",
    time: "09:58",
  },
  {
    id: "RR-00121",
    customer: "Customer",
    items: "The Long Game × 1",
    type: "PICKUP",
    amount: 300,
    status: "COMPLETED",
    time: "09:34",
  },
  {
    id: "RR-00120",
    customer: "Customer",
    items: "Sunday Session × 2",
    type: "DELIVERY",
    amount: 700,
    status: "NEW",
    time: "09:16",
  },
];

const filters: OrderStatus[] = [
  "ALL",
  "NEW",
  "PREPARING",
  "READY",
  "DELIVERY",
  "COMPLETED",
];

export default function AdminOrders() {
  const [filter, setFilter] = useState<OrderStatus>("ALL");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    return orders.filter((order) => {
      const matchesStatus =
        filter === "ALL" || order.status === filter;

      const matchesSearch =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.items.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [filter, search]);

  return (
    <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <div className="flex flex-col gap-6 border-b border-black/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-black/35">
            OPERATIONS / COMMERCE
          </p>

          <h1 className="mt-3 font-serif text-5xl tracking-[-0.045em]">
            Orders.
          </h1>
        </div>

        <button
          type="button"
          className="flex w-fit items-center gap-3 border border-black px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] transition hover:bg-black hover:text-white"
        >
          <SlidersHorizontal size={15} strokeWidth={1.3} />
          Filters
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center border-b border-black/20 lg:w-[360px]">
          <Search
            size={17}
            strokeWidth={1.4}
            className="mr-3 text-black/30"
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search orders"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-black/25"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.14em] transition ${
                filter === item
                  ? "bg-black text-white"
                  : "border border-black/10 text-black/40 hover:border-black/30 hover:text-black"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 overflow-x-auto border border-black/10 bg-white">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-black/10 text-[9px] font-semibold uppercase tracking-[0.16em] text-black/30">
              <th className="px-6 py-4">Order</th>
              <th className="px-6 py-4">Items</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((order) => (
              <tr
                key={order.id}
                className="border-b border-black/5 last:border-0"
              >
                <td className="px-6 py-5 text-xs font-semibold">
                  {order.id}
                </td>

                <td className="max-w-[320px] px-6 py-5 text-xs leading-relaxed text-black/50">
                  {order.items}
                </td>

                <td className="px-6 py-5 text-[9px] font-semibold tracking-[0.14em] text-black/40">
                  {order.type}
                </td>

                <td className="px-6 py-5 text-xs">
                  KSh {order.amount.toLocaleString()}
                </td>

                <td className="px-6 py-5 text-xs text-black/45">
                  {order.time}
                </td>

                <td className="px-6 py-5">
                  <span className="border border-black/10 px-3 py-1.5 text-[8px] font-semibold tracking-[0.12em]">
                    {order.status}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center border border-black/10 transition hover:bg-black hover:text-white"
                  >
                    <ArrowUpRight
                      size={14}
                      strokeWidth={1.3}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="font-serif text-3xl">
              No orders found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}