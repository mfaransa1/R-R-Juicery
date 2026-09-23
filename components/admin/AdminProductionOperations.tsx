"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Factory,
  PackagePlus,
  QrCode,
  RefreshCw,
  ScanLine,
} from "lucide-react";
import {
  advanceProductionRun,
  consumeInventoryForProduction,
  createBatchFromProduction,
  createProductionRun,
  getProductionOperations,
  getProductionConsumption,
  type InventoryItem,
  type ProductionRun,
  type ProductionStatus,
} from "@/lib/supabase/phase6Operations";

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

export default function AdminProductionOperations() {
  const [runs, setRuns] = useState<ProductionRun[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [productId, setProductId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedRun, setSelectedRun] = useState<string | null>(null);
  const [consumeItem, setConsumeItem] = useState("");
  const [consumeQuantity, setConsumeQuantity] = useState("");
  const [batchCode, setBatchCode] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      const result = await getProductionOperations();
      setRuns(result.runs);
      setInventory(result.inventory);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load production operations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function addRun() {
    if (!productId.trim()) {
      setError("Product ID is required.");
      return;
    }

    try {
      setBusy("create");
      await createProductionRun({
        productId: productId.trim(),
        orderId: orderId.trim() || null,
        plannedQuantity: quantity ? Number(quantity) : null,
        unit: "bottles",
      });
      setProductId("");
      setOrderId("");
      setQuantity("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create production run.");
    } finally {
      setBusy(null);
    }
  }

  async function changeStatus(run: ProductionRun, status: ProductionStatus) {
    try {
      setBusy(run.id);
      await advanceProductionRun(run.id, status);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update production status.");
    } finally {
      setBusy(null);
    }
  }

  async function consume() {
    if (!selectedRun || !consumeItem || !consumeQuantity) {
      setError("Select a production run, inventory item and quantity.");
      return;
    }

    try {
      setBusy("consume");
      const item = inventory.find((x) => x.id === consumeItem);

      if (!item) {
        throw new Error("Inventory item not found.");
      }

      await consumeInventoryForProduction({
        productionRunId: selectedRun,
        inventoryItemId: consumeItem,
        quantity: Number(consumeQuantity),
        unit: item.unit,
      });

      setConsumeQuantity("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to consume inventory.");
    } finally {
      setBusy(null);
    }
  }

  async function createBatch() {
    if (!selectedRun || !batchCode.trim()) {
      setError("Select a production run and enter a batch code.");
      return;
    }

    try {
      setBusy("batch");
      await createBatchFromProduction({
        productionRunId: selectedRun,
        batchCode: batchCode.trim(),
      });
      setBatchCode("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create batch.");
    } finally {
      setBusy(null);
    }
  }

  const lowStock = useMemo(
    () =>
      inventory.filter(
        (item) =>
          item.reorder_level !== null &&
          Number(item.quantity) <= Number(item.reorder_level),
      ),
    [inventory],
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f1e8] px-6 py-12 lg:ml-[250px]">
        <p className="text-sm text-black/50">Loading production operations…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f1e8] px-5 pb-16 pt-24 lg:ml-[250px] lg:px-10 lg:pt-10">
      <div className="mx-auto max-w-[1500px]">
        <header className="flex flex-col gap-5 border-b border-black/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/40">
              Control Room / Production
            </p>
            <h1 className="mt-3 font-serif text-4xl tracking-[-0.03em] text-[#111111] md:text-5xl">
              Production Operations
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-black/55">
              Connect orders, production runs, inventory consumption, batches and
              traceability in one operational workflow.
            </p>
          </div>

          <button
            onClick={load}
            className="inline-flex items-center gap-2 border border-black/15 bg-white px-5 py-3 text-sm"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </header>

        {error && (
          <div className="mt-6 flex gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <Stat label="Production Runs" value={runs.length} icon={<Factory size={18} />} />
          <Stat label="Low Stock" value={lowStock.length} icon={<AlertTriangle size={18} />} />
          <Stat
            label="Ready / Completed"
            value={runs.filter((run) => run.status === "ready" || run.status === "completed").length}
            icon={<CheckCircle2 size={18} />}
          />
        </section>

        <section className="mt-8 border border-black/10 bg-white p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/40">
            Create production run
          </p>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr_180px_auto]">
            <input
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Product UUID"
              className="border border-black/10 px-4 py-3 text-sm outline-none"
            />
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Optional order UUID"
              className="border border-black/10 px-4 py-3 text-sm outline-none"
            />
            <input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              type="number"
              min="1"
              placeholder="Bottles"
              className="border border-black/10 px-4 py-3 text-sm outline-none"
            />
            <button
              onClick={addRun}
              disabled={busy === "create"}
              className="bg-[#111111] px-5 py-3 text-sm font-medium text-white"
            >
              Create Run
            </button>
          </div>
        </section>

        <section className="mt-8 overflow-hidden border border-black/10 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="border-b border-black/10 bg-[#faf8f3]">
                <tr>
                  {["Product", "Order", "Batch", "Planned", "Status", "Production", "Actions"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40"
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              <tbody>
                {runs.map((run) => (
                  <tr key={run.id} className="border-b border-black/[0.07]">
                    <td className="px-5 py-5">
                      <p className="font-medium">
                        {run.product?.name ?? run.product_id ?? "—"}
                      </p>
                      <p className="mt-1 text-xs text-black/35">{run.id}</p>
                    </td>

                    <td className="px-5 py-5 text-sm">
                      {run.order?.order_number ?? "—"}
                    </td>

                    <td className="px-5 py-5 text-sm">
                      {run.batch?.batch_code ?? "Not linked"}
                    </td>

                    <td className="px-5 py-5 text-sm">
                      {run.planned_quantity ?? "—"} {run.unit ?? ""}
                    </td>

                    <td className="px-5 py-5">
                      <select
                        value={run.status}
                        disabled={busy === run.id}
                        onChange={(e) =>
                          changeStatus(run, e.target.value as ProductionStatus)
                        }
                        className="border border-black/10 bg-white px-3 py-2 text-xs capitalize outline-none"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {label(status)}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-5 py-5">
                      <button
                        onClick={() => setSelectedRun(run.id)}
                        className={`inline-flex items-center gap-2 border px-3 py-2 text-xs ${
                          selectedRun === run.id
                            ? "border-[#111111] bg-[#111111] text-white"
                            : "border-black/10 bg-white text-black/60"
                        }`}
                      >
                        <ScanLine size={14} />
                        Operate
                      </button>
                    </td>

                    <td className="px-5 py-5 text-xs text-black/40">
                      {run.started_at
                        ? new Date(run.started_at).toLocaleString("en-KE")
                        : "Not started"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {runs.length === 0 && (
            <div className="px-6 py-20 text-center">
              <Factory size={30} className="mx-auto text-black/20" />
              <p className="mt-4 font-serif text-2xl text-[#111111]">
                No production runs
              </p>
            </div>
          )}
        </section>

        {selectedRun && (
          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="border border-black/10 bg-white p-6">
              <div className="flex items-center gap-3">
                <PackagePlus size={19} />
                <h2 className="font-serif text-2xl">Consume inventory</h2>
              </div>

              <p className="mt-2 text-sm leading-6 text-black/45">
                This operation uses a database transaction so the stock change,
                inventory movement and production consumption are committed together.
              </p>

              <div className="mt-6 space-y-4">
                <select
                  value={consumeItem}
                  onChange={(e) => setConsumeItem(e.target.value)}
                  className="w-full border border-black/10 bg-white px-4 py-3 text-sm"
                >
                  <option value="">Select inventory item</option>
                  {inventory.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.ingredient?.name ?? item.id} — {item.quantity} {item.unit}
                    </option>
                  ))}
                </select>

                <input
                  value={consumeQuantity}
                  onChange={(e) => setConsumeQuantity(e.target.value)}
                  type="number"
                  min="0.001"
                  step="0.001"
                  placeholder="Quantity to consume"
                  className="w-full border border-black/10 px-4 py-3 text-sm"
                />

                <button
                  onClick={consume}
                  disabled={busy === "consume"}
                  className="w-full bg-[#111111] px-5 py-3 text-sm font-medium text-white"
                >
                  {busy === "consume" ? "Consuming…" : "Consume Inventory"}
                </button>
              </div>
            </div>

            <div className="border border-black/10 bg-white p-6">
              <div className="flex items-center gap-3">
                <QrCode size={19} />
                <h2 className="font-serif text-2xl">Create batch</h2>
              </div>

              <p className="mt-2 text-sm leading-6 text-black/45">
                Create the traceability batch directly from the selected production run.
              </p>

              <div className="mt-6 space-y-4">
                <input
                  value={batchCode}
                  onChange={(e) => setBatchCode(e.target.value)}
                  placeholder="Example: RR-BATCH-20260923-001"
                  className="w-full border border-black/10 px-4 py-3 text-sm"
                />

                <button
                  onClick={createBatch}
                  disabled={busy === "batch"}
                  className="w-full bg-[#111111] px-5 py-3 text-sm font-medium text-white"
                >
                  {busy === "batch" ? "Creating…" : "Create Traceability Batch"}
                </button>

                <p className="text-xs leading-5 text-black/40">
                  After creation, the public trace page will be available at
                  <span className="mx-1 font-mono">/trace/&lt;batch-code&gt;</span>.
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="mt-8 border border-black/10 bg-[#111111] p-7 text-white">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">
            Operational chain
          </p>
          <p className="mt-4 font-serif text-2xl">
            Order → Production → Inventory → Batch → Traceability → Ready
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/55">
            The database now owns the critical transitions rather than relying
            on browser-side calculations for inventory or production state.
          </p>
        </section>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="border border-black/10 bg-white p-6">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
          {label}
        </p>
        <span className="text-black/30">{icon}</span>
      </div>
      <p className="mt-4 font-serif text-4xl text-[#111111]">{value}</p>
    </div>
  );
}
