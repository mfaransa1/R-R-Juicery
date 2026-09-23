import { createClient } from "@/lib/supabase/client";

export type PublicTraceability = {
  batch: {
    id: string;
    batch_code: string;
    production_date: string | null;
    use_by_date: string | null;
    status: string;
    notes: string | null;
  };
  product: {
    id: string;
    name: string;
    slug: string;
    category_label: string;
    size: string;
  } | null;
  ingredient: {
    id: string;
    name: string;
    origin: string | null;
    source: string | null;
    organic_status: string;
  } | null;
  supplier: {
    id: string;
    name: string;
  } | null;
  events: Array<{
    id: string;
    event_type: string;
    description: string | null;
    created_at: string;
  }>;
};

export async function getPublicTraceability(batchCode: string) {
  const supabase = createClient();

  const { data: batch, error: batchError } = await supabase
    .from("batches")
    .select(`
      id,
      batch_code,
      production_date,
      use_by_date,
      status,
      notes,
      product:products(id,name,slug,category_label,size),
      ingredient:ingredients(id,name,origin,source,organic_status),
      supplier:suppliers(id,name)
    `)
    .eq("batch_code", batchCode)
    .in("status", ["completed", "released", "ready"])
    .single();

  if (batchError) throw batchError;

  const { data: events, error: eventError } = await supabase
    .from("batch_traceability_events")
    .select("id,event_type,description,created_at")
    .eq("batch_id", batch.id)
    .order("created_at", { ascending: true });

  if (eventError) throw eventError;

  return {
    batch: {
      id: batch.id,
      batch_code: batch.batch_code,
      production_date: batch.production_date,
      use_by_date: batch.use_by_date,
      status: batch.status,
      notes: batch.notes,
    },
    product: Array.isArray(batch.product) ? batch.product[0] ?? null : batch.product,
    ingredient: Array.isArray(batch.ingredient) ? batch.ingredient[0] ?? null : batch.ingredient,
    supplier: Array.isArray(batch.supplier) ? batch.supplier[0] ?? null : batch.supplier,
    events: events ?? [],
  } as PublicTraceability;
}
