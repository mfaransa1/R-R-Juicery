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
  category: string | null;
  description: string | null;
  short_description: string | null;
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
};

export type IngredientInput = {
  slug: string;
  name: string;
  category?: string | null;
  description?: string | null;
  short_description?: string | null;
  organic_status: OrganicStatus;
  source?: string | null;
  origin?: string | null;
  preparation?: string | null;
  storage?: string | null;
  seasonality?: string | null;
  image_path?: string | null;
  video_path?: string | null;
  color?: string | null;
};

const supabase = createClient();

/**
 * Convert empty strings to null for optional database fields.
 * This keeps the database clean and avoids inconsistent empty values.
 */
function nullable(value: string | null | undefined) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : null;
}

/**
 * Prepare the exact fields that belong in the ingredients table.
 */
function normalizeIngredient(input: IngredientInput) {
  return {
    slug: input.slug.trim(),
    name: input.name.trim(),

    category: nullable(input.category),
    description: nullable(input.description),
    short_description: nullable(input.short_description),

    organic_status: input.organic_status,

    source: nullable(input.source),
    origin: nullable(input.origin),
    preparation: nullable(input.preparation),
    storage: nullable(input.storage),
    seasonality: nullable(input.seasonality),

    image_path: nullable(input.image_path),
    video_path: nullable(input.video_path),
    color: nullable(input.color),
  };
}

/**
 * Convert Supabase errors into messages that are actually useful
 * inside the admin interface.
 */
function getSupabaseErrorMessage(error: {
  message?: string;
  details?: string;
  hint?: string;
  code?: string;
}) {
  const message = error.message || "Unknown Supabase error.";

  if (error.code === "23505") {
    return `An ingredient with this slug already exists. Please use a different slug. (${message})`;
  }

  if (error.code === "42501") {
    return `Supabase rejected this operation because of permissions/RLS. Make sure the logged-in account has a staff or admin role. (${message})`;
  }

  if (error.code === "23503") {
    return `This ingredient references another record that does not exist. (${message})`;
  }

  return [
    message,
    error.details ? `Details: ${error.details}` : "",
    error.hint ? `Hint: ${error.hint}` : "",
    error.code ? `Code: ${error.code}` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * Get all ingredients.
 */
export async function getAdminIngredients(): Promise<AdminIngredient[]> {
  const { data, error } = await supabase
    .from("ingredients")
    .select(`
      id,
      slug,
      name,
      category,
      description,
      short_description,
      organic_status,
      source,
      origin,
      preparation,
      storage,
      seasonality,
      image_path,
      video_path,
      color,
      created_at,
      updated_at
    `)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(getSupabaseErrorMessage(error));
  }

  return (data ?? []) as AdminIngredient[];
}

/**
 * Create a new ingredient.
 */
export async function createAdminIngredient(
  input: IngredientInput,
): Promise<AdminIngredient> {
  if (!input.name.trim()) {
    throw new Error("Ingredient name is required.");
  }

  if (!input.slug.trim()) {
    throw new Error("Ingredient slug is required.");
  }

  const payload = normalizeIngredient(input);

  const { data, error } = await supabase
    .from("ingredients")
    .insert(payload)
    .select(`
      id,
      slug,
      name,
      category,
      description,
      short_description,
      organic_status,
      source,
      origin,
      preparation,
      storage,
      seasonality,
      image_path,
      video_path,
      color,
      created_at,
      updated_at
    `)
    .single();

  if (error) {
    throw new Error(getSupabaseErrorMessage(error));
  }

  if (!data) {
    throw new Error("Ingredient was created but no record was returned.");
  }

  return data as AdminIngredient;
}

/**
 * Update an existing ingredient.
 */
export async function updateAdminIngredient(
  id: string,
  input: Partial<IngredientInput>,
): Promise<AdminIngredient> {
  if (!id) {
    throw new Error("Ingredient ID is missing.");
  }

  if (input.name !== undefined && !input.name.trim()) {
    throw new Error("Ingredient name is required.");
  }

  if (input.slug !== undefined && !input.slug.trim()) {
    throw new Error("Ingredient slug is required.");
  }

  const payload = {
    ...(input.slug !== undefined
      ? { slug: input.slug.trim() }
      : {}),

    ...(input.name !== undefined
      ? { name: input.name.trim() }
      : {}),

    ...(input.category !== undefined
      ? { category: nullable(input.category) }
      : {}),

    ...(input.description !== undefined
      ? { description: nullable(input.description) }
      : {}),

    ...(input.short_description !== undefined
      ? { short_description: nullable(input.short_description) }
      : {}),

    ...(input.organic_status !== undefined
      ? { organic_status: input.organic_status }
      : {}),

    ...(input.source !== undefined
      ? { source: nullable(input.source) }
      : {}),

    ...(input.origin !== undefined
      ? { origin: nullable(input.origin) }
      : {}),

    ...(input.preparation !== undefined
      ? { preparation: nullable(input.preparation) }
      : {}),

    ...(input.storage !== undefined
      ? { storage: nullable(input.storage) }
      : {}),

    ...(input.seasonality !== undefined
      ? { seasonality: nullable(input.seasonality) }
      : {}),

    ...(input.image_path !== undefined
      ? { image_path: nullable(input.image_path) }
      : {}),

    ...(input.video_path !== undefined
      ? { video_path: nullable(input.video_path) }
      : {}),

    ...(input.color !== undefined
      ? { color: nullable(input.color) }
      : {}),

    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("ingredients")
    .update(payload)
    .eq("id", id)
    .select(`
      id,
      slug,
      name,
      category,
      description,
      short_description,
      organic_status,
      source,
      origin,
      preparation,
      storage,
      seasonality,
      image_path,
      video_path,
      color,
      created_at,
      updated_at
    `)
    .single();

  if (error) {
    throw new Error(getSupabaseErrorMessage(error));
  }

  if (!data) {
    throw new Error("Ingredient update completed but no record was returned.");
  }

  return data as AdminIngredient;
}