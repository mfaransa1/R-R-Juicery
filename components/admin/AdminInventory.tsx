"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Loader2, Plus, RefreshCw } from "lucide-react";
import {
  InventoryItem,
  getInventory,
  recordInventoryMovement,
} from "@/lib/supabase/phase2Operations";

export default function AdminInventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      setItems(await getInventory());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load inventory.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function movement(item: InventoryItem, type: "received" | "used" | "wasted") {
    const raw = window.prompt(
      `${type === "received" ? "Receive" : type === "used" ? "Use" : "Record waste"} quantity (${item.unit})`,
    );
    if (!raw) return;

    const quantity = Number(raw);
    if (!Number.isFinite(quantity) || quantity <= 0) return;

    setBusy(item.id);
    setError("");

    try {
      await recordInventoryMovement({
        inventoryItemId: item.id,
        movementType: type,
        quantity,
        unit: item.unit,
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update inventory.");
    } finally {
      setBusy("");
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
            Operations · Stock
          </p>
          <h1 className="mt-2 font-serif text-4xl">Inventory.</h1>
          <p className="mt-2 text-sm text-black/50">
            Track ingredient quantities and recorded stock movements.
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
      ) : items.length === 0 ? (
        <div className="border border-black/10 bg-white p-10 text-sm text-black/50">
          No inventory records yet. Create inventory records from your operational setup.
        </div>
      ) : (
        <div className="overflow-x-auto border border-black/10 bg-white">
          <table className="w-full min-w-[850px] text-left">
            <thead className="border-b border-black/10 bg-[#f5f1e8] text-[10px] uppercase tracking-[0.14em] text-black/45">
              <tr>
                <th className="px-5 py-4">Ingredient</th>
                <th className="px-5 py-4">On hand</th>
                <th className="px-5 py-4">Reorder level</th>
                <th className="px-5 py-4">State</th>
                <th className="px-5 py-4 text-right">Movement</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const low =
                  item.reorder_level !== null &&
                  Number(item.quantity) <= Number(item.reorder_level);

                return (
                  <tr key={item.id} className="border-b border-black/10 last:border-0">
                    <td className="px-5 py-5 font-serif text-lg">
                      {item.ingredient?.name || "Ingredient"}
                    </td>
                    <td className="px-5 py-5 font-mono text-sm">
                      {Number(item.quantity).toLocaleString()} {item.unit}
                    </td>
                    <td className="px-5 py-5 text-sm text-black/55">
                      {item.reorder_level === null
                        ? "Not set"
                        : `${item.reorder_level} ${item.unit}`}
                    </td>
                    <td className="px-5 py-5">
                      {low ? (
                        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-amber-800">
                          <AlertTriangle size={14} /> Low
                        </span>
                      ) : (
                        <span className="text-xs uppercase tracking-[0.1em] text-black/45">
                          Normal
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          disabled={busy === item.id}
                          onClick={() => void movement(item, "received")}
                          className="border border-black/15 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.1em]"
                        >
                          <Plus size={12} className="inline mr-1" /> Receive
                        </button>
                        <button
                          type="button"
                          disabled={busy === item.id}
                          onClick={() => void movement(item, "used")}
                          className="border border-black/15 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.1em]"
                        >
                          Use
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
