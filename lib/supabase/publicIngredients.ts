import { createClient } from "@/lib/supabase/client";

export type PublicIngredient = {
  id: string;
  slug: string;
  name: string;
  category: string | null;
  description: string | null;
  short_description: string | null;
  organic_status: "verified_organic" | "supplier_claimed" | "conventional" | "unknown";
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
};

export type PublicIngredientProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  size: string;
  image_path: string | null;
  category_label: string;
};

const supabase = createClient();

function getErrorMessage(error: { message?: string; details?: string; hint?: string; code?: string }) {
  return [
    error.message || "Supabase request failed.",
    error.details ? `Details: ${error.details}` : "",
    error.hint ? `Hint: ${error.hint}` : "",
    error.code ? `Code: ${error.code}` : "",
  ].filter(Boolean).join(" ");
}

export async function getPublicIngredients(): Promise<PublicIngredient[]> {
  const { data, error } = await supabase
    .from("ingredients")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw new Error(getErrorMessage(error));
  return (data ?? []) as PublicIngredient[];
}

export async function getPublicIngredientBySlug(slug: string): Promise<PublicIngredient | null> {
  const cleanSlug = decodeURIComponent(slug).trim().toLowerCase();
  const { data, error } = await supabase
    .from("ingredients")
    .select("*")
    .eq("slug", cleanSlug)
    .maybeSingle();

  if (error) throw new Error(getErrorMessage(error));
  return data as PublicIngredient | null;
}

export async function getProductsUsingIngredient(ingredientId: string): Promise<PublicIngredientProduct[]> {
  const { data: links, error: linkError } = await supabase
    .from("product_ingredients")
    .select("product_id")
    .eq("ingredient_id", ingredientId);

  if (linkError) {
    console.warn("Unable to load ingredient product links:", linkError);
    return [];
  }

  const productIds = [...new Set((links ?? []).map((row) => row.product_id))];
  if (!productIds.length) return [];

  const { data: products, error: productError } = await supabase
    .from("products")
    .select("id, slug, name, price, size, image_path, category_label")
    .in("id", productIds)
    .eq("active", true)
    .order("name", { ascending: true });

  if (productError) {
    console.warn("Unable to load ingredient products:", productError);
    return [];
  }

  return (products ?? []) as PublicIngredientProduct[];
}
