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
  product: { name: string; slug: string } | null;
  batch: { batch_code: string; production_date: string | null; status: string } | null;
  order: { order_number: string | null; status: string; total: number } | null;
};

export type InventoryItem = {
  id: string;
  ingredient_id: string | null;
  quantity: number;
  unit: string;
  reorder_level: number | null;
  ingredient: { name: string } | null;
};

export type Option = {
  id: string;
  name: string;
  slug?: string;
  status?: string;
};

export async function getProductionOperations() {
  const supabase = createClient();

  const [runsResult, productsResult, ordersResult, inventoryResult] =
    await Promise.all([
      supabase
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
          batch:batches(batch_code,production_date,status),
          order:orders(order_number,status,total)
        `)
        .order("created_at", { ascending: false }),

      supabase
        .from("products")
        .select("id,name,slug")
        .eq("active", true)
        .order("name", { ascending: true }),

      supabase
        .from("orders")
        .select("id,order_number,status,total")
        .in("status", ["confirmed", "preparing", "pressing", "ready"])
        .order("created_at", { ascending: false })
        .limit(100),

      supabase
        .from("inventory_items")
        .select(`
          id,
          ingredient_id,
          quantity,
          unit,
          reorder_level,
          ingredient:ingredients(name)
        `)
        .order("quantity", { ascending: true }),
    ]);

  if (runsResult.error) throw runsResult.error;
  if (productsResult.error) throw productsResult.error;
  if (ordersResult.error) throw ordersResult.error;
  if (inventoryResult.error) throw inventoryResult.error;

  const products: Option[] = (productsResult.data ?? []).map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
  }));

  const orders: Option[] = (ordersResult.data ?? []).map((order) => ({
    id: order.id,
    name: order.order_number ?? `Order ${order.id.slice(0, 8)}`,
    status: order.status,
  }));

  return {
    runs: (runsResult.data ?? []) as unknown as ProductionRun[],
    products,
    orders,
    inventory: (inventoryResult.data ?? []) as unknown as InventoryItem[],
  };
}

export async function createProductionRun(input: {
  productId: string;
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

export async function advanceProductionRun(
  productionRunId: string,
  status: ProductionStatus,
) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("advance_production_run", {
    p_production_run_id: productionRunId,
    p_status: status,
  });

  if (error) throw error;
  return data;
}

export async function consumeInventoryForProduction(input: {
  productionRunId: string;
  inventoryItemId: string;
  quantity: number;
  unit: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc(
    "consume_inventory_for_production",
    {
      p_production_run_id: input.productionRunId,
      p_inventory_item_id: input.inventoryItemId,
      p_quantity: input.quantity,
      p_unit: input.unit,
    },
  );

  if (error) throw error;
  return data;
}

export async function createBatchFromProduction(input: {
  productionRunId: string;
  batchCode: string;
  productionDate?: string;
  useByDate?: string | null;
  notes?: string | null;
}) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("create_production_batch", {
    p_production_run_id: input.productionRunId,
    p_batch_code: input.batchCode,
    p_production_date:
      input.productionDate ?? new Date().toISOString().slice(0, 10),
    p_use_by_date: input.useByDate ?? null,
    p_notes: input.notes ?? null,
  });

  if (error) throw error;
  return data as string;
}

export async function getProductionConsumption(productionRunId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("production_consumption")
    .select(`
      id,
      production_run_id,
      inventory_item_id,
      ingredient_id,
      quantity,
      unit,
      created_at,
      ingredient:ingredients(name)
    `)
    .eq("production_run_id", productionRunId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
