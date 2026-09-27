import { createClient } from "@/lib/supabase/client";

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  category_label: string;
  description: string;
  detailed_description: string | null;
  note: string;
  price: number;
  size: string;
  preparation: string;
  freshness: string;
  additives: string;
  concentrate: string;
  health_benefits: string[];
  featured: boolean;
  tone: string | null;
  image_path: string | null;
  video_path: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductInput = {
  slug: string;
  name: string;
  category: string;
  category_label: string;
  description: string;
  note: string;
  price: number;
  size: string;
  preparation: string;
  freshness: string;
  additives: string;
  concentrate: string;
  featured: boolean;
  tone: string | null;
  image_path: string | null;
  video_path: string | null;
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

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(getErrorMessage(error));
  return (data ?? []) as AdminProduct[];
}

export async function createAdminProduct(input: ProductInput): Promise<AdminProduct> {
  const { data, error } = await supabase
    .from("products")
    .insert(input)
    .select("*")
    .single();

  if (error) throw new Error(getErrorMessage(error));
  return data as AdminProduct;
}

export async function updateAdminProduct(
  id: string,
  input: Partial<ProductInput>,
): Promise<AdminProduct> {
  const { data, error } = await supabase
    .from("products")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(getErrorMessage(error));
  return data as AdminProduct;
}

export async function updateProductDetails(
  id: string,
  input: {
    detailed_description: string | null;
    health_benefits: string[];
  },
): Promise<AdminProduct> {
  const { data, error } = await supabase
    .from("products")
    .update({
      detailed_description: input.detailed_description,
      health_benefits: input.health_benefits,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(getErrorMessage(error));
  return data as AdminProduct;
}

export async function setProductActive(id: string, active: boolean) {
  return updateAdminProduct(id, { active });
}

export async function setProductFeatured(id: string, featured: boolean) {
  return updateAdminProduct(id, { featured });
}
