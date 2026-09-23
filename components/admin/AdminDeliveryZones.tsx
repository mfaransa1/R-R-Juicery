"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, RefreshCw } from "lucide-react";
import {
  DeliveryZone,
  getDeliveryZones,
  saveDeliveryZone,
} from "@/lib/supabase/phase2Operations";

const empty = {
  name: "",
  description: "",
  fee: "0",
  minimum_order: "",
  free_delivery_threshold: "",
  active: true,
  sort_order: "0",
};

export default function AdminDeliveryZones() {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      setZones(await getDeliveryZones());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load delivery zones.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.name.trim()) return;

    setSaving(true);
    setError("");

    try {
      await saveDeliveryZone({
        id: editing || undefined,
        name: form.name,
        description: form.description,
        fee: Number(form.fee || 0),
        minimum_order: form.minimum_order ? Number(form.minimum_order) : null,
        free_delivery_threshold: form.free_delivery_threshold
          ? Number(form.free_delivery_threshold)
          : null,
        active: form.active,
        sort_order: Number(form.sort_order || 0),
      });

      setForm(empty);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save delivery zone.");
    } finally {
      setSaving(false);
    }
  }

  function edit(zone: DeliveryZone) {
    setEditing(zone.id);
    setForm({
      name: zone.name,
      description: zone.description || "",
      fee: String(zone.fee),
      minimum_order:
        zone.minimum_order === null ? "" : String(zone.minimum_order),
      free_delivery_threshold:
        zone.free_delivery_threshold === null
          ? ""
          : String(zone.free_delivery_threshold),
      active: zone.active,
      sort_order: String(zone.sort_order),
    });
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
            Operations · Delivery
          </p>
          <h1 className="mt-2 font-serif text-4xl">Delivery zones.</h1>
          <p className="mt-2 text-sm text-black/50">
            Define delivery fees and ordering thresholds for service areas.
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

      <form onSubmit={submit} className="border border-black/10 bg-white p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">
          {editing ? "Edit zone" : "Add zone"}
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <input
            value={form.name}
            onChange={(e) => setForm((x) => ({ ...x, name: e.target.value }))}
            placeholder="Zone name"
            className="border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
          />
          <input
            value={form.description}
            onChange={(e) =>
              setForm((x) => ({ ...x, description: e.target.value }))
            }
            placeholder="Description"
            className="border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
          />
          <input
            value={form.fee}
            onChange={(e) => setForm((x) => ({ ...x, fee: e.target.value }))}
            type="number"
            min="0"
            step="1"
            placeholder="Delivery fee (KSh)"
            className="border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
          />
          <input
            value={form.minimum_order}
            onChange={(e) =>
              setForm((x) => ({ ...x, minimum_order: e.target.value }))
            }
            type="number"
            min="0"
            step="1"
            placeholder="Minimum order (KSh)"
            className="border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
          />
          <input
            value={form.free_delivery_threshold}
            onChange={(e) =>
              setForm((x) => ({
                ...x,
                free_delivery_threshold: e.target.value,
              }))
            }
            type="number"
            min="0"
            step="1"
            placeholder="Free delivery threshold (KSh)"
            className="border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
          />
          <input
            value={form.sort_order}
            onChange={(e) =>
              setForm((x) => ({ ...x, sort_order: e.target.value }))
            }
            type="number"
            step="1"
            placeholder="Display order"
            className="border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
          />
        </div>

        <label className="mt-5 flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) =>
              setForm((x) => ({ ...x, active: e.target.checked }))
            }
          />
          Active
        </label>

        <button
          disabled={saving}
          className="mt-5 border border-black bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] !text-white hover:bg-white hover:!text-black disabled:opacity-50"
        >
          {saving ? "Saving..." : editing ? "Update zone" : "Add zone"}
        </button>
      </form>

      <div className="overflow-x-auto border border-black/10 bg-white">
        {loading ? (
          <div className="flex min-h-40 items-center justify-center">
            <Loader2 size={20} className="animate-spin" />
          </div>
        ) : (
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b border-black/10 bg-[#f5f1e8] text-[10px] uppercase tracking-[0.14em] text-black/45">
              <tr>
                <th className="px-5 py-4">Zone</th>
                <th className="px-5 py-4">Fee</th>
                <th className="px-5 py-4">Minimum</th>
                <th className="px-5 py-4">Free delivery</th>
                <th className="px-5 py-4">State</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((zone) => (
                <tr key={zone.id} className="border-b border-black/10 last:border-0">
                  <td className="px-5 py-5">
                    <p className="font-serif text-lg">{zone.name}</p>
                    {zone.description && (
                      <p className="mt-1 text-xs text-black/40">
                        {zone.description}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-5 font-mono text-sm">
                    KSh {Number(zone.fee).toLocaleString("en-KE")}
                  </td>
                  <td className="px-5 py-5 text-sm">
                    {zone.minimum_order === null
                      ? "—"
                      : `KSh ${Number(zone.minimum_order).toLocaleString("en-KE")}`}
                  </td>
                  <td className="px-5 py-5 text-sm">
                    {zone.free_delivery_threshold === null
                      ? "—"
                      : `KSh ${Number(zone.free_delivery_threshold).toLocaleString("en-KE")}`}
                  </td>
                  <td className="px-5 py-5 text-xs uppercase tracking-[0.1em]">
                    {zone.active ? "Active" : "Inactive"}
                  </td>
                  <td className="px-5 py-5 text-right">
                    <button
                      type="button"
                      onClick={() => edit(zone)}
                      className="border border-black/15 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.1em]"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
