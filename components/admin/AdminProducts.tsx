"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Edit3,
  Image as ImageIcon,
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
  updateProductDetails,
} from "@/lib/supabase/products";
import { getAdminIngredients, type AdminIngredient } from "@/lib/supabase/ingredients";
import {
  getProductIngredients,
  saveProductIngredients,
} from "@/lib/supabase/productIngredients";
import ProductIngredientsEditor, {
  type EditableProductIngredient,
} from "@/components/admin/ProductIngredientsEditor";

const emptyProduct: ProductInput = {
  slug: "",
  name: "",
  category: "house-compositions",
  category_label: "The House Compositions",
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
  ["house-compositions", "The House Compositions"],
  ["cane", "The Cane"],
  ["interludes", "The Interludes"],
  ["blenders", "The Blenders"],
  ["seasonal-records", "The Seasonal Records"],
] as const;

const sizes = ["250ml", "350ml", "500ml", "750ml", "1L"];
const tones = [
  "Pineapple",
  "Cucumber",
  "Beetroot",
  "Mango",
  "Watermelon",
  "Passion",
  "Sugarcane",
  "Mint",
  "Citrus",
  "Seasonal",
];
const preparationOptions = [
  "Freshly prepared and pressed",
  "Freshly prepared",
  "Fresh sugarcane pressed to order",
  "Blended fresh",
  "Prepared to order",
  "REQUIRED INPUT",
];
const freshnessOptions = [
  "Prepared close to service",
  "Prepared to order",
  "Same-day preparation",
  "Chilled after preparation",
  "REQUIRED INPUT",
];
const additivesOptions = [
  "No unnecessary additives",
  "No added sweeteners",
  "Contains added ingredients — see details",
  "REQUIRED INPUT",
];
const concentrateOptions = [
  "No concentrate",
  "Contains concentrate — see details",
  "Unknown / verify",
  "REQUIRED INPUT",
];

type ProductEditorForm = ProductInput & {
  detailed_description: string;
  health_benefits: string;
};

const emptyEditor: ProductEditorForm = {
  ...emptyProduct,
  detailed_description: "",
  health_benefits: "",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function requiredInput(value: string) {
  return !value.trim() || value.trim().toUpperCase() === "REQUIRED INPUT";
}

export default function AdminProducts() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [ingredients, setIngredients] = useState<AdminIngredient[]>([]);
  const [recipeRows, setRecipeRows] = useState<EditableProductIngredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductEditorForm>(emptyEditor);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadProducts() {
    setLoading(true);
    setError("");
    try {
      const data = await getAdminProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }

  async function loadIngredients() {
    try {
      setIngredients(await getAdminIngredients());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load ingredients.");
    }
  }

  useEffect(() => {
    void Promise.all([loadProducts(), loadIngredients()]);
  }, []);

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch = !query || [product.name, product.slug, product.category_label]
        .join(" ")
        .toLowerCase()
        .includes(query);
      return matchesSearch && (showInactive || product.active);
    });
  }, [products, search, showInactive]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyEditor);
    setRecipeRows([]);
    setError("");
    setNotice("");
    setEditorOpen(true);
  }

  async function openEdit(product: AdminProduct) {
    setEditingId(product.id);
    setForm({
      slug: product.slug,
      name: product.name,
      category: product.category,
      category_label: product.category_label,
      description: product.description,
      detailed_description: product.detailed_description ?? "",
      note: product.note,
      price: Number(product.price),
      size: product.size,
      preparation: product.preparation,
      freshness: product.freshness,
      additives: product.additives,
      concentrate: product.concentrate,
      health_benefits: (product.health_benefits ?? []).join("\n"),
      featured: product.featured,
      tone: product.tone,
      image_path: product.image_path,
      video_path: product.video_path,
      active: product.active,
    });
    setError("");
    setNotice("");
    setRecipeRows([]);
    setEditorOpen(true);

    try {
      const rows = await getProductIngredients(product.id);
      setRecipeRows(
        rows.map((row) => ({
          ingredient_id: row.ingredient_id,
          quantity: row.quantity === null ? "" : String(row.quantity),
          unit: row.unit ?? "g",
        })),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load product ingredients.");
    }
  }

  function updateField<K extends keyof ProductEditorForm>(key: K, value: ProductEditorForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function validate(): string | null {
    if (!form.name.trim()) return "Product name is required.";
    if (!form.slug.trim()) return "Slug is required.";
    if (!form.price || Number(form.price) <= 0) return "A valid price is required.";
    if (!form.category) return "Category is required.";
    if (!form.size.trim()) return "Size is required.";
    if (!form.description.trim()) return "Description is required.";
    if (!form.image_path?.trim()) return "Product image is required before saving.";
    if (!recipeRows.length) return "Add at least one ingredient before saving.";
    if (recipeRows.some((row) => !row.ingredient_id)) return "Every ingredient row must have an ingredient selected.";
    if (form.active) {
      if (requiredInput(form.preparation)) return "Active products need preparation information.";
      if (requiredInput(form.freshness)) return "Active products need freshness information.";
      if (requiredInput(form.additives)) return "Active products need additives information.";
      if (requiredInput(form.concentrate)) return "Active products need concentrate information.";
    }
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);

    try {
      const payload: ProductInput = {
        slug: form.slug || slugify(form.name),
        name: form.name.trim(),
        category: form.category,
        category_label: form.category_label,
        description: form.description.trim(),
        note: form.note.trim(),
        price: Number(form.price),
        size: form.size,
        preparation: form.preparation,
        freshness: form.freshness,
        additives: form.additives,
        concentrate: form.concentrate,
        featured: form.featured,
        tone: form.tone,
        image_path: form.image_path?.trim() || null,
        video_path: form.video_path?.trim() || null,
        // A product is assembled as a draft first. It is published only
        // after the recipe and detail records have been saved.
        active: false,
      };

      const saved = editingId
        ? await updateAdminProduct(editingId, payload)
        : await createAdminProduct(payload);

      await updateProductDetails(saved.id, {
        detailed_description: form.detailed_description.trim() || null,
        health_benefits: form.health_benefits
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      });

      await saveProductIngredients(
        saved.id,
        recipeRows.map((row, index) => ({
          ingredient_id: row.ingredient_id,
          quantity: row.quantity.trim() === "" ? null : Number(row.quantity),
          unit: row.unit.trim() || null,
          sort_order: index,
        })),
      );

      if (form.active) {
        await setProductActive(saved.id, true);
      }

      await loadProducts();
      setNotice(editingId ? "Product and recipe updated." : "Product and recipe created.");
      setEditorOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save the product.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(product: AdminProduct) {
    setError("");
    try {
      await setProductActive(product.id, !product.active);
      setProducts((current) => current.map((item) => item.id === product.id ? { ...item, active: !item.active } : item));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update product.");
    }
  }

  async function toggleFeatured(product: AdminProduct) {
    setError("");
    try {
      await setProductFeatured(product.id, !product.featured);
      setProducts((current) => current.map((item) => item.id === product.id ? { ...item, featured: !item.featured } : item));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update product.");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 border-b border-black/10 pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-black/45">Catalogue</p>
          <h1 className="font-serif text-4xl tracking-[-0.03em] text-black md:text-5xl">Products</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/55">Build a juice from one admin workflow — product, media, recipe, transparency and publishing.</p>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex items-center justify-center gap-2 bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] !text-white hover:bg-black/80">
          <Plus size={15} /> Add product
        </button>
      </div>

      {error && <div className="border border-red-900/20 bg-red-50 px-4 py-3 text-sm text-red-900">{error}</div>}
      {notice && <div className="flex items-center justify-between border border-black/10 bg-white px-4 py-3 text-sm"><span>{notice}</span><button type="button" onClick={() => setNotice("")} aria-label="Dismiss"><X size={16} /></button></div>}

      <div className="flex flex-col gap-3 border-y border-black/10 py-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/35" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products..." className={inputClass + " pl-10"} />
        </div>
        <button type="button" onClick={() => setShowInactive((value) => !value)} className="border border-black/15 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em]">{showInactive ? "Showing all" : "Active only"}</button>
        <button type="button" onClick={() => void Promise.all([loadProducts(), loadIngredients()])} className="inline-flex items-center justify-center gap-2 border border-black/15 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em]"><RefreshCw size={14} /> Refresh</button>
      </div>

      {loading ? <div className="flex min-h-48 items-center justify-center border border-black/10 bg-white"><Loader2 className="animate-spin" size={22} /></div> : (
        <div className="overflow-x-auto border border-black/10 bg-white">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead><tr className="border-b border-black/10 bg-[#f5f1e8] text-[10px] uppercase tracking-[0.16em] text-black/45"><th className="px-5 py-4">Product</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Price</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Featured</th><th className="px-5 py-4 text-right">Actions</th></tr></thead>
            <tbody>
              {visibleProducts.map((product) => (
                <tr key={product.id} className="border-b border-black/10 last:border-0">
                  <td className="px-5 py-5"><div className="flex items-center gap-4"><div className="h-14 w-14 shrink-0 overflow-hidden bg-[#e7e2d8]">{product.image_path ? <img src={product.image_path} alt="" className="h-full w-full object-cover" /> : <ImageIcon className="m-auto mt-4 text-black/25" size={18} />}</div><div><p className="font-serif text-lg">{product.name}</p><p className="mt-1 text-xs text-black/40">{product.size} · {product.slug}</p></div></div></td>
                  <td className="px-5 py-5 text-sm">{product.category_label}</td>
                  <td className="px-5 py-5 text-sm font-semibold">KSh {Number(product.price).toLocaleString()}</td>
                  <td className="px-5 py-5"><button type="button" onClick={() => void toggleActive(product)} className={`inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${product.active ? "text-green-800" : "text-black/35"}`}><span className={`h-2 w-2 rounded-full ${product.active ? "bg-green-700" : "bg-black/25"}`} />{product.active ? "Active" : "Inactive"}</button></td>
                  <td className="px-5 py-5"><button type="button" onClick={() => void toggleFeatured(product)} className="text-black/35 transition hover:text-black" aria-label="Toggle featured"><Star size={17} fill={product.featured ? "currentColor" : "none"} /></button></td>
                  <td className="px-5 py-5 text-right"><button type="button" onClick={() => void openEdit(product)} className="inline-flex items-center gap-2 border border-black/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] hover:border-black"><Edit3 size={13} /> Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editorOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 md:p-8">
          <div className="mx-auto max-w-5xl bg-[#f5f1e8]">
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-5 md:px-8"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/40">{editingId ? "Edit catalogue item" : "New catalogue item"}</p><h2 className="mt-1 font-serif text-3xl">{editingId ? form.name || "Product" : "Create Product"}</h2></div><button type="button" onClick={() => setEditorOpen(false)} className="border border-black/15 p-2" aria-label="Close"><X size={18} /></button></div>

            <form onSubmit={handleSubmit} className="space-y-8 p-6 md:p-8">
              <div className="border-b border-black/10 pb-3"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">01 / Basic information</p></div>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Product name"><input required value={form.name} onChange={(event) => { const name = event.target.value; setForm((current) => ({ ...current, name, slug: current.slug || slugify(name) })); }} className={inputClass} /></Field>
                <Field label="Slug"><input required value={form.slug} onChange={(event) => updateField("slug", slugify(event.target.value))} className={inputClass} /></Field>
                <Field label="Category"><Select value={form.category} options={categories.map(([value, label]) => [value, label])} onChange={(value) => { const label = categories.find(([key]) => key === value)?.[1] ?? value; setForm((current) => ({ ...current, category: value, category_label: label })); }} /></Field>
                <Field label="Price (KSh)"><input required min="1" type="number" value={form.price || ""} onChange={(event) => updateField("price", Number(event.target.value))} className={inputClass} /></Field>
                <Field label="Size"><Select value={form.size} options={sizes.map((value) => [value, value])} onChange={(value) => updateField("size", value)} /></Field>
                <Field label="Tone"><Select value={form.tone ?? ""} options={tones.map((value) => [value.toLowerCase(), value])} onChange={(value) => updateField("tone", value || null)} placeholder="Select tone" /></Field>
              </div>

              <div className="border-b border-black/10 pb-3"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">02 / Story</p></div>
              <Field label="Short description"><textarea required value={form.description} onChange={(event) => updateField("description", event.target.value)} rows={3} className={inputClass} /></Field>
              <Field label="Product note"><textarea required value={form.note} onChange={(event) => updateField("note", event.target.value)} rows={2} className={inputClass} /></Field>
              <Field label="Detailed product story"><textarea value={form.detailed_description} onChange={(event) => updateField("detailed_description", event.target.value)} rows={6} placeholder="The longer story customers see on the product page." className={inputClass} /></Field>

              <div className="border-b border-black/10 pb-3"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">03 / Media</p></div>
              <div className="grid gap-5 md:grid-cols-2"><Field label="Image path"><input required value={form.image_path ?? ""} onChange={(event) => updateField("image_path", event.target.value || null)} placeholder="Use the existing product image uploader or enter /images/products/..." className={inputClass} /></Field><Field label="Video path (optional)"><input value={form.video_path ?? ""} onChange={(event) => updateField("video_path", event.target.value || null)} placeholder="/videos/juice/example.mp4" className={inputClass} /></Field></div>

              <ProductIngredientsEditor ingredients={ingredients} rows={recipeRows} onChange={setRecipeRows} />

              <div className="border-b border-black/10 pb-3"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">05 / Transparency</p></div>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Preparation"><Select value={form.preparation} options={preparationOptions.map((value) => [value, value])} onChange={(value) => updateField("preparation", value)} /></Field>
                <Field label="Freshness"><Select value={form.freshness} options={freshnessOptions.map((value) => [value, value])} onChange={(value) => updateField("freshness", value)} /></Field>
                <Field label="Additives"><Select value={form.additives} options={additivesOptions.map((value) => [value, value])} onChange={(value) => updateField("additives", value)} /></Field>
                <Field label="Concentrate"><Select value={form.concentrate} options={concentrateOptions.map((value) => [value, value])} onChange={(value) => updateField("concentrate", value)} /></Field>
              </div>

              <div className="border-b border-black/10 pb-3"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">06 / Nutrition notes</p></div>
              <Field label="Verified general nutrition notes — one per line"><textarea value={form.health_benefits} onChange={(event) => updateField("health_benefits", event.target.value)} rows={5} placeholder="Example: Source of vitamin C\nContains naturally occurring fruit sugars" className={inputClass} /><p className="mt-2 text-[10px] leading-5 text-black/40">Use verified factual nutrition information only. Do not enter disease treatment, prevention or cure claims.</p></Field>

              <div className="border-y border-black/10 py-5"><div className="flex flex-wrap gap-5"><Toggle label="Active / publish" checked={form.active} onChange={(value) => updateField("active", value)} /><Toggle label="Featured" checked={form.featured} onChange={(value) => updateField("featured", value)} /></div><p className="mt-3 text-xs leading-5 text-black/45">Active products must have complete transparency fields and at least one connected ingredient.</p></div>

              <div className="flex flex-col-reverse gap-3 border-t border-black/10 pt-6 sm:flex-row sm:justify-end"><button type="button" onClick={() => setEditorOpen(false)} className="border border-black/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em]">Cancel</button><button disabled={saving} type="submit" className="inline-flex items-center justify-center gap-2 bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] !text-white disabled:opacity-50">{saving && <Loader2 size={15} className="animate-spin" />}{editingId ? "Save changes" : "Save & publish"}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inputClass = "w-full border border-black/15 bg-white px-3 py-3 text-sm outline-none focus:border-black";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-black/45">{label}</span>{children}</label>;
}

function Select({ value, options, onChange, placeholder }: { value: string; options: readonly (readonly [string, string])[]; onChange: (value: string) => void; placeholder?: string }) {
  return <div className="relative"><select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass + " appearance-none pr-10"}>{placeholder && <option value="">{placeholder}</option>}{options.map(([optionValue, label]) => <option key={optionValue} value={optionValue}>{label}</option>)}</select><ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" /></div>;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <button type="button" onClick={() => onChange(!checked)} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em]"><span className={`flex h-5 w-5 items-center justify-center border ${checked ? "border-black bg-black !text-white" : "border-black/20"}`}>{checked && <Check size={12} />}</span>{label}</button>;
}
