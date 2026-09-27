import { createClient } from "@/lib/supabase/client";

export type PublicProduct = {
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
};

const PUBLIC_FIELDS = `
  id,
  slug,
  name,
  category,
  category_label,
  description,
  detailed_description,
  note,
  price,
  size,
  preparation,
  freshness,
  additives,
  concentrate,
  health_benefits,
  featured,
  tone,
  image_path,
  video_path,
  active
`;

export async function getPublicProducts() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PUBLIC_FIELDS)
    .eq("active", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as PublicProduct[];
}

export async function getPublicProductBySlug(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PUBLIC_FIELDS)
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as PublicProduct | null;
}
