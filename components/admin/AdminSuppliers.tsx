"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, RefreshCw } from "lucide-react";
import { getSuppliers, saveSupplier, Supplier } from "@/lib/supabase/phase2Operations";

const empty = {
  name: "",
  contact_name: "",
  phone: "",
  email: "",
  address: "",
  notes: "",
  active: true,
};

export default function AdminSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      setSuppliers(await getSuppliers());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load suppliers.");
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
      await saveSupplier({
        id: editing || undefined,
        ...form,
      });
      setForm(empty);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save supplier.");
    } finally {
      setSaving(false);
    }
  }

  function edit(supplier: Supplier) {
    setEditing(supplier.id);
    setForm({
      name: supplier.name,
      contact_name: supplier.contact_name || "",
      phone: supplier.phone || "",
      email: supplier.email || "",
      address: supplier.address || "",
      notes: supplier.notes || "",
      active: supplier.active,
    });
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
            Operations · Sourcing
          </p>
          <h1 className="mt-2 font-serif text-4xl">Suppliers.</h1>
          <p className="mt-2 text-sm text-black/50">
            Maintain supplier records without inventing sourcing claims.
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
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">
            {editing ? "Edit supplier" : "Add supplier"}
          </p>
          <Plus size={16} />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            ["name", "Supplier name"],
            ["contact_name", "Contact name"],
            ["phone", "Phone"],
            ["email", "Email"],
            ["address", "Address"],
          ].map(([key, placeholder]) => (
            <input
              key={key}
              value={form[key as keyof typeof form] as string}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  [key]: event.target.value,
                }))
              }
              placeholder={placeholder}
              className="border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
            />
          ))}

          <textarea
            value={form.notes}
            onChange={(event) =>
              setForm((current) => ({ ...current, notes: event.target.value }))
            }
            placeholder="Notes"
            rows={3}
            className="border border-black/15 px-4 py-3 text-sm outline-none focus:border-black md:col-span-2"
          />
        </div>

        <button
          disabled={saving}
          className="mt-5 border border-black bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] !text-white hover:bg-white hover:!text-black disabled:opacity-50"
        >
          {saving ? "Saving..." : editing ? "Update supplier" : "Add supplier"}
        </button>
      </form>

      <div className="overflow-x-auto border border-black/10 bg-white">
        {loading ? (
          <div className="flex min-h-40 items-center justify-center">
            <Loader2 size={20} className="animate-spin" />
          </div>
        ) : (
          <table className="w-full min-w-[800px] text-left">
            <thead className="border-b border-black/10 bg-[#f5f1e8] text-[10px] uppercase tracking-[0.14em] text-black/45">
              <tr>
                <th className="px-5 py-4">Supplier</th>
                <th className="px-5 py-4">Contact</th>
                <th className="px-5 py-4">Phone</th>
                <th className="px-5 py-4">State</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="border-b border-black/10 last:border-0">
                  <td className="px-5 py-5 font-serif text-lg">{supplier.name}</td>
                  <td className="px-5 py-5 text-sm">{supplier.contact_name || "—"}</td>
                  <td className="px-5 py-5 text-sm">{supplier.phone || "—"}</td>
                  <td className="px-5 py-5 text-xs uppercase tracking-[0.1em]">
                    {supplier.active ? "Active" : "Inactive"}
                  </td>
                  <td className="px-5 py-5 text-right">
                    <button
                      type="button"
                      onClick={() => edit(supplier)}
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
