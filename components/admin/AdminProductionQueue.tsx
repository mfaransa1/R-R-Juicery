"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Factory,
  Loader2,
  Plus,
  RefreshCw,
} from "lucide-react";
import {
  createProductionRun,
  getProductionRuns,
  updateProductionRun,
  type ProductionRun,
  type ProductionStatus,
} from "@/lib/supabase/production";

const statuses: ProductionStatus[] = [
  "queued",
  "in_progress",
  "quality_check",
  "ready",
  "completed",
  "cancelled",
];

function label(value: string) {
  return value.replaceAll("_", " ");
}

export default function AdminProductionQueue() {
  const [runs, setRuns] = useState<ProductionRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [productId, setProductId] = useState("");
  const [plannedQuantity, setPlannedQuantity] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      setRuns(await getProductionRuns());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load production.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createRun() {
    if (!productId.trim()) {
      setError("Enter a product ID to create a production run.");
      return;
    }

    try {
      setBusy("create");
      await createProductionRun({
        productId: productId.trim(),
        plannedQuantity: plannedQuantity ? Number(plannedQuantity) : null,
        unit: "bottles",
      });
      setProductId("");
      setPlannedQuantity("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create production run.");
    } finally {
      setBusy(null);
    }
  }

  async function move(run: ProductionRun, status: ProductionStatus) {
    try {
      setBusy(run.id);
      const now = new Date().toISOString();

      await updateProductionRun(run.id, {
        status,
        started_at:
          status === "in_progress" && !run.started_at
            ? now
            : run.started_at,
        completed_at:
          status === "completed" ? now : run.completed_at,
      });

      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update production run.");
    } finally {
      setBusy(null);
    }
  }

  if (loading) {
    return <div className="p-10 text-sm text-black/50">Loading production queue…</div>;
  }

  return (
    <main className="min-h-screen bg-[#f5f1e8] px-5 pb-16 pt-24 lg:ml-[250px] lg:px-10 lg:pt-10">
      <div className="mx-auto max-w-[1500px]">
        <header className="border-b border-black/10 pb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/40">
            Control Room / Production
          </p>
          <div className="mt-3 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-serif text-4xl text-[#111111] md:text-5xl">
                Production Queue
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-black/55">
                Move each production run through preparation, quality control,
                readiness and completion while keeping it linked to a batch.
              </p>
            </div>
            <button
              onClick={load}
              className="inline-flex items-center gap-2 border border-black/15 bg-white px-5 py-3 text-sm"
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>
        </header>

        {error && (
          <div className="mt-6 border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        <section className="mt-8 border border-black/10 bg-white p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/40">
            New production run
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-[1fr_180px_auto]">
            <input
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Product UUID"
              className="border border-black/10 px-4 py-3 text-sm outline-none"
            />
            <input
              value={plannedQuantity}
              onChange={(e) => setPlannedQuantity(e.target.value)}
              placeholder="Quantity"
              type="number"
              min="1"
              className="border border-black/10 px-4 py-3 text-sm outline-none"
            />
            <button
              onClick={createRun}
              disabled={busy === "create"}
              className="inline-flex items-center justify-center gap-2 bg-[#111111] px-5 py-3 text-sm font-medium text-white"
            >
              {busy === "create" ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
              Add Run
            </button>
          </div>

          <p className="mt-3 text-xs text-black/40">
            This first control-room version accepts the existing Supabase product UUID.
            A product selector can be added after the operational workflow is validated.
          </p>
        </section>

        <section className="mt-8 overflow-hidden border border-black/10 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="border-b border-black/10 bg-[#faf8f3]">
                <tr>
                  {["Product", "Batch", "Planned", "Status", "Started", "Completed", "Action"].map((x) => (
                    <th key={x} className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">
                      {x}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {runs.map((run) => (
                  <tr key={run.id} className="border-b border-black/[0.07]">
                    <td className="px-5 py-5">
                      <p className="font-medium">{run.product?.name ?? run.product_id ?? "—"}</p>
                      <p className="mt-1 text-xs text-black/35">{run.id}</p>
                    </td>
                    <td className="px-5 py-5 text-sm">
                      {run.batch?.batch_code ?? "Not linked"}
                    </td>
                    <td className="px-5 py-5 text-sm">
                      {run.planned_quantity ?? "—"} {run.unit ?? ""}
                    </td>
                    <td className="px-5 py-5">
                      <span className="inline-flex items-center gap-2 text-xs font-semibold capitalize">
                        {run.status === "completed" ? (
                          <CheckCircle2 size={14} />
                        ) : (
                          <Clock3 size={14} />
                        )}
                        {label(run.status)}
                      </span>
                    </td>
                    <td className="px-5 py-5 text-xs text-black/45">
                      {run.started_at ? new Date(run.started_at).toLocaleString("en-KE") : "—"}
                    </td>
                    <td className="px-5 py-5 text-xs text-black/45">
                      {run.completed_at ? new Date(run.completed_at).toLocaleString("en-KE") : "—"}
                    </td>
                    <td className="px-5 py-5">
                      <select
                        value={run.status}
                        disabled={busy === run.id}
                        onChange={(e) => move(run, e.target.value as ProductionStatus)}
                        className="border border-black/10 bg-white px-3 py-2 text-xs capitalize outline-none"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {label(status)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {runs.length === 0 && (
            <div className="px-6 py-20 text-center">
              <Factory size={28} className="mx-auto text-black/20" />
              <p className="mt-4 font-serif text-2xl">No production runs yet</p>
              <p className="mt-2 text-sm text-black/45">
                Create the first run after confirming the product and batch workflow.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
