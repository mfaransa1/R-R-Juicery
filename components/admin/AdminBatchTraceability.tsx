"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Loader2,
  RefreshCw,
  QrCode,
  ExternalLink,
} from "lucide-react";

import {
  getAdminTraceabilityBatches,
  TraceabilityBatch,
} from "@/lib/supabase/adminTraceability";

export default function AdminBatchTraceability() {
  const [batches, setBatches] = useState<TraceabilityBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const records = await getAdminTraceabilityBatches();

      setBatches(records);
    } catch (err) {
      console.error(
        "Traceability loading error:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load batch records.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
            Operations · Traceability
          </p>

          <h1 className="mt-2 font-serif text-4xl">
            Batch traceability.
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-black/50">
            Follow each production batch from the finished
            product back through production, ingredients and
            supplier records.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 border border-black/15 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] transition hover:border-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={14}
            className={loading ? "animate-spin" : ""}
          />

          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="border border-red-900/20 bg-red-50 p-5 text-sm leading-7 text-red-900">
          <p className="font-semibold">
            Unable to load batch records.
          </p>

          <p className="mt-1 text-red-900/70">
            {error}
          </p>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-48 items-center justify-center border border-black/10 bg-white">
          <div className="flex items-center gap-3 text-sm text-black/50">
            <Loader2
              size={21}
              className="animate-spin"
            />

            Loading traceability records…
          </div>
        </div>
      ) : batches.length === 0 ? (
        /* Empty */
        <div className="border border-black/10 bg-white p-10">
          <p className="text-sm font-medium">
            No batches recorded yet.
          </p>

          <p className="mt-2 max-w-xl text-sm leading-7 text-black/50">
            Production batches will appear here once they
            have been created in the production workflow.
          </p>
        </div>
      ) : (
        /* Records */
        <div className="overflow-hidden border border-black/10 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left">
              <thead className="border-b border-black/10 bg-[#f5f1e8] text-[10px] uppercase tracking-[0.14em] text-black/45">
                <tr>
                  <th className="px-5 py-4">
                    Batch
                  </th>

                  <th className="px-5 py-4">
                    Product
                  </th>

                  <th className="px-5 py-4">
                    Ingredient
                  </th>

                  <th className="px-5 py-4">
                    Supplier
                  </th>

                  <th className="px-5 py-4">
                    Produced
                  </th>

                  <th className="px-5 py-4">
                    Use by
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right">
                    Trace
                  </th>
                </tr>
              </thead>

              <tbody>
                {batches.map((batch) => (
                  <tr
                    key={batch.id}
                    className="border-b border-black/10 last:border-0"
                  >
                    {/* Batch */}
                    <td className="px-5 py-5">
                      <div className="font-mono text-sm font-semibold">
                        {batch.batch_code ||
                          batch.id}
                      </div>

                      <div className="mt-1 text-[9px] uppercase tracking-[0.12em] text-black/35">
                        Batch record
                      </div>
                    </td>

                    {/* Product */}
                    <td className="px-5 py-5">
                      <div className="font-serif text-lg">
                        {batch.product?.name ||
                          "Not linked"}
                      </div>

                      {batch.product?.slug && (
                        <div className="mt-1 text-[10px] text-black/40">
                          {batch.product.slug}
                        </div>
                      )}
                    </td>

                    {/* Ingredient */}
                    <td className="px-5 py-5 text-sm">
                      {batch.ingredient?.name || (
                        <span className="text-black/35">
                          Not recorded
                        </span>
                      )}
                    </td>

                    {/* Supplier */}
                    <td className="px-5 py-5 text-sm">
                      {batch.supplier?.name || (
                        <span className="text-black/35">
                          Not linked
                        </span>
                      )}
                    </td>

                    {/* Production date */}
                    <td className="px-5 py-5 text-sm">
                      {batch.production_date || "—"}
                    </td>

                    {/* Use by */}
                    <td className="px-5 py-5 text-sm">
                      {batch.use_by_date || "—"}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-5">
                      <span className="inline-flex border border-black/10 bg-[#f5f1e8] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em]">
                        {batch.status || "unknown"}
                      </span>
                    </td>

                    {/* Trace */}
                    <td className="px-5 py-5 text-right">
                      {batch.batch_code ? (
                        <a
                          href={`/trace/${encodeURIComponent(
                            batch.batch_code,
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 border border-black/10 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] transition hover:border-black hover:bg-black hover:!text-white"
                        >
                          <QrCode size={13} />

                          Trace

                          <ExternalLink
                            size={11}
                          />
                        </a>
                      ) : (
                        <span className="text-xs text-black/30">
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="border-t border-black/10 bg-[#f5f1e8]/60 px-5 py-4">
            <p className="text-[10px] uppercase tracking-[0.14em] text-black/40">
              {batches.length}{" "}
              {batches.length === 1
                ? "batch"
                : "batches"}{" "}
              recorded
            </p>
          </div>
        </div>
      )}
    </section>
  );
}