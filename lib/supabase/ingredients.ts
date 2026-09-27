import { createClient } from "@/lib/supabase/client";

export type OrganicStatus =
  | "verified_organic"
  | "supplier_claimed"
  | "conventional"
  | "unknown";

export type AdminIngredient = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  short_description: string;
  organic_status: OrganicStatus;
  source: string | null;
  origin: string | null;
  preparation: string | null;
  storage: string | null;
  seasonality: string | null;
  image_path: string | null;
  video_path: string | null;
  color: string | null;
  created_at: string;
  updated_at: string;
  supplier_id?: string | null;
  supplier_name?: string | null;
};

export type IngredientInput = {
  slug: string;
  name: string;
  category: string;
  description: string;
  short_description: string;
  organic_status: OrganicStatus;
  source: string | null;
  origin: string | null;
  preparation: string | null;
  storage: string | null;
  seasonality: string | null;
  image_path: string | null;
  video_path: string | null;
  color: string | null;
};

export type SupplierOption = {
  id: string;
  name: string;
  active: boolean;
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

export async function getAdminIngredients(): Promise<AdminIngredient[]> {
  const { data, error } = await supabase
    .from("ingredients")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw new Error(getErrorMessage(error));

  const ingredients = (data ?? []) as AdminIngredient[];
  if (!ingredients.length) return [];

  const ingredientIds = ingredients.map((item) => item.id);

  const { data: links, error: linkError } = await supabase
    .from("supplier_ingredients")
    .select("ingredient_id,supplier_id,primary_supplier")
    .in("ingredient_id", ingredientIds)
    .eq("primary_supplier", true);

  if (linkError) throw new Error(getErrorMessage(linkError));

  const supplierIds = [...new Set((links ?? []).map((row) => row.supplier_id))];
  let suppliers: { id: string; name: string }[] = [];

  if (supplierIds.length) {
    const { data: supplierRows, error: supplierError } = await supabase
      .from("suppliers")
      .select("id,name")
      .in("id", supplierIds);

    if (supplierError) throw new Error(getErrorMessage(supplierError));
    suppliers = supplierRows ?? [];
  }

  const supplierMap = new Map(suppliers.map((supplier) => [supplier.id, supplier]));
  const linkMap = new Map((links ?? []).map((link) => [link.ingredient_id, link]));

  return ingredients.map((ingredient) => {
    const link = linkMap.get(ingredient.id);
    const supplier = link ? supplierMap.get(link.supplier_id) : undefined;

    return {
      ...ingredient,
      supplier_id: link?.supplier_id ?? null,
      supplier_name: supplier?.name ?? null,
    };
  });
}

export async function getAdminIngredient(id: string): Promise<AdminIngredient | null> {
  const { data, error } = await supabase
    .from("ingredients")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(getErrorMessage(error));
  return data as AdminIngredient | null;
}

export async function getIngredientPrimarySupplierId(
  ingredientId: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("supplier_ingredients")
    .select("supplier_id")
    .eq("ingredient_id", ingredientId)
    .eq("primary_supplier", true)
    .maybeSingle();

  if (error) throw new Error(getErrorMessage(error));
  return data?.supplier_id ?? null;
}

export async function getActiveSuppliers(): Promise<SupplierOption[]> {
  const { data, error } = await supabase
    .from("suppliers")
    .select("id,name,active")
    .eq("active", true)
    .order("name", { ascending: true });

  if (error) throw new Error(getErrorMessage(error));
  return (data ?? []) as SupplierOption[];
}

export async function createAdminIngredient(input: IngredientInput): Promise<AdminIngredient> {
  const { data, error } = await supabase
    .from("ingredients")
    .insert(input)
    .select("*")
    .single();

  if (error) throw new Error(getErrorMessage(error));
  return data as AdminIngredient;
}

export async function updateAdminIngredient(
  id: string,
  input: Partial<IngredientInput>,
): Promise<AdminIngredient> {
  const { data, error } = await supabase
    .from("ingredients")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(getErrorMessage(error));
  return data as AdminIngredient;
}

export async function saveIngredientPrimarySupplier(
  ingredientId: string,
  supplierId: string | null,
): Promise<void> {
  const { error: deleteError } = await supabase
    .from("supplier_ingredients")
    .delete()
    .eq("ingredient_id", ingredientId);

  if (deleteError) throw new Error(getErrorMessage(deleteError));

  if (!supplierId) return;

  const { data: supplier, error: supplierError } = await supabase
    .from("suppliers")
    .select("id,name")
    .eq("id", supplierId)
    .eq("active", true)
    .single();

  if (supplierError) throw new Error(getErrorMessage(supplierError));

  const { error } = await supabase
    .from("supplier_ingredients")
    .insert({
      supplier_id: supplier.id,
      ingredient_id: ingredientId,
      supplier_reference: null,
      notes: null,
      primary_supplier: true,
    });

  if (error) throw new Error(getErrorMessage(error));

  // Keep the legacy/source text synchronized with the selected supplier.
  const { error: sourceError } = await supabase
    .from("ingredients")
    .update({
      source: supplier.name,
      updated_at: new Date().toISOString(),
    })
    .eq("id", ingredientId);

  if (sourceError) throw new Error(getErrorMessage(sourceError));
}

export async function deleteAdminIngredient(id: string): Promise<void> {
  const { error } = await supabase.from("ingredients").delete().eq("id", id);
  if (error) throw new Error(getErrorMessage(error));
}

export async function updateIngredientImage(
  id: string,
  imagePath: string | null,
): Promise<AdminIngredient> {
  return updateAdminIngredient(id, { image_path: imagePath });
}

export async function updateIngredientVideo(
  id: string,
  videoPath: string | null,
): Promise<AdminIngredient> {
  return updateAdminIngredient(id, { video_path: videoPath });
}
