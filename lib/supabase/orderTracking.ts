import { createClient } from "@/lib/supabase/client";

export type CustomerOrder = {
  id: string;
  order_number: string | null;
  status: string;
  fulfillment_type: string;
  payment_method: string;
  payment_status: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_address: string | null;
  notes: string | null;
  created_at: string;
};

export type CustomerOrderItem = {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  size: string;
  line_total: number;
};

export async function getMyOrder(orderId: string) {
  const supabase = createClient();

  const cleanId = orderId.trim();

  if (!cleanId) {
    throw new Error("Enter an order reference.");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Please sign in to view your order.");
  }

  const orderSelect =
    "id,order_number,status,fulfillment_type,payment_method,payment_status,subtotal,delivery_fee,total,customer_name,customer_phone,customer_email,delivery_address,notes,created_at";

  // UUIDs and customer-facing order references must be queried separately.
  // Putting an R&R reference such as RR-20260923-7ED23BAO into an `id.eq`
  // branch can make PostgreSQL attempt to cast it to UUID and fail before
  // the order_number branch is evaluated.
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(cleanId);

  let query = supabase
    .from("orders")
    .select(orderSelect)
    .eq("customer_id", user.id);

  query = isUuid
    ? query.eq("id", cleanId)
    : query.eq("order_number", cleanId);

  const { data, error } = await query.maybeSingle();

  if (error) throw error;

  if (!data) {
    throw new Error("Order not found in your account.");
  }

  return data as CustomerOrder;
}

export async function getMyOrderItems(orderId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("order_items")
    .select(
      "id,product_id,product_name,quantity,unit_price,size,line_total"
    )
    .eq("order_id", orderId)
    .order("id", { ascending: true });

  if (error) throw error;

  return (data ?? []) as CustomerOrderItem[];
}
