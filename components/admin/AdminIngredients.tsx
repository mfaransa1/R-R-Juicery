"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Edit3,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import {
  AdminIngredient,
  createAdminIngredient,
  getAdminIngredients,
  IngredientInput,
  OrganicStatus,
  updateAdminIngredient,
} from "@/lib/supabase/ingredients";

const emptyIngredient: IngredientInput = {
  slug: "",
  name: "",
  category: "",
  description: "",
  short_description: "",
  organic_status: "unknown",
  source: "REQUIRED INPUT",
  origin: "REQUIRED INPUT",
  preparation: "REQUIRED INPUT",
  storage: "REQUIRED INPUT",
  seasonality: "REQUIRED INPUT",
  image_path: null,
  video_path: null,
  color: null,
};

const statuses: OrganicStatus[] = [
  "verified_organic",
  "supplier_claimed",
  "conventional",
  "unknown",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function statusLabel(value: string) {
  return value.replaceAll("_", " ");
}

export default function AdminIngredients() {
  const [ingredients, setIngredients] = useState<AdminIngredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<IngredientInput>(emptyIngredient);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadIngredients() {
    setLoading(true);
    setError("");

    try {
      setIngredients(await getAdminIngredients());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load ingredients from Supabase.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadIngredients();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return ingredients;

    return ingredients.filter((ingredient) =>
      [
        ingredient.name,
        ingredient.slug,
        ingredient.category ?? "",
        ingredient.source ?? "",
        ingredient.origin ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [ingredients, search]);

  function updateField<K extends keyof IngredientInput>(
    key: K,
    value: IngredientInput[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyIngredient);
    setError("");
    setNotice("");
    setEditorOpen(true);
  }

  function openEdit(ingredient: AdminIngredient) {
    setEditingId(ingredient.id);
    setForm({
      slug: ingredient.slug,
      name: ingredient.name,
      category: ingredient.category,
      description: ingredient.description,
      short_description: ingredient.short_description,
      organic_status: ingredient.organic_status,
      source: ingredient.source,
      origin: ingredient.origin,
      preparation: ingredient.preparation,
      storage: ingredient.storage,
      seasonality: ingredient.seasonality,
      image_path: ingredient.image_path,
      video_path: ingredient.video_path,
      color: ingredient.color,
    });
    setError("");
    setNotice("");
    setEditorOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
    };

    try {
      if (editingId) {
        await updateAdminIngredient(editingId, payload);
        setNotice("Ingredient updated.");
      } else {
        await createAdminIngredient(payload);
        setNotice("Ingredient created.");
      }

      await loadIngredients();
      setEditorOpen(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save the ingredient.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 border-b border-black/10 pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-black/45">
            Transparency
          </p>
          <h1 className="font-serif text-4xl tracking-[-0.03em] md:text-5xl">
            Ingredients
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/55">
            Maintain the ingredient records behind the R&R transparency
            experience.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white"
        >
          <Plus size={15} />
          Add ingredient
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
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3 border-y border-black/10 py-4 md:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-black/35"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search ingredients..."
            className="w-full border border-black/15 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-black"
          />
        </div>

        <button
          type="button"
          onClick={() => void loadIngredients()}
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
          <p className="font-serif text-2xl">No ingredients found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-black/10 bg-white">
          <table className="w-full min-w-[1050px] border-collapse text-left">
            <thead>
              <tr className="border-b border-black/10 bg-[#f5f1e8] text-[10px] uppercase tracking-[0.16em] text-black/45">
                <th className="px-5 py-4">Ingredient</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Organic status</th>
                <th className="px-5 py-4">Source</th>
                <th className="px-5 py-4">Origin</th>
                <th className="px-5 py-4">Seasonality</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ingredient) => (
                <tr
                  key={ingredient.id}
                  className="border-b border-black/10 last:border-0"
                >
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-4">
                      <div
                        className="h-12 w-12 shrink-0 border border-black/10"
                        style={{
                          backgroundColor: ingredient.color || "#e7e2d8",
                        }}
                      />
                      <div>
                        <p className="font-serif text-lg">
                          {ingredient.name}
                        </p>
                        <p className="mt-1 text-xs text-black/40">
                          {ingredient.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-5 text-sm text-black/65">
                    {ingredient.category || "—"}
                  </td>

                  <td className="px-5 py-5">
                    <span className="inline-flex border border-black/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em]">
                      {statusLabel(ingredient.organic_status)}
                    </span>
                  </td>

                  <td className="max-w-[220px] px-5 py-5 text-sm text-black/60">
                    {ingredient.source || "REQUIRED INPUT"}
                  </td>

                  <td className="max-w-[220px] px-5 py-5 text-sm text-black/60">
                    {ingredient.origin || "REQUIRED INPUT"}
                  </td>

                  <td className="max-w-[180px] px-5 py-5 text-sm text-black/60">
                    {ingredient.seasonality || "REQUIRED INPUT"}
                  </td>

                  <td className="px-5 py-5 text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(ingredient)}
                      className="inline-flex items-center gap-2 border border-black/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] hover:border-black"
                    >
                      <Edit3 size={13} />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editorOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 md:p-8">
          <div className="mx-auto max-w-5xl bg-[#f5f1e8]">
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-5 md:px-8">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
                  Ingredient record
                </p>
                <h2 className="mt-1 font-serif text-3xl">
                  {editingId ? form.name || "Edit ingredient" : "Add ingredient"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="border border-black/15 p-2"
                aria-label="Close ingredient editor"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-7 p-6 md:p-8">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Name">
                  <input
                    required
                    value={form.name}
                    onChange={(event) => {
                      const name = event.target.value;
                      setForm((current) => ({
                        ...current,
                        name,
                        slug: current.slug || slugify(name),
                      }));
                    }}
                    className={inputClass}
                  />
                </Field>

                <Field label="Slug">
                  <input
                    required
                    value={form.slug}
                    onChange={(event) =>
                      updateField("slug", slugify(event.target.value))
                    }
                    className={inputClass}
                  />
                </Field>

                <Field label="Category">
                  <input
                    value={form.category ?? ""}
                    onChange={(event) =>
                      updateField("category", event.target.value)
                    }
                    placeholder="fruit / citrus / herb..."
                    className={inputClass}
                  />
                </Field>

                <Field label="Organic status">
                  <select
                    value={form.organic_status}
                    onChange={(event) =>
                      updateField(
                        "organic_status",
                        event.target.value as OrganicStatus,
                      )
                    }
                    className={inputClass}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {statusLabel(status)}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Short description">
                <input
                  value={form.short_description ?? ""}
                  onChange={(event) =>
                    updateField("short_description", event.target.value)
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Description">
                <textarea
                  value={form.description ?? ""}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  rows={3}
                  className={inputClass}
                />
              </Field>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Source">
                  <input
                    value={form.source ?? ""}
                    onChange={(event) =>
                      updateField("source", event.target.value)
                    }
                    placeholder="REQUIRED INPUT"
                    className={inputClass}
                  />
                </Field>

                <Field label="Origin">
                  <input
                    value={form.origin ?? ""}
                    onChange={(event) =>
                      updateField("origin", event.target.value)
                    }
                    placeholder="REQUIRED INPUT"
                    className={inputClass}
                  />
                </Field>

                <Field label="Preparation">
                  <textarea
                    value={form.preparation ?? ""}
                    onChange={(event) =>
                      updateField("preparation", event.target.value)
                    }
                    rows={2}
                    className={inputClass}
                  />
                </Field>

                <Field label="Storage">
                  <textarea
                    value={form.storage ?? ""}
                    onChange={(event) =>
                      updateField("storage", event.target.value)
                    }
                    rows={2}
                    className={inputClass}
                  />
                </Field>

                <Field label="Seasonality">
                  <input
                    value={form.seasonality ?? ""}
                    onChange={(event) =>
                      updateField("seasonality", event.target.value)
                    }
                    placeholder="REQUIRED INPUT"
                    className={inputClass}
                  />
                </Field>

                <Field label="Display colour">
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={form.color || "#e7e2d8"}
                      onChange={(event) =>
                        updateField("color", event.target.value)
                      }
                      className="h-11 w-14 border border-black/15 bg-white p-1"
                    />
                    <input
                      value={form.color ?? ""}
                      onChange={(event) =>
                        updateField("color", event.target.value || null)
                      }
                      placeholder="#E7B83A"
                      className={inputClass}
                    />
                  </div>
                </Field>

                <Field label="Image path">
                  <input
                    value={form.image_path ?? ""}
                    onChange={(event) =>
                      updateField("image_path", event.target.value || null)
                    }
                    placeholder="/images/ingredients/example.jpg"
                    className={inputClass}
                  />
                </Field>

                <Field label="Video path">
                  <input
                    value={form.video_path ?? ""}
                    onChange={(event) =>
                      updateField("video_path", event.target.value || null)
                    }
                    placeholder="/videos/ingredients/example.mp4"
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="border border-black/10 bg-white px-4 py-4 text-sm leading-6 text-black/55">
                <strong className="text-black">Transparency rule:</strong>{" "}
                organic status, source, origin, seasonality and preparation
                should only be changed when R&R has verified the information.
                Unknown information remains marked as unknown or required
                input.
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-black/10 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="border border-black/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em]"
                >
                  Cancel
                </button>
                <button
                  disabled={saving}
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-white disabled:opacity-50"
                >
                  {saving && <Loader2 size={15} className="animate-spin" />}
                  {editingId ? "Save changes" : "Create ingredient"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inputClass =
  "w-full border border-black/15 bg-white px-3 py-3 text-sm outline-none focus:border-black";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-black/45">
        {label}
      </span>
      {children}
    </label>
  );
}
