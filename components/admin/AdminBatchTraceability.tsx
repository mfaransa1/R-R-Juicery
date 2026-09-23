"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import {
  getOperationalBatches,
  OperationalBatch,
} from "@/lib/supabase/phase2Operations";

export default function AdminBatchTraceability() {
  const [batches, setBatches] = useState<OperationalBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      setBatches(await getOperationalBatches());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load batch records.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
            Operations · Traceability
          </p>
          <h1 className="mt-2 font-serif text-4xl">Batch traceability.</h1>
          <p className="mt-2 max-w-2xl text-sm text-black/50">
            Connect production batches with products, ingredients and suppliers.
            Missing sourcing facts remain visibly unresolved rather than invented.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-2 border border-black/15 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em]"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {error && (
        <div className="border border-red-900/20 bg-red-50 p-4 text-sm text-red-900">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-48 items-center justify-center border border-black/10 bg-white">
          <Loader2 size={21} className="animate-spin" />
        </div>
      ) : batches.length === 0 ? (
        <div className="border border-black/10 bg-white p-10 text-sm text-black/50">
          No batches recorded yet.
        </div>
      ) : (
        <div className="overflow-x-auto border border-black/10 bg-white">
          <table className="w-full min-w-[1050px] text-left">
            <thead className="border-b border-black/10 bg-[#f5f1e8] text-[10px] uppercase tracking-[0.14em] text-black/45">
              <tr>
                <th className="px-5 py-4">Batch</th>
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">Ingredient</th>
                <th className="px-5 py-4">Supplier</th>
                <th className="px-5 py-4">Produced</th>
                <th className="px-5 py-4">Use by</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
                <tr key={batch.id} className="border-b border-black/10 last:border-0">
                  <td className="px-5 py-5 font-mono text-sm">
                    {batch.batch_code || batch.id}
                  </td>
                  <td className="px-5 py-5 font-serif text-lg">
                    {batch.product?.name || "—"}
                  </td>
                  <td className="px-5 py-5 text-sm">
                    {batch.ingredient?.name || "—"}
                  </td>
                  <td className="px-5 py-5 text-sm">
                    {batch.supplier?.name || "Not linked"}
                  </td>
                  <td className="px-5 py-5 text-sm">
                    {batch.production_date || "—"}
                  </td>
                  <td className="px-5 py-5 text-sm">
                    {batch.use_by_date || "—"}
                  </td>
                  <td className="px-5 py-5 text-xs uppercase tracking-[0.1em]">
                    {batch.status || "active"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
