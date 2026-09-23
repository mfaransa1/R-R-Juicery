import { createClient } from "@/lib/supabase/client";

export type CustomerOrder = {
  id: string;
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

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id,status,fulfillment_type,payment_method,payment_status,subtotal,delivery_fee,total,customer_name,customer_phone,customer_email,delivery_address,notes,created_at"
    )
    .eq("id", cleanId)
    .eq("customer_id", user.id)
    .maybeSingle();

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
