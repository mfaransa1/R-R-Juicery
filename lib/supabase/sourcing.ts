import { createClient } from "@/lib/supabase/client";

export type SourcingRecord = {
  id: string;
  ingredient_id: string | null;
  farm: string | null;
  supplier: string | null;
  location: string | null;
  source_status: string | null;
  certification: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  ingredient?: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

export type IngredientOption = {
  id: string;
  name: string;
  slug: string;
};

export type SourcingInput = {
  ingredient_id?: string | null;
  farm?: string | null;
  supplier?: string | null;
  location?: string | null;
  source_status?: string | null;
  certification?: string | null;
  notes?: string | null;
};

const supabase = createClient();

function clean(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function errorMessage(error: {
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
  ].filter(Boolean).join(" ");
}

function normalizeIngredient(
  ingredient:
    | { id: string; name: string; slug: string }
    | { id: string; name: string; slug: string }[]
    | null
    | undefined,
) {
  if (!ingredient) return null;
  return Array.isArray(ingredient) ? ingredient[0] ?? null : ingredient;
}

function normalize(row: any): SourcingRecord {
  return {
    id: row.id,
    ingredient_id: row.ingredient_id,
    farm: row.farm,
    supplier: row.supplier,
    location: row.location,
    source_status: row.source_status,
    certification: row.certification,
    notes: row.notes,
    created_at: row.created_at,
    updated_at: row.updated_at,
    ingredient: normalizeIngredient(row.ingredient),
  };
}

export async function getSourcingRecords(): Promise<SourcingRecord[]> {
  const { data, error } = await supabase
    .from("sourcing_records")
    .select(`
      id,
      ingredient_id,
      farm,
      supplier,
      location,
      source_status,
      certification,
      notes,
      created_at,
      updated_at,
      ingredient:ingredients (
        id,
        name,
        slug
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw new Error(errorMessage(error));

  return (data ?? []).map(normalize);
}

export async function getSourcingIngredientOptions(): Promise<IngredientOption[]> {
  const { data, error } = await supabase
    .from("ingredients")
    .select("id,name,slug")
    .order("name", { ascending: true });

  if (error) throw new Error(errorMessage(error));

  return (data ?? []) as IngredientOption[];
}

export async function createSourcingRecord(
  input: SourcingInput,
): Promise<SourcingRecord> {
  const payload = {
    ingredient_id: clean(input.ingredient_id),
    farm: clean(input.farm),
    supplier: clean(input.supplier),
    location: clean(input.location),
    source_status: clean(input.source_status),
    certification: clean(input.certification),
    notes: clean(input.notes),
  };

  const { data, error } = await supabase
    .from("sourcing_records")
    .insert(payload)
    .select(`
      id,
      ingredient_id,
      farm,
      supplier,
      location,
      source_status,
      certification,
      notes,
      created_at,
      updated_at,
      ingredient:ingredients (
        id,
        name,
        slug
      )
    `)
    .single();

  if (error) throw new Error(errorMessage(error));

  return normalize(data);
}

export async function updateSourcingRecord(
  id: string,
  input: SourcingInput,
): Promise<SourcingRecord> {
  const payload = {
    ingredient_id: clean(input.ingredient_id),
    farm: clean(input.farm),
    supplier: clean(input.supplier),
    location: clean(input.location),
    source_status: clean(input.source_status),
    certification: clean(input.certification),
    notes: clean(input.notes),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("sourcing_records")
    .update(payload)
    .eq("id", id)
    .select(`
      id,
      ingredient_id,
      farm,
      supplier,
      location,
      source_status,
      certification,
      notes,
      created_at,
      updated_at,
      ingredient:ingredients (
        id,
        name,
        slug
      )
    `)
    .single();

  if (error) throw new Error(errorMessage(error));

  return normalize(data);
}

export async function deleteSourcingRecord(id: string) {
  const { error } = await supabase
    .from("sourcing_records")
    .delete()
    .eq("id", id);

  if (error) throw new Error(errorMessage(error));
}
