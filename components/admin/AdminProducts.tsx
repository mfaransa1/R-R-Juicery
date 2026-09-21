"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Edit3,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Star,
  X,
} from "lucide-react";
import {
  AdminProduct,
  createAdminProduct,
  getAdminProducts,
  ProductInput,
  setProductActive,
  setProductFeatured,
  updateAdminProduct,
} from "@/lib/supabase/products";

const emptyProduct: ProductInput = {
  slug: "",
  name: "",
  category: "house-compositions",
  category_label: "House Compositions",
  description: "",
  note: "",
  price: 0,
  size: "500ml",
  preparation: "REQUIRED INPUT",
  freshness: "REQUIRED INPUT",
  additives: "REQUIRED INPUT",
  concentrate: "REQUIRED INPUT",
  featured: false,
  tone: null,
  image_path: null,
  video_path: null,
  active: true,
};

const categories = [
  ["presses", "The Presses"],
  ["house-compositions", "House Compositions"],
  ["cane", "The Cane"],
  ["interludes", "The Interludes"],
  ["blenders", "The Blenders"],
  ["seasonal-records", "Seasonal Records"],
] as const;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminProducts() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductInput>(emptyProduct);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadProducts() {
    setLoading(true);
    setError("");

    try {
      setProducts(await getAdminProducts());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load products from Supabase.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.slug.toLowerCase().includes(query) ||
        product.category_label.toLowerCase().includes(query);

      const matchesStatus = showInactive || product.active;

      return matchesSearch && matchesStatus;
    });
  }, [products, search, showInactive]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyProduct);
    setError("");
    setNotice("");
    setEditorOpen(true);
  }

  function openEdit(product: AdminProduct) {
    setEditingId(product.id);
    setForm({
      slug: product.slug,
      name: product.name,
      category: product.category,
      category_label: product.category_label,
      description: product.description,
      note: product.note,
      price: Number(product.price),
      size: product.size,
      preparation: product.preparation,
      freshness: product.freshness,
      additives: product.additives,
      concentrate: product.concentrate,
      featured: product.featured,
      tone: product.tone,
      image_path: product.image_path,
      video_path: product.video_path,
      active: product.active,
    });
    setError("");
    setNotice("");
    setEditorOpen(true);
  }

  function updateField<K extends keyof ProductInput>(
    key: K,
    value: ProductInput[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
      price: Number(form.price),
    };

    try {
      if (editingId) {
        await updateAdminProduct(editingId, payload);
        setNotice("Product updated.");
      } else {
        await createAdminProduct(payload);
        setNotice("Product created.");
      }

      await loadProducts();
      setEditorOpen(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save the product.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(product: AdminProduct) {
    setError("");
    try {
      await setProductActive(product.id, !product.active);
      setProducts((current) =>
        current.map((item) =>
          item.id === product.id
            ? { ...item, active: !item.active }
            : item,
        ),
      );
      setNotice(product.active ? "Product deactivated." : "Product activated.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update product.",
      );
    }
  }

  async function toggleFeatured(product: AdminProduct) {
    setError("");
    try {
      await setProductFeatured(product.id, !product.featured);
      setProducts((current) =>
        current.map((item) =>
          item.id === product.id
            ? { ...item, featured: !item.featured }
            : item,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update product.",
      );
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 border-b border-black/10 pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-black/45">
            Catalogue
          </p>
          <h1 className="font-serif text-4xl tracking-[-0.03em] text-black md:text-5xl">
            Products
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/55">
            Manage the live R&R juice catalogue stored in Supabase.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-black/80"
        >
          <Plus size={15} />
          Add product
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

      <div className="flex flex-col gap-3 border-y border-black/10 py-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-black/35"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products..."
            className="w-full border border-black/15 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-black"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowInactive((value) => !value)}
          className="border border-black/15 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em]"
        >
          {showInactive ? "Showing all" : "Active only"}
        </button>

        <button
          type="button"
          onClick={() => void loadProducts()}
          className="inline-flex items-center justify-center gap-2 border border-black/15 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em]"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-48 items-center justify-center border border-black/10 bg-white">
          <Loader2 className="animate-spin" size={22} />
        </div>
      ) : visibleProducts.length === 0 ? (
        <div className="border border-black/10 bg-white px-6 py-16 text-center">
          <p className="font-serif text-2xl">No products found.</p>
          <p className="mt-2 text-sm text-black/50">
            Add a product or adjust the search.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-black/10 bg-white">
          <table className="w-full min-w-[920px] border-collapse text-left">
            <thead>
              <tr className="border-b border-black/10 bg-[#f5f1e8] text-[10px] uppercase tracking-[0.16em] text-black/45">
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Featured</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {visibleProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-black/10 last:border-0"
                >
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 shrink-0 overflow-hidden bg-[#e7e2d8]">
                        {product.image_path ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.image_path}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div>
                        <p className="font-serif text-lg">{product.name}</p>
                        <p className="mt-1 text-xs text-black/40">
                          {product.size} · {product.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-5 text-sm">
                    {product.category_label}
                  </td>

                  <td className="px-5 py-5 text-sm font-semibold">
                    KSh {Number(product.price).toLocaleString()}
                  </td>

                  <td className="px-5 py-5">
                    <button
                      type="button"
                      onClick={() => void toggleActive(product)}
                      className={`inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                        product.active ? "text-green-800" : "text-black/35"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          product.active ? "bg-green-700" : "bg-black/25"
                        }`}
                      />
                      {product.active ? "Active" : "Inactive"}
                    </button>
                  </td>

                  <td className="px-5 py-5">
                    <button
                      type="button"
                      onClick={() => void toggleFeatured(product)}
                      aria-label={
                        product.featured
                          ? "Remove featured status"
                          : "Make featured"
                      }
                      className="text-black/35 transition hover:text-black"
                    >
                      <Star
                        size={17}
                        fill={product.featured ? "currentColor" : "none"}
                      />
                    </button>
                  </td>

                  <td className="px-5 py-5 text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(product)}
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
          <div className="mx-auto max-w-4xl bg-[#f5f1e8]">
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-5 md:px-8">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">
                  {editingId ? "Edit catalogue item" : "New catalogue item"}
                </p>
                <h2 className="mt-1 font-serif text-3xl">
                  {editingId ? form.name || "Product" : "Add product"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="border border-black/15 p-2"
                aria-label="Close editor"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-7 p-6 md:p-8">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Product name">
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
                  <div className="relative">
                    <select
                      value={form.category}
                      onChange={(event) => {
                        const value = event.target.value;
                        const label =
                          categories.find(([key]) => key === value)?.[1] ??
                          value;
                        setForm((current) => ({
                          ...current,
                          category: value,
                          category_label: label,
                        }));
                      }}
                      className={inputClass}
                    >
                      {categories.map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                    />
                  </div>
                </Field>

                <Field label="Price (KSh)">
                  <input
                    required
                    min="0"
                    type="number"
                    value={form.price}
                    onChange={(event) =>
                      updateField("price", Number(event.target.value))
                    }
                    className={inputClass}
                  />
                </Field>

                <Field label="Size">
                  <input
                    value={form.size}
                    onChange={(event) =>
                      updateField("size", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>

                <Field label="Tone">
                  <input
                    value={form.tone ?? ""}
                    onChange={(event) =>
                      updateField("tone", event.target.value || null)
                    }
                    placeholder="pineapple / beet / mango..."
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="Description">
                <textarea
                  required
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  rows={3}
                  className={inputClass}
                />
              </Field>

              <Field label="Note">
                <textarea
                  required
                  value={form.note}
                  onChange={(event) => updateField("note", event.target.value)}
                  rows={2}
                  className={inputClass}
                />
              </Field>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Preparation">
                  <input
                    value={form.preparation}
                    onChange={(event) =>
                      updateField("preparation", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>

                <Field label="Freshness">
                  <input
                    value={form.freshness}
                    onChange={(event) =>
                      updateField("freshness", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>

                <Field label="Additives">
                  <input
                    value={form.additives}
                    onChange={(event) =>
                      updateField("additives", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>

                <Field label="Concentrate">
                  <input
                    value={form.concentrate}
                    onChange={(event) =>
                      updateField("concentrate", event.target.value)
                    }
                    className={inputClass}
                  />
                </Field>

                <Field label="Image path">
                  <input
                    value={form.image_path ?? ""}
                    onChange={(event) =>
                      updateField("image_path", event.target.value || null)
                    }
                    placeholder="/images/products/example.jpg"
                    className={inputClass}
                  />
                </Field>

                <Field label="Video path">
                  <input
                    value={form.video_path ?? ""}
                    onChange={(event) =>
                      updateField("video_path", event.target.value || null)
                    }
                    placeholder="/videos/juice/example.mp4"
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="flex flex-wrap gap-5 border-y border-black/10 py-5">
                <Toggle
                  label="Active"
                  checked={form.active}
                  onChange={(value) => updateField("active", value)}
                />
                <Toggle
                  label="Featured"
                  checked={form.featured}
                  onChange={(value) => updateField("featured", value)}
                />
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
                  {editingId ? "Save changes" : "Create product"}
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

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em]"
    >
      <span
        className={`flex h-5 w-5 items-center justify-center border ${
          checked ? "border-black bg-black text-white" : "border-black/20"
        }`}
      >
        {checked && <Check size={12} />}
      </span>
      {label}
    </button>
  );
}
