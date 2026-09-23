"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Search,
  UserRound,
  UsersRound,
} from "lucide-react";

export type AdminCustomer = {
  id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  email: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string | null;
};

function money(value: number) {
  return `KSh ${value.toLocaleString("en-KE")}`;
}

function dateLabel(value: string | null) {
  if (!value) return "No orders yet";

  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function AdminCustomers({
  initialCustomers,
}: {
  initialCustomers: AdminCustomer[];
}) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) return customers;

    return customers.filter((customer) =>
      [customer.full_name, customer.email, customer.phone]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term)),
    );
  }, [customers, query]);

  const totalSpent = customers.reduce(
    (sum, customer) => sum + customer.totalSpent,
    0,
  );

  const activeCustomers = customers.filter(
    (customer) => customer.orderCount > 0,
  ).length;

  function refresh() {
    setRefreshing(true);
    window.location.reload();
  }

  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#111]">
      {/* HERO */}
      <section className="border-b border-black/10 bg-[#111] py-16 text-white lg:py-20">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-14">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
                R&R ADMIN · CUSTOMERS
              </p>

              <h1 className="mt-5 font-serif text-6xl leading-[0.86] tracking-[-0.05em] sm:text-8xl">
                The people
                <br />
                who move with us.
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/55">
                Customer accounts and order activity in one operational view.
              </p>
            </div>

            <button
              type="button"
              onClick={refresh}
              disabled={refreshing}
              className="inline-flex w-fit items-center gap-2 border border-white/20 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition hover:border-white/50 disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>
      </section>

      {/* SUMMARY */}
      <section className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:px-14 lg:py-16">
        <div className="grid border-l border-t border-black/10 sm:grid-cols-3">
          <div className="border-b border-r border-black/10 bg-white p-6">
            <UsersRound size={18} strokeWidth={1.3} />

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-black/40">
              Customers
            </p>

            <p className="mt-3 font-serif text-5xl">{customers.length}</p>
          </div>

          <div className="border-b border-r border-black/10 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">
              Customers with orders
            </p>

            <p className="mt-3 font-serif text-5xl">{activeCustomers}</p>
          </div>

          <div className="border-b border-r border-black/10 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">
              Recorded customer spend
            </p>

            <p className="mt-3 font-serif text-4xl">
              {money(totalSpent)}
            </p>
          </div>
        </div>

        {/* DIRECTORY HEADER */}
        <div className="mt-12 flex flex-col gap-5 border-b border-black/15 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
              CUSTOMER DIRECTORY
            </p>

            <h2 className="mt-3 font-serif text-4xl tracking-[-0.03em] sm:text-5xl">
              R&R customers.
            </h2>
          </div>

          <div className="relative w-full sm:max-w-sm">
            <Search
              size={16}
              strokeWidth={1.3}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-black/35"
            />

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, email or phone"
              className="w-full border border-black/15 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-black/50"
            />
          </div>
        </div>

        {/* CUSTOMER LIST */}
        <div className="mt-8 overflow-hidden border border-black/10 bg-white">
          {filtered.length === 0 ? (
            <div className="p-8 text-sm text-black/50">
              {query
                ? "No customers match your search."
                : "No customer accounts yet."}
            </div>
          ) : (
            <div className="divide-y divide-black/10">
              {filtered.map((customer) => (
                <div
                  key={customer.id}
                  className="grid gap-6 p-6 lg:grid-cols-[1.35fr_0.7fr_0.9fr_auto] lg:items-center"
                >
                  {/* CUSTOMER */}
                  <div className="min-w-0">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-black/10 bg-[#f5f1e8]">
                        <UserRound size={16} strokeWidth={1.3} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {customer.full_name || "Unnamed customer"}
                        </p>

                        <p className="mt-1 truncate text-sm text-black/45">
                          {customer.email}
                        </p>

                        {customer.phone && (
                          <p className="mt-1 text-xs text-black/35">
                            {customer.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ORDERS */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/35">
                      Orders
                    </p>

                    <p className="mt-2 font-serif text-2xl">
                      {customer.orderCount}
                    </p>
                  </div>

                  {/* SPEND */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/35">
                      Spend
                    </p>

                    <p className="mt-2 font-serif text-2xl">
                      {money(customer.totalSpent)}
                    </p>

                    <p className="mt-1 text-xs text-black/35">
                      Last order {dateLabel(customer.lastOrderAt)}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-wrap items-center gap-4 lg:justify-end">
                    <Link
                      href={`/admin/customers/${customer.id}`}
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] transition hover:opacity-60"
                    >
                      Customer
                      <ExternalLink size={14} />
                    </Link>

                    <Link
                      href={`/admin/orders?customer=${encodeURIComponent(
                        customer.id,
                      )}`}
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] transition hover:opacity-60"
                    >
                      Orders
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PROFILE NOTE */}
        <div className="mt-8 border border-black/10 bg-white p-5 text-sm leading-relaxed text-black/50">
          Customer email is maintained in the R&R profile as a business-facing
          copy of the authenticated account email. Authentication remains
          governed by Supabase Auth and customer access remains protected by
          the existing R&R role permissions.
        </div>
      </section>
    </main>
  );
}