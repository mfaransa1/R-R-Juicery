import { createClient } from "@/lib/supabase/client";

export type AccountOrder = {
  id: string;
  status: string;
  fulfillment_type: string;
  payment_method: string;
  payment_status: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  created_at: string;
};

export type AccountFavourite = {
  id: string;
  product_id: string;
  created_at: string;
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    size: string;
    image_path: string | null;
  } | null;
};

export async function getMyOrders() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id,status,fulfillment_type,payment_method,payment_status,subtotal,delivery_fee,total,created_at"
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []) as AccountOrder[];
}

export async function getMyFavourites() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("favourites")
    .select(
      "id,product_id,created_at,product:products(id,slug,name,price,size,image_path)"
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []) as unknown as AccountFavourite[];
}

export async function addFavourite(productId: string) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Please sign in to save favourites.");

  const { error } = await supabase.from("favourites").upsert(
  {
    profile_id: user.id,
    product_id: productId,
  },
  {
    onConflict: "profile_id,product_id",
    ignoreDuplicates: true,
  }
);

  if (error) throw error;
}

export async function removeFavourite(productId: string) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Please sign in to manage favourites.");

const { error } = await supabase
  .from("favourites")
  .delete()
  .eq("profile_id", user.id)
  .eq("product_id", productId);

  if (error) throw error;
}
