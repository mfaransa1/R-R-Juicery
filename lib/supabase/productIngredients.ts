import { createClient } from "@/lib/supabase/client";

export type IngredientOption = {
  id: string;
  name: string;
};

export type ProductIngredient = {
  product_id: string;
  ingredient_id: string;
  quantity: number | null;
  unit: string | null;
  ingredient: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    short_description: string | null;
    organic_status:
      | "verified_organic"
      | "supplier_claimed"
      | "conventional"
      | "unknown";
    source: string | null;
    origin: string | null;
    preparation: string | null;
    storage: string | null;
    seasonality: string | null;
    image_path: string | null;
    color: string | null;
  } | null;
};

export type ProductIngredientInput = {
  product_id: string;
  ingredient_id: string;
  quantity: number | null;
  unit: string | null;
};

type ProductIngredientRow = {
  product_id: string;
  ingredient_id: string;
  quantity: number | null;
  unit: string | null;
};

const supabase = createClient();

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

/**
 * Get the ingredient options used by the admin recipe editor.
 */
export async function getIngredientOptions(): Promise<IngredientOption[]> {
  const { data, error } = await supabase
    .from("ingredients")
    .select("id, name")
    .order("name");

  if (error) {
    throw new Error(
      `Unable to load ingredient options: ${getErrorMessage(error)}`,
    );
  }

  return (data ?? []) as IngredientOption[];
}

/**
 * Get the ingredients attached to a product.
 *
 * We intentionally load product_ingredients and ingredients separately.
 * This avoids relying on Supabase's generated nested relationship shape.
 */
export async function getProductIngredients(
  productId: string,
): Promise<ProductIngredient[]> {
  const { data: rows, error: rowsError } = await supabase
    .from("product_ingredients")
    .select(
      `
        product_id,
        ingredient_id,
        quantity,
        unit
      `,
    )
    .eq("product_id", productId)
    .order("ingredient_id");

  if (rowsError) {
    throw new Error(
      `Unable to load product ingredients: ${getErrorMessage(rowsError)}`,
    );
  }

  const productRows = (rows ?? []) as ProductIngredientRow[];

  if (productRows.length === 0) {
    return [];
  }

  const ingredientIds = [
    ...new Set(productRows.map((row) => row.ingredient_id)),
  ];

  const { data: ingredientRows, error: ingredientsError } = await supabase
    .from("ingredients")
    .select(
      `
        id,
        slug,
        name,
        description,
        short_description,
        organic_status,
        source,
        origin,
        preparation,
        storage,
        seasonality,
        image_path,
        color
      `,
    )
    .in("id", ingredientIds);

  if (ingredientsError) {
    throw new Error(
      `Unable to load ingredient details: ${getErrorMessage(
        ingredientsError,
      )}`,
    );
  }

  const ingredientMap = new Map(
    (ingredientRows ?? []).map((ingredient) => [
      ingredient.id,
      ingredient,
    ]),
  );

  return productRows.map((row) => ({
    product_id: row.product_id,
    ingredient_id: row.ingredient_id,
    quantity: row.quantity,
    unit: row.unit,
    ingredient: ingredientMap.get(row.ingredient_id) ?? null,
  }));
}

/**
 * Save all ingredients belonging to a product.
 *
 * Existing recipe rows are replaced with the submitted set.
 */
export async function saveProductIngredients(
  productId: string,
  ingredients: Array<{
    ingredient_id: string;
    quantity: number | null;
    unit: string | null;
  }>,
): Promise<void> {
  const { error: deleteError } = await supabase
    .from("product_ingredients")
    .delete()
    .eq("product_id", productId);

  if (deleteError) {
    throw new Error(
      `Unable to clear existing product ingredients: ${getErrorMessage(
        deleteError,
      )}`,
    );
  }

  if (ingredients.length === 0) {
    return;
  }

  const rows = ingredients.map((ingredient) => ({
    product_id: productId,
    ingredient_id: ingredient.ingredient_id,
    quantity:
      ingredient.quantity === null ||
      ingredient.quantity === undefined ||
      Number.isNaN(Number(ingredient.quantity))
        ? null
        : Number(ingredient.quantity),
    unit: ingredient.unit?.trim() || null,
  }));

  const { error: insertError } = await supabase
    .from("product_ingredients")
    .insert(rows);

  if (insertError) {
    throw new Error(
      `Unable to save product ingredients: ${getErrorMessage(
        insertError,
      )}`,
    );
  }
}

/**
 * Backward-compatible name for callers that replace the complete recipe.
 */
export async function replaceProductIngredients(
  productId: string,
  ingredients: Array<{
    ingredient_id: string;
    quantity: number | null;
    unit: string | null;
  }>,
): Promise<void> {
  return saveProductIngredients(productId, ingredients);
}

/**
 * Remove one ingredient from a product.
 */
export async function removeProductIngredient(
  productId: string,
  ingredientId: string,
): Promise<void> {
  const { error } = await supabase
    .from("product_ingredients")
    .delete()
    .eq("product_id", productId)
    .eq("ingredient_id", ingredientId);

  if (error) {
    throw new Error(
      `Unable to remove product ingredient: ${getErrorMessage(error)}`,
    );
  }
}
