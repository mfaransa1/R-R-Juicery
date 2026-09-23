import { createClient } from "@/lib/supabase/client";

export type ProductionStatus =
  | "queued"
  | "in_progress"
  | "quality_check"
  | "ready"
  | "completed"
  | "cancelled";

export type ProductionRun = {
  id: string;
  batch_id: string | null;
  product_id: string | null;
  order_id: string | null;
  status: ProductionStatus;
  planned_quantity: number | null;
  produced_quantity: number | null;
  unit: string | null;
  started_at: string | null;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  product?: { name: string; slug: string } | null;
  batch?: { batch_code: string; production_date: string | null; status: string } | null;
};

export async function getProductionRuns() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("production_runs")
    .select(`
      id,
      batch_id,
      product_id,
      order_id,
      status,
      planned_quantity,
      produced_quantity,
      unit,
      started_at,
      completed_at,
      notes,
      created_at,
      updated_at,
      product:products(name,slug),
      batch:batches(batch_code,production_date,status)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as ProductionRun[];
}

export async function createProductionRun(input: {
  productId: string;
  batchId?: string | null;
  orderId?: string | null;
  plannedQuantity?: number | null;
  unit?: string | null;
  notes?: string | null;
}) {
  const supabase = createClient();

  const { data: userData } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("production_runs")
    .insert({
      product_id: input.productId,
      batch_id: input.batchId ?? null,
      order_id: input.orderId ?? null,
      planned_quantity: input.plannedQuantity ?? null,
      unit: input.unit ?? "bottles",
      notes: input.notes ?? null,
      created_by: userData.user?.id ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProductionRun(
  id: string,
  input: Partial<{
    status: ProductionStatus;
    batch_id: string | null;
    planned_quantity: number | null;
    produced_quantity: number | null;
    unit: string | null;
    notes: string | null;
    started_at: string | null;
    completed_at: string | null;
  }>,
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("production_runs")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function addProductionConsumption(input: {
  productionRunId: string;
  inventoryItemId?: string | null;
  ingredientId?: string | null;
  quantity: number;
  unit: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("production_consumption")
    .insert({
      production_run_id: input.productionRunId,
      inventory_item_id: input.inventoryItemId ?? null,
      ingredient_id: input.ingredientId ?? null,
      quantity: input.quantity,
      unit: input.unit,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function addTraceabilityEvent(input: {
  batchId: string;
  eventType: string;
  description?: string;
  metadata?: Record<string, unknown>;
}) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("batch_traceability_events")
    .insert({
      batch_id: input.batchId,
      event_type: input.eventType,
      description: input.description ?? null,
      actor_id: userData.user?.id ?? null,
      metadata: input.metadata ?? {},
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
