import { createClient } from "@/lib/supabase/client";

export type TraceabilityBatch = {
  id: string;
  batch_code: string | null;
  product: {
    id: string;
    name: string;
    slug: string;
  } | null;
  ingredient: {
    id: string;
    name: string;
  } | null;
  supplier: {
    id: string;
    name: string;
  } | null;
  production_date: string | null;
  use_by_date: string | null;
  status: string | null;
};

type BatchRow = {
  id: string;
  batch_code: string | null;
  product_id: string | null;
  production_date: string | null;
  use_by_date: string | null;
  status: string | null;
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
};

type ProductionRunRow = {
  id: string;
  batch_id: string | null;
};

type ConsumptionRow = {
  production_run_id: string;
  ingredient_id: string | null;
  supplier_id: string | null;
};

type IngredientRow = {
  id: string;
  name: string;
};

type SupplierRow = {
  id: string;
  name: string;
};

/**
 * Loads batches and reconstructs their traceability chain
 * without relying on the older Phase 2 relational query.
 *
 * Chain:
 *
 * Batch
 *   ↓
 * Product
 *   ↓
 * Production Run
 *   ↓
 * Production Consumption
 *   ↓
 * Ingredient
 *   ↓
 * Supplier
 */
export async function getAdminTraceabilityBatches(): Promise<
  TraceabilityBatch[]
> {
  const supabase = createClient();

  // ---------------------------------------------------------
  // 1. Load batches
  // ---------------------------------------------------------

  const { data: batchData, error: batchError } = await supabase
    .from("batches")
    .select(
      `
        id,
        batch_code,
        product_id,
        production_date,
        use_by_date,
        status
      `,
    )
    .order("production_date", {
      ascending: false,
      nullsFirst: false,
    });

  if (batchError) {
    throw new Error(
      `Unable to load batches: ${batchError.message}`,
    );
  }

  const batches = (batchData ?? []) as BatchRow[];

  if (batches.length === 0) {
    return [];
  }

  // ---------------------------------------------------------
  // 2. Load products
  // ---------------------------------------------------------

  const productIds = [
    ...new Set(
      batches
        .map((batch) => batch.product_id)
        .filter((id): id is string => Boolean(id)),
    ),
  ];

  let products: ProductRow[] = [];

  if (productIds.length > 0) {
    const { data, error } = await supabase
      .from("products")
      .select("id,name,slug")
      .in("id", productIds);

    if (error) {
      throw new Error(
        `Unable to load batch products: ${error.message}`,
      );
    }

    products = (data ?? []) as ProductRow[];
  }

  const productMap = new Map(
    products.map((product) => [product.id, product]),
  );

  // ---------------------------------------------------------
  // 3. Load production runs belonging to these batches
  // ---------------------------------------------------------

  const batchIds = batches.map((batch) => batch.id);

  const { data: productionRunData, error: productionRunError } =
    await supabase
      .from("production_runs")
      .select("id,batch_id")
      .in("batch_id", batchIds);

  if (productionRunError) {
    throw new Error(
      `Unable to load production runs: ${productionRunError.message}`,
    );
  }

  const productionRuns = (productionRunData ??
    []) as ProductionRunRow[];

  const productionRunIds = productionRuns.map(
    (run) => run.id,
  );

  const productionRunsByBatch = new Map<string, string[]>();

  for (const run of productionRuns) {
    if (!run.batch_id) continue;

    const existing =
      productionRunsByBatch.get(run.batch_id) ?? [];

    existing.push(run.id);

    productionRunsByBatch.set(run.batch_id, existing);
  }

  // ---------------------------------------------------------
  // 4. Load actual ingredient consumption
  // ---------------------------------------------------------

  let consumption: ConsumptionRow[] = [];

  if (productionRunIds.length > 0) {
    const { data, error } = await supabase
      .from("production_consumption")
      .select(
        `
          production_run_id,
          ingredient_id,
          supplier_id
        `,
      )
      .in("production_run_id", productionRunIds)
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      throw new Error(
        `Unable to load production consumption: ${error.message}`,
      );
    }

    consumption = (data ?? []) as ConsumptionRow[];
  }

  // ---------------------------------------------------------
  // 5. Get ingredient IDs and supplier IDs
  // ---------------------------------------------------------

  const ingredientIds = [
    ...new Set(
      consumption
        .map((item) => item.ingredient_id)
        .filter((id): id is string => Boolean(id)),
    ),
  ];

  const supplierIds = [
    ...new Set(
      consumption
        .map((item) => item.supplier_id)
        .filter((id): id is string => Boolean(id)),
    ),
  ];

  // ---------------------------------------------------------
  // 6. Load ingredients
  // ---------------------------------------------------------

  let ingredients: IngredientRow[] = [];

  if (ingredientIds.length > 0) {
    const { data, error } = await supabase
      .from("ingredients")
      .select("id,name")
      .in("id", ingredientIds);

    if (error) {
      throw new Error(
        `Unable to load ingredients: ${error.message}`,
      );
    }

    ingredients = (data ?? []) as IngredientRow[];
  }

  const ingredientMap = new Map(
    ingredients.map((ingredient) => [
      ingredient.id,
      ingredient,
    ]),
  );

  // ---------------------------------------------------------
  // 7. Load suppliers
  // ---------------------------------------------------------

  let suppliers: SupplierRow[] = [];

  if (supplierIds.length > 0) {
    const { data, error } = await supabase
      .from("suppliers")
      .select("id,name")
      .in("id", supplierIds);

    if (error) {
      throw new Error(
        `Unable to load suppliers: ${error.message}`,
      );
    }

    suppliers = (data ?? []) as SupplierRow[];
  }

  const supplierMap = new Map(
    suppliers.map((supplier) => [
      supplier.id,
      supplier,
    ]),
  );

  // ---------------------------------------------------------
  // 8. Group consumption by production run
  // ---------------------------------------------------------

  const consumptionByRun = new Map<
    string,
    ConsumptionRow[]
  >();

  for (const item of consumption) {
    const existing =
      consumptionByRun.get(item.production_run_id) ?? [];

    existing.push(item);

    consumptionByRun.set(
      item.production_run_id,
      existing,
    );
  }

  // ---------------------------------------------------------
  // 9. Build traceability records
  //
  // A batch may contain multiple ingredients.
  // The current admin table shows one row per batch and
  // uses the first linked ingredient/supplier as a summary.
  // The detailed public trace remains the authoritative
  // place for the complete consumption chain.
  // ---------------------------------------------------------

  const result: TraceabilityBatch[] = [];

  for (const batch of batches) {
    const product = batch.product_id
      ? productMap.get(batch.product_id) ?? null
      : null;

    const runIds =
      productionRunsByBatch.get(batch.id) ?? [];

    const batchConsumption: ConsumptionRow[] = [];

    for (const runId of runIds) {
      const runConsumption =
        consumptionByRun.get(runId) ?? [];

      batchConsumption.push(...runConsumption);
    }

    const firstConsumption = batchConsumption[0];

    const ingredient = firstConsumption?.ingredient_id
      ? ingredientMap.get(
          firstConsumption.ingredient_id,
        ) ?? null
      : null;

    const supplier = firstConsumption?.supplier_id
      ? supplierMap.get(
          firstConsumption.supplier_id,
        ) ?? null
      : null;

    result.push({
      id: batch.id,
      batch_code: batch.batch_code,
      product,
      ingredient,
      supplier,
      production_date: batch.production_date,
      use_by_date: batch.use_by_date,
      status: batch.status,
    });
  }

  return result;
}