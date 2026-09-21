"use client";

import { FormEvent, useEffect, useState } from "react";
import { Edit3, Loader2, Plus, RefreshCw, Trash2, X } from "lucide-react";
import {
  BatchInput,
  BatchRecord,
  createBatch,
  deleteBatch,
  getBatchProductOptions,
  getBatches,
  updateBatch,
} from "@/lib/supabase/batches";

const emptyForm: BatchInput = {
  batch_code: "",
  product_id: null,
  production_date: new Date().toISOString().slice(0, 10),
  preparation_method: "",
  storage: "",
  freshness: "",
  notes: "",
};

const inputClass =
  "w-full border border-black/15 bg-white px-3 py-3 text-sm outline-none focus:border-black";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-black/45">{label}</span>
      {children}
    </label>
  );
}

export default function AdminBatches() {
  const [batches, setBatches] = useState<BatchRecord[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BatchInput>(emptyForm);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [batchData, productData] = await Promise.all([
        getBatches(),
        getBatchProductOptions(),
      ]);
      setBatches(batchData);
      setProducts(productData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load batches.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function updateField<K extends keyof BatchInput>(key: K, value: BatchInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function openCreate() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      production_date: new Date().toISOString().slice(0, 10),
    });
    setError("");
    setNotice("");
    setEditorOpen(true);
  }

  function openEdit(batch: BatchRecord) {
    setEditingId(batch.id);
    setForm({
      batch_code: batch.batch_code,
      product_id: batch.product_id,
      production_date: batch.production_date,
      preparation_method: batch.preparation_method ?? "",
      storage: batch.storage ?? "",
      freshness: batch.freshness ?? "",
      notes: batch.notes ?? "",
    });
    setError("");
    setNotice("");
    setEditorOpen(true);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      if (editingId) {
        await updateBatch(editingId, form);
        setNotice("Batch updated.");
      } else {
        await createBatch(form);
        setNotice("Batch created.");
      }

      await load();
      setEditorOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save batch.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this batch record?")) return;

    try {
      await deleteBatch(id);
      await load();
      setNotice("Batch deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete batch.");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 border-b border-black/10 pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-black/45">Traceability</p>
          <h1 className="font-serif text-4xl tracking-[-0.03em] md:text-5xl">Batches.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/55">
            Record production batches so a future QR trace can connect a bottle back to its product and preparation record.
          </p>
        </div>

        <button type="button" onClick={openCreate} className="inline-flex items-center justify-center gap-2 bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white">
          <Plus size={15} />
          Add batch
        </button>
      </div>

      {error && <div className="border border-red-900/20 bg-red-50 px-4 py-3 text-sm text-red-900">{error}</div>}

      {notice && (
        <div className="flex items-center justify-between border border-black/10 bg-white px-4 py-3 text-sm">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Dismiss"><X size={16} /></button>
        </div>
      )}

      <div className="flex justify-end border-y border-black/10 py-4">
        <button type="button" onClick={() => void load()} className="inline-flex items-center gap-2 border border-black/15 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em]">
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-48 items-center justify-center border border-black/10 bg-white"><Loader2 size={22} className="animate-spin" /></div>
      ) : batches.length === 0 ? (
        <div className="border border-black/10 bg-white px-6 py-16 text-center">
          <p className="font-serif text-2xl">No batches recorded.</p>
          <p className="mt-2 text-sm text-black/50">Create a batch when production begins.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-black/10 bg-white">
          <table className="w-full min-w-[1050px] border-collapse text-left">
            <thead>
              <tr className="border-b border-black/10 bg-[#f5f1e8] text-[10px] uppercase tracking-[0.16em] text-black/45">
                <th className="px-5 py-4">Batch</th>
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">Production date</th>
                <th className="px-5 py-4">Preparation</th>
                <th className="px-5 py-4">Storage</th>
                <th className="px-5 py-4">Freshness</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
                <tr key={batch.id} className="border-b border-black/10 last:border-0">
                  <td className="px-5 py-5 font-mono text-sm">{batch.batch_code}</td>
                  <td className="px-5 py-5 font-serif text-lg">{batch.product?.name ?? "Unlinked"}</td>
                  <td className="px-5 py-5 text-sm text-black/60">{batch.production_date}</td>
                  <td className="px-5 py-5 text-sm text-black/60">{batch.preparation_method || "—"}</td>
                  <td className="px-5 py-5 text-sm text-black/60">{batch.storage || "—"}</td>
                  <td className="px-5 py-5 text-sm text-black/60">{batch.freshness || "—"}</td>
                  <td className="px-5 py-5 text-right">
                    <div className="inline-flex gap-2">
                      <button type="button" onClick={() => openEdit(batch)} className="inline-flex items-center gap-2 border border-black/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em]">
                        <Edit3 size={13} /> Edit
                      </button>
                      <button type="button" onClick={() => void remove(batch.id)} className="inline-flex items-center gap-2 border border-red-900/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-900">
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editorOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 md:p-8">
          <div className="mx-auto max-w-4xl bg-[#f5f1e8]">
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-5 md:px-8">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">Production batch</p>
                <h2 className="mt-1 font-serif text-3xl">{editingId ? "Edit batch" : "Add batch"}</h2>
              </div>
              <button type="button" onClick={() => setEditorOpen(false)} className="border border-black/15 p-2" aria-label="Close"><X size={18} /></button>
            </div>

            <form onSubmit={submit} className="space-y-6 p-6 md:p-8">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Batch code">
                  <input required value={form.batch_code} onChange={(e) => updateField("batch_code", e.target.value.toUpperCase())} placeholder="RR-2026-001" className={inputClass} />
                </Field>
                <Field label="Product">
                  <select value={form.product_id ?? ""} onChange={(e) => updateField("product_id", e.target.value || null)} className={inputClass}>
                    <option value="">Unlinked / choose later</option>
                    {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
                  </select>
                </Field>
                <Field label="Production date">
                  <input required type="date" value={form.production_date} onChange={(e) => updateField("production_date", e.target.value)} className={inputClass} />
                </Field>
                <Field label="Preparation method">
                  <input value={form.preparation_method ?? ""} onChange={(e) => updateField("preparation_method", e.target.value)} placeholder="PRESS / BLEND / CANE" className={inputClass} />
                </Field>
                <Field label="Storage">
                  <input value={form.storage ?? ""} onChange={(e) => updateField("storage", e.target.value)} placeholder="REQUIRED INPUT" className={inputClass} />
                </Field>
                <Field label="Freshness">
                  <input value={form.freshness ?? ""} onChange={(e) => updateField("freshness", e.target.value)} placeholder="REQUIRED INPUT" className={inputClass} />
                </Field>
              </div>

              <Field label="Notes">
                <textarea value={form.notes ?? ""} onChange={(e) => updateField("notes", e.target.value)} rows={4} className={inputClass} />
              </Field>

              <div className="border border-black/10 bg-white px-4 py-4 text-sm leading-6 text-black/55">
                <strong className="text-black">Traceability rule:</strong>{" "}
                batch codes should be unique and tied to real production records. Do not publish a batch until the underlying production information has been verified.
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-black/10 pt-6 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setEditorOpen(false)} className="border border-black/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em]">Cancel</button>
                <button disabled={saving} type="submit" className="inline-flex items-center justify-center gap-2 bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-white disabled:opacity-50">
                  {saving && <Loader2 size={15} className="animate-spin" />}
                  {editingId ? "Save changes" : "Create batch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
