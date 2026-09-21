"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Edit3, Loader2, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";
import {
  createSourcingRecord,
  deleteSourcingRecord,
  getSourcingIngredientOptions,
  getSourcingRecords,
  SourcingInput,
  SourcingRecord,
} from "@/lib/supabase/sourcing";

const emptyForm: SourcingInput = {
  ingredient_id: null,
  farm: "",
  supplier: "",
  location: "",
  source_status: "REQUIRED INPUT",
  certification: "REQUIRED INPUT",
  notes: "",
};

const inputClass =
  "w-full border border-black/15 bg-white px-3 py-3 text-sm outline-none focus:border-black";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-black/45">
        {label}
      </span>
      {children}
    </label>
  );
}

export default function AdminSourcing() {
  const [records, setRecords] = useState<SourcingRecord[]>([]);
  const [ingredients, setIngredients] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SourcingInput>(emptyForm);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const [recordsData, ingredientData] = await Promise.all([
        getSourcingRecords(),
        getSourcingIngredientOptions(),
      ]);
      setRecords(recordsData);
      setIngredients(ingredientData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load sourcing records.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return records;

    return records.filter((record) =>
      [
        record.ingredient?.name ?? "",
        record.farm ?? "",
        record.supplier ?? "",
        record.location ?? "",
        record.source_status ?? "",
        record.certification ?? "",
      ].join(" ").toLowerCase().includes(q),
    );
  }, [records, search]);

  function updateField<K extends keyof SourcingInput>(key: K, value: SourcingInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setNotice("");
    setEditorOpen(true);
  }

  function openEdit(record: SourcingRecord) {
    setEditingId(record.id);
    setForm({
      ingredient_id: record.ingredient_id,
      farm: record.farm ?? "",
      supplier: record.supplier ?? "",
      location: record.location ?? "",
      source_status: record.source_status ?? "",
      certification: record.certification ?? "",
      notes: record.notes ?? "",
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
        const { updateSourcingRecord } = await import("@/lib/supabase/sourcing");
        await updateSourcingRecord(editingId, form);
        setNotice("Sourcing record updated.");
      } else {
        await createSourcingRecord(form);
        setNotice("Sourcing record created.");
      }

      await load();
      setEditorOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save sourcing record.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this sourcing record?")) return;

    setError("");
    try {
      await deleteSourcingRecord(id);
      await load();
      setNotice("Sourcing record deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete sourcing record.");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 border-b border-black/10 pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-black/45">
            Transparency
          </p>
          <h1 className="font-serif text-4xl tracking-[-0.03em] md:text-5xl">Sourcing.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/55">
            Maintain the sourcing records behind the R&R farm → supplier → juice story.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white"
        >
          <Plus size={15} />
          Add sourcing record
        </button>
      </div>

      {error && (
        <div className="border border-red-900/20 bg-red-50 px-4 py-3 text-sm text-red-900">
          {error}
        </div>
      )}

      {notice && (
        <div className="flex items-center justify-between border border-black/10 bg-white px-4 py-3 text-sm">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Dismiss">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3 border-y border-black/10 py-4 md:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/35" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search sourcing records..."
            className="w-full border border-black/15 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-black"
          />
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center justify-center gap-2 border border-black/15 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em]"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-48 items-center justify-center border border-black/10 bg-white">
          <Loader2 size={22} className="animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-black/10 bg-white px-6 py-16 text-center">
          <p className="font-serif text-2xl">No sourcing records found.</p>
          <p className="mt-2 text-sm text-black/50">Add a record when the sourcing information has been verified.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-black/10 bg-white">
          <table className="w-full min-w-[1000px] border-collapse text-left">
            <thead>
              <tr className="border-b border-black/10 bg-[#f5f1e8] text-[10px] uppercase tracking-[0.16em] text-black/45">
                <th className="px-5 py-4">Ingredient</th>
                <th className="px-5 py-4">Farm</th>
                <th className="px-5 py-4">Supplier</th>
                <th className="px-5 py-4">Location</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Certification</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record) => (
                <tr key={record.id} className="border-b border-black/10 last:border-0">
                  <td className="px-5 py-5 font-serif text-lg">{record.ingredient?.name ?? "Unlinked"}</td>
                  <td className="px-5 py-5 text-sm text-black/60">{record.farm || "REQUIRED INPUT"}</td>
                  <td className="px-5 py-5 text-sm text-black/60">{record.supplier || "REQUIRED INPUT"}</td>
                  <td className="px-5 py-5 text-sm text-black/60">{record.location || "REQUIRED INPUT"}</td>
                  <td className="px-5 py-5 text-sm text-black/60">{record.source_status || "REQUIRED INPUT"}</td>
                  <td className="px-5 py-5 text-sm text-black/60">{record.certification || "REQUIRED INPUT"}</td>
                  <td className="px-5 py-5 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(record)}
                        className="inline-flex items-center gap-2 border border-black/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em]"
                      >
                        <Edit3 size={13} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void remove(record.id)}
                        className="inline-flex items-center gap-2 border border-red-900/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-900"
                      >
                        <Trash2 size={13} />
                        Delete
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
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">Sourcing record</p>
                <h2 className="mt-1 font-serif text-3xl">{editingId ? "Edit record" : "Add record"}</h2>
              </div>
              <button type="button" onClick={() => setEditorOpen(false)} className="border border-black/15 p-2" aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={submit} className="space-y-6 p-6 md:p-8">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Ingredient">
                  <select
                    value={form.ingredient_id ?? ""}
                    onChange={(event) => updateField("ingredient_id", event.target.value || null)}
                    className={inputClass}
                  >
                    <option value="">Unlinked / choose later</option>
                    {ingredients.map((ingredient) => (
                      <option key={ingredient.id} value={ingredient.id}>{ingredient.name}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Farm">
                  <input value={form.farm ?? ""} onChange={(e) => updateField("farm", e.target.value)} className={inputClass} placeholder="REQUIRED INPUT" />
                </Field>
                <Field label="Supplier">
                  <input value={form.supplier ?? ""} onChange={(e) => updateField("supplier", e.target.value)} className={inputClass} placeholder="REQUIRED INPUT" />
                </Field>
                <Field label="Location">
                  <input value={form.location ?? ""} onChange={(e) => updateField("location", e.target.value)} className={inputClass} placeholder="REQUIRED INPUT" />
                </Field>
                <Field label="Source status">
                  <input value={form.source_status ?? ""} onChange={(e) => updateField("source_status", e.target.value)} className={inputClass} placeholder="Verified / supplier claimed / required input" />
                </Field>
                <Field label="Certification">
                  <input value={form.certification ?? ""} onChange={(e) => updateField("certification", e.target.value)} className={inputClass} placeholder="REQUIRED INPUT" />
                </Field>
              </div>

              <Field label="Notes">
                <textarea value={form.notes ?? ""} onChange={(e) => updateField("notes", e.target.value)} rows={4} className={inputClass} />
              </Field>

              <div className="border border-black/10 bg-white px-4 py-4 text-sm leading-6 text-black/55">
                <strong className="text-black">Transparency rule:</strong>{" "}
                do not publish a farm, supplier, certification or source-status claim until R&R has verified it.
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-black/10 pt-6 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setEditorOpen(false)} className="border border-black/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em]">Cancel</button>
                <button disabled={saving} type="submit" className="inline-flex items-center justify-center gap-2 bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-white disabled:opacity-50">
                  {saving && <Loader2 size={15} className="animate-spin" />}
                  {editingId ? "Save changes" : "Create record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
