import { createClient } from "@/lib/supabase/client";

export type AdminBatch = {
  id: string;
  batch_code: string;
  product_id: string | null;
  production_run_id: string | null;
  status: string | null;
  created_at: string;
  production_date: string | null;
  output_quantity: number | null;
  output_unit: string | null;
};

export type BatchProduct = {
  id: string;
  name: string;
  slug: string;
  image_path: string | null;
};

const supabase = createClient();

function message(error: { message?: string; details?: string; hint?: string; code?: string }) {
  return [
    error.message || "Supabase request failed.",
    error.details ? `Details: ${error.details}` : "",
    error.hint ? `Hint: ${error.hint}` : "",
    error.code ? `Code: ${error.code}` : "",
  ].filter(Boolean).join(" ");
}

export async function getAdminBatches(): Promise<AdminBatch[]> {
  const { data, error } = await supabase
    .from("batches")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(message(error));

  return (data ?? []) as AdminBatch[];
}

export async function getBatchProducts(ids: string[]): Promise<BatchProduct[]> {
  const productIds = [...new Set(ids.filter(Boolean))];
  if (!productIds.length) return [];

  const { data, error } = await supabase
    .from("products")
    .select("id,name,slug,image_path")
    .in("id", productIds);

  if (error) throw new Error(message(error));

  return (data ?? []) as BatchProduct[];
}
