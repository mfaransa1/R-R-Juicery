import { createClient } from "@/lib/supabase/client";

export type PublicProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  category_label?: string | null;
  description?: string | null;
  note?: string | null;
  price: number;
  size: string;
  image_path?: string | null;
  video_path?: string | null;
  tone?: string | null;
  featured?: boolean | null;
  active: boolean;
};

export async function getPublicProducts(): Promise<PublicProduct[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, category, category_label, description, note, price, size, image_path, video_path, tone, featured, active"
    )
    .eq("active", true)
    .order("featured", { ascending: false })
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to load public products:", error);
    throw new Error("Unable to load the R&R menu.");
  }

  return (data ?? []) as PublicProduct[];
}

export async function getPublicProductBySlug(
  slug: string
): Promise<PublicProduct | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, category, category_label, description, note, price, size, image_path, video_path, tone, featured, active"
    )
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    console.error("Failed to load product:", error);
    throw new Error("Unable to load this product.");
  }

  return data as PublicProduct | null;
}
