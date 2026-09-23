"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  CreditCard,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";

import {
  getPaymentReconciliation,
  markPaymentReconciled,
  type PaymentReconciliationRow,
} from "@/lib/supabase/paymentReconciliation";

type Filter = "all" | "matched" | "exceptions" | "processing" | "failed";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function statusLabel(status: string) {
  return status.replaceAll("_", " ");
}

export default function AdminPaymentReconciliation() {
  const [payments, setPayments] = useState<PaymentReconciliationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [reconcilingId, setReconcilingId] = useState<string | null>(null);

  const loadPayments = useCallback(async () => {
    try {
      setError("");
      const result = await getPaymentReconciliation();
      setPayments(result.payments);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load payment reconciliation.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  async function refresh() {
    setRefreshing(true);
    await loadPayments();
  }

  async function reconcile(paymentId: string) {
    try {
      setReconcilingId(paymentId);
      setError("");
      await markPaymentReconciled(paymentId);
      await loadPayments();
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reconcile this payment.",
      );
    } finally {
      setReconcilingId(null);
    }
  }

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const orderNumber = payment.order?.order_number?.toLowerCase() ?? "";
      const receipt = payment.mpesa_receipt_number?.toLowerCase() ?? "";
      const phone = payment.phone?.toLowerCase() ?? "";

      const matchesSearch =
        !query ||
        orderNumber.includes(query) ||
        receipt.includes(query) ||
        phone.includes(query);

      if (!matchesSearch) return false;
      if (filter === "all") return true;

      if (filter === "matched") {
        return (
          (payment.status === "paid" || payment.status === "reconciled") &&
          !!payment.order &&
          Number(payment.amount) === Number(payment.order.total)
        );
      }

      if (filter === "exceptions") {
        return (
          !payment.order ||
          Number(payment.amount) !== Number(payment.order.total)
        );
      }

      if (filter === "processing") return payment.status === "processing";
      if (filter === "failed") return payment.status === "failed";

      return true;
    });
  }, [payments, filter, search]);

  const summary = useMemo(() => {
    let paid = 0;
    let processing = 0;
    let failed = 0;
    let unmatched = 0;
    let expectedPaidValue = 0;
    let recordedPaidValue = 0;

    for (const payment of payments) {
      if (payment.status === "paid" || payment.status === "reconciled") {
        paid += 1;
        recordedPaidValue += Number(payment.amount || 0);

        if (payment.order) {
          expectedPaidValue += Number(payment.order.total || 0);

          if (
            Number(payment.amount || 0) !== Number(payment.order.total || 0)
          ) {
            unmatched += 1;
          }
        } else {
          unmatched += 1;
        }
      }

      if (payment.status === "processing") processing += 1;
      if (payment.status === "failed") failed += 1;
    }

    return {
      total: payments.length,
      paid,
      processing,
      failed,
      unmatched,
      expectedPaidValue,
      recordedPaidValue,
    };
  }, [payments]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f1e8] px-6 py-12 lg:ml-[250px] lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="h-10 w-72 animate-pulse bg-black/10" />
          <div className="mt-8 h-32 animate-pulse bg-black/5" />
          <div className="mt-6 h-96 animate-pulse bg-black/5" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f1e8] px-5 pb-16 pt-24 lg:ml-[250px] lg:px-10 lg:pt-10">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col gap-5 border-b border-black/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/40">
              Control Room / Finance
            </p>
            <h1 className="mt-3 font-serif text-4xl tracking-[-0.03em] text-[#111111] md:text-5xl">
              Payment Reconciliation
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-black/55">
              Compare recorded payment transactions against their corresponding
              R&R orders and surface exceptions that need attention.
            </p>
          </div>

          <button
            type="button"
            onClick={refresh}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-black/15 bg-white px-5 py-3 text-sm font-medium text-[#111111] transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mt-6 flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Payment reconciliation error</p>
              <p className="mt-1 text-red-700/80">{error}</p>
            </div>
          </div>
        )}

        <section className="mt-8 grid gap-px border border-black/10 bg-black/10 md:grid-cols-2 xl:grid-cols-4">
          <Metric label="Transactions" value={summary.total} icon={<CreditCard size={17} />} />
          <Metric label="Paid / Reconciled" value={summary.paid} icon={<CheckCircle2 size={17} />} />
          <Metric label="Processing" value={summary.processing} icon={<Clock3 size={17} />} />
          <Metric label="Exceptions" value={summary.unmatched} icon={<AlertTriangle size={17} />} />
        </section>

        <section className="mt-6 grid gap-px border border-black/10 bg-black/10 md:grid-cols-3">
          <ValueMetric label="Expected Paid Value" value={formatMoney(summary.expectedPaidValue)} />
          <ValueMetric label="Provider Recorded Value" value={formatMoney(summary.recordedPaidValue)} />
          <ValueMetric
            label="Difference"
            value={formatMoney(summary.recordedPaidValue - summary.expectedPaidValue)}
          />
        </section>

        <section className="mt-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["all", "All"],
                  ["matched", "Matched"],
                  ["exceptions", "Exceptions"],
                  ["processing", "Processing"],
                  ["failed", "Failed"],
                ] as [Filter, string][]
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  className={`rounded-sm px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
                    filter === value
                      ? "bg-[#111111] text-white"
                      : "border border-black/10 bg-white text-black/50 hover:bg-black/[0.04] hover:text-black"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/35" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search order, receipt or phone..."
                className="w-full border border-black/10 bg-white py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:border-black/30"
              />
            </div>
          </div>
        </section>

        <section className="mt-6 overflow-hidden border border-black/10 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse">
              <thead>
                <tr className="border-b border-black/10 bg-[#faf8f3] text-left">
                  {["Order", "Provider", "Expected", "Recorded", "Status", "Receipt", "Time", "Action"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40"
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              <tbody>
                {filteredPayments.map((payment) => {
                  const expected = payment.order?.total ?? null;
                  const recorded = Number(payment.amount || 0);
                  const amountMatches =
                    expected !== null && recorded === Number(expected);
                  const isException = !payment.order || !amountMatches;

                  return (
                    <tr key={payment.id} className="border-b border-black/[0.07] last:border-0">
                      <td className="px-5 py-5">
                        <p className="font-medium text-[#111111]">
                          {payment.order?.order_number ?? "Unknown order"}
                        </p>
                        <p className="mt-1 text-xs text-black/35">{payment.order_id}</p>
                      </td>

                      <td className="px-5 py-5">
                        <p className="text-sm capitalize text-black/70">{payment.provider}</p>
                        {payment.phone && (
                          <p className="mt-1 text-xs text-black/35">{payment.phone}</p>
                        )}
                      </td>

                      <td className="px-5 py-5 text-sm text-black/70">
                        {expected === null ? "—" : formatMoney(Number(expected))}
                      </td>

                      <td className="px-5 py-5 text-sm font-medium text-[#111111]">
                        {formatMoney(recorded)}
                      </td>

                      <td className="px-5 py-5">
                        <PaymentStatus status={payment.status} exception={isException} />
                      </td>

                      <td className="px-5 py-5">
                        <span className="font-mono text-xs text-black/55">
                          {payment.mpesa_receipt_number ?? "—"}
                        </span>
                      </td>

                      <td className="px-5 py-5 text-xs text-black/45">
                        {formatDate(payment.transaction_date ?? payment.created_at)}
                      </td>

                      <td className="px-5 py-5 text-right">
                        {payment.status === "paid" && !isException ? (
                          <button
                            type="button"
                            onClick={() => reconcile(payment.id)}
                            disabled={reconcilingId === payment.id}
                            className="inline-flex items-center gap-2 rounded-sm bg-[#111111] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {reconcilingId === payment.id ? (
                              <>
                                <RefreshCw size={13} className="animate-spin" />
                                Reconciling
                              </>
                            ) : (
                              <>
                                <CheckCircle2 size={13} />
                                Reconcile
                              </>
                            )}
                          </button>
                        ) : payment.status === "reconciled" ? (
                          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-black/35">
                            Reconciled
                          </span>
                        ) : (
                          <span className="text-xs text-black/30">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="px-6 py-20 text-center">
              <CreditCard size={28} className="mx-auto text-black/20" />
              <p className="mt-4 font-serif text-2xl text-[#111111]">
                No payment records found
              </p>
              <p className="mt-2 text-sm text-black/45">
                Try changing the filter or search term.
              </p>
            </div>
          )}
        </section>

        <section className="mt-8 border border-black/10 bg-[#111111] p-6 text-white md:p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/45">
            Reconciliation model
          </p>
          <h2 className="mt-3 font-serif text-2xl">
            R&R payment records vs. orders
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/60">
            This control room compares the payment transactions recorded by R&R
            against the corresponding order totals. It does not yet import an
            external Safaricom statement. That provider-to-R&R settlement
            reconciliation can be added as a later production hardening layer.
          </p>
        </section>
      </div>
    </main>
  );
}

function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white p-6">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
          {label}
        </p>
        <span className="text-black/30">{icon}</span>
      </div>
      <p className="mt-4 font-serif text-4xl tracking-[-0.03em] text-[#111111]">
        {value}
      </p>
    </div>
  );
}

function ValueMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
        {label}
      </p>
      <p className="mt-3 font-serif text-2xl text-[#111111]">{value}</p>
    </div>
  );
}

function PaymentStatus({
  status,
  exception,
}: {
  status: string;
  exception: boolean;
}) {
  const normalized = status.toLowerCase();

  if (exception) {
    return (
      <span className="inline-flex items-center gap-2 text-xs font-semibold capitalize text-amber-700">
        <AlertTriangle size={14} />
        Exception
      </span>
    );
  }

  if (normalized === "paid" || normalized === "reconciled") {
    return (
      <span className="inline-flex items-center gap-2 text-xs font-semibold capitalize text-green-700">
        <CheckCircle2 size={14} />
        {statusLabel(status)}
      </span>
    );
  }

  if (normalized === "processing") {
    return (
      <span className="inline-flex items-center gap-2 text-xs font-semibold capitalize text-blue-700">
        <Clock3 size={14} />
        Processing
      </span>
    );
  }

  if (normalized === "failed") {
    return (
      <span className="inline-flex items-center gap-2 text-xs font-semibold capitalize text-red-700">
        <XCircle size={14} />
        Failed
      </span>
    );
  }

  return (
    <span className="text-xs font-semibold capitalize text-black/50">
      {statusLabel(status)}
    </span>
  );
}
