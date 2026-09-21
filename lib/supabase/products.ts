import { createClient } from "@/lib/supabase/client";

export type AdminProduct = {
  id: string;
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
  created_at: string;
  updated_at: string;
};

export type ProductInput = Omit<
  AdminProduct,
  "id" | "created_at" | "updated_at"
>;

const supabase = createClient();

export async function getAdminProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as AdminProduct[];
}

export async function createAdminProduct(input: ProductInput) {
  const { data, error } = await supabase
    .from("products")
    .insert(input)
    .select("*")
    .single();

  if (error) throw error;
  return data as AdminProduct;
}

export async function updateAdminProduct(
  id: string,
  input: Partial<ProductInput>,
) {
  const { data, error } = await supabase
    .from("products")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data as AdminProduct;
}

export async function setProductActive(id: string, active: boolean) {
  return updateAdminProduct(id, { active });
}

export async function setProductFeatured(id: string, featured: boolean) {
  return updateAdminProduct(id, { featured });
}
