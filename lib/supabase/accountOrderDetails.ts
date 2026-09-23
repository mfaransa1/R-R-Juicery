import { createClient } from "@/lib/supabase/client";

export type CustomerOrderDetail = {
  id: string;
  order_number: string;
  status: string;
  fulfillment_type: string;
  payment_method: string;
  payment_status: string;
  subtotal: number | string;
  delivery_fee: number | string;
  total: number | string;
  created_at: string;
};

export type CustomerOrderDetailItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number | string;
  line_total: number | string;
  size: string | null;
};

export async function getMyOrderDetail(reference: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Please sign in to view this order.");

  const clean = reference.trim();
  if (!clean) throw new Error("Order reference is required.");

  const uuidLike = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(clean);
  const query = supabase
    .from("orders")
    .select("id,order_number,status,fulfillment_type,payment_method,payment_status,subtotal,delivery_fee,total,created_at")
    .eq("customer_id", user.id);

  const { data, error } = uuidLike
    ? await query.eq("id", clean).maybeSingle()
    : await query.eq("order_number", clean).maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("We could not find that order in your account.");

  const { data: itemData, error: itemError } = await supabase
    .from("order_items")
    .select("id,order_id,product_id,product_name,quantity,unit_price,line_total,size")
    .eq("order_id", data.id)
    .order("created_at", { ascending: true });

  if (itemError) throw itemError;

  return {
    order: data as CustomerOrderDetail,
    items: (itemData ?? []) as CustomerOrderDetailItem[],
  };
}
