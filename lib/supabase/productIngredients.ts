import { createClient } from "@/lib/supabase/client";

export type ProductIngredientStatus =
  | "verified_organic"
  | "supplier_claimed"
  | "conventional"
  | "unknown";

export type IngredientOption = {
  id: string;
  name: string;
  slug: string;
};

export type ProductIngredientRow = {
  id: string;
  product_id: string;
  ingredient_id: string;
  amount: string | null;
  organic_status: ProductIngredientStatus;
  source: string | null;
  ingredient: IngredientOption | null;
};

export type ProductIngredientInput = {
  ingredient_id: string;
  amount?: string | null;
  organic_status: ProductIngredientStatus;
  source?: string | null;
};

const supabase = createClient();

function clean(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function getErrorMessage(error: {
  message?: string;
  details?: string;
  hint?: string;
  code?: string;
}) {
  return [
    error.message || "Supabase request failed.",
    error.details ? `Details: ${error.details}` : "",
    error.hint ? `Hint: ${error.hint}` : "",
    error.code ? `Code: ${error.code}` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function normalizeIngredientRelation(
  ingredient:
    | IngredientOption
    | IngredientOption[]
    | null
    | undefined,
): IngredientOption | null {
  if (!ingredient) {
    return null;
  }

  if (Array.isArray(ingredient)) {
    return ingredient[0] ?? null;
  }

  return ingredient;
}

export async function getIngredientOptions(): Promise<IngredientOption[]> {
  const { data, error } = await supabase
    .from("ingredients")
    .select("id, name, slug")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(getErrorMessage(error));
  }

  return (data ?? []) as IngredientOption[];
}

export async function getProductIngredients(
  productId: string,
): Promise<ProductIngredientRow[]> {
  if (!productId) {
    throw new Error("Product ID is missing.");
  }

  const { data, error } = await supabase
    .from("product_ingredients")
    .select(`
      id,
      product_id,
      ingredient_id,
      amount,
      organic_status,
      source,
      ingredient:ingredients (
        id,
        name,
        slug
      )
    `)
    .eq("product_id", productId)
    .order("id", { ascending: true });

  if (error) {
    throw new Error(getErrorMessage(error));
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    product_id: row.product_id,
    ingredient_id: row.ingredient_id,
    amount: row.amount,
    organic_status: row.organic_status as ProductIngredientStatus,
    source: row.source,
    ingredient: normalizeIngredientRelation(row.ingredient),
  }));
}

export async function replaceProductIngredients(
  productId: string,
  rows: ProductIngredientInput[],
): Promise<ProductIngredientRow[]> {
  if (!productId) {
    throw new Error("Product ID is missing.");
  }

  const unique = new Map<string, ProductIngredientInput>();

  for (const row of rows) {
    if (!row.ingredient_id) {
      continue;
    }

    unique.set(row.ingredient_id, {
      ingredient_id: row.ingredient_id,
      amount: clean(row.amount),
      organic_status: row.organic_status,
      source: clean(row.source),
    });
  }

  const normalized = [...unique.values()];

  const { error: deleteError } = await supabase
    .from("product_ingredients")
    .delete()
    .eq("product_id", productId);

  if (deleteError) {
    throw new Error(getErrorMessage(deleteError));
  }

  if (normalized.length === 0) {
    return [];
  }

  const payload = normalized.map((row) => ({
    product_id: productId,
    ingredient_id: row.ingredient_id,
    amount: row.amount,
    organic_status: row.organic_status,
    source: row.source,
  }));

  const { data, error: insertError } = await supabase
    .from("product_ingredients")
    .insert(payload)
    .select(`
      id,
      product_id,
      ingredient_id,
      amount,
      organic_status,
      source,
      ingredient:ingredients (
        id,
        name,
        slug
      )
    `);

  if (insertError) {
    throw new Error(getErrorMessage(insertError));
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    product_id: row.product_id,
    ingredient_id: row.ingredient_id,
    amount: row.amount,
    organic_status: row.organic_status as ProductIngredientStatus,
    source: row.source,
    ingredient: normalizeIngredientRelation(row.ingredient),
  }));
}