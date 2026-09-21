import { createClient } from "@/lib/supabase/client";

export type BatchRecord = {
  id: string;
  batch_code: string;
  product_id: string | null;
  production_date: string;
  preparation_method: string | null;
  storage: string | null;
  freshness: string | null;
  notes: string | null;
  created_at: string;
  product?: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

export type ProductOption = {
  id: string;
  name: string;
  slug: string;
};

export type BatchInput = {
  batch_code: string;
  product_id?: string | null;
  production_date: string;
  preparation_method?: string | null;
  storage?: string | null;
  freshness?: string | null;
  notes?: string | null;
};

const supabase = createClient();

function clean(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function errorMessage(error: {
  message?: string;
  details?: string;
  hint?: string;
  code?: string;
}) {
  if (error.code === "23505") {
    return `That batch code already exists. Please use a unique batch code.`;
  }

  return [
    error.message || "Supabase request failed.",
    error.details ? `Details: ${error.details}` : "",
    error.hint ? `Hint: ${error.hint}` : "",
    error.code ? `Code: ${error.code}` : "",
  ].filter(Boolean).join(" ");
}

function normalizeProduct(
  product:
    | { id: string; name: string; slug: string }
    | { id: string; name: string; slug: string }[]
    | null
    | undefined,
) {
  if (!product) return null;
  return Array.isArray(product) ? product[0] ?? null : product;
}

function normalize(row: any): BatchRecord {
  return {
    id: row.id,
    batch_code: row.batch_code,
    product_id: row.product_id,
    production_date: row.production_date,
    preparation_method: row.preparation_method,
    storage: row.storage,
    freshness: row.freshness,
    notes: row.notes,
    created_at: row.created_at,
    product: normalizeProduct(row.product),
  };
}

export async function getBatches(): Promise<BatchRecord[]> {
  const { data, error } = await supabase
    .from("batches")
    .select(`
      id,
      batch_code,
      product_id,
      production_date,
      preparation_method,
      storage,
      freshness,
      notes,
      created_at,
      product:products (
        id,
        name,
        slug
      )
    `)
    .order("production_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(errorMessage(error));

  return (data ?? []).map(normalize);
}

export async function getBatchProductOptions(): Promise<ProductOption[]> {
  const { data, error } = await supabase
    .from("products")
    .select("id,name,slug")
    .order("name", { ascending: true });

  if (error) throw new Error(errorMessage(error));

  return (data ?? []) as ProductOption[];
}

export async function createBatch(input: BatchInput): Promise<BatchRecord> {
  if (!input.batch_code.trim()) {
    throw new Error("Batch code is required.");
  }

  if (!input.production_date) {
    throw new Error("Production date is required.");
  }

  const payload = {
    batch_code: input.batch_code.trim(),
    product_id: clean(input.product_id),
    production_date: input.production_date,
    preparation_method: clean(input.preparation_method),
    storage: clean(input.storage),
    freshness: clean(input.freshness),
    notes: clean(input.notes),
  };

  const { data, error } = await supabase
    .from("batches")
    .insert(payload)
    .select(`
      id,
      batch_code,
      product_id,
      production_date,
      preparation_method,
      storage,
      freshness,
      notes,
      created_at,
      product:products (
        id,
        name,
        slug
      )
    `)
    .single();

  if (error) throw new Error(errorMessage(error));

  return normalize(data);
}

export async function updateBatch(
  id: string,
  input: BatchInput,
): Promise<BatchRecord> {
  if (!id) throw new Error("Batch ID is missing.");

  const payload = {
    batch_code: input.batch_code.trim(),
    product_id: clean(input.product_id),
    production_date: input.production_date,
    preparation_method: clean(input.preparation_method),
    storage: clean(input.storage),
    freshness: clean(input.freshness),
    notes: clean(input.notes),
  };

  const { data, error } = await supabase
    .from("batches")
    .update(payload)
    .eq("id", id)
    .select(`
      id,
      batch_code,
      product_id,
      production_date,
      preparation_method,
      storage,
      freshness,
      notes,
      created_at,
      product:products (
        id,
        name,
        slug
      )
    `)
    .single();

  if (error) throw new Error(errorMessage(error));

  return normalize(data);
}

export async function deleteBatch(id: string) {
  const { error } = await supabase
    .from("batches")
    .delete()
    .eq("id", id);

  if (error) throw new Error(errorMessage(error));
}
