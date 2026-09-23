import { createClient } from "@/lib/supabase/client";

export type AnalyticsOrder = {
  id: string;
  order_number: string | null;
  customer_id: string | null;
  status: string;
  fulfillment_type: string;
  payment_method: string;
  payment_status: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  created_at: string;
};

export type AnalyticsOrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  size: string | null;
  line_total: number;
};

export type AnalyticsCustomer = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  created_at: string;
};

export type AnalyticsProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  category_label: string;
  price: number;
  size: string;
  active: boolean;
  featured: boolean;
};

export async function getControlRoomAnalytics() {
  const supabase = createClient();

  const [ordersResult, itemsResult, customersResult, productsResult] =
    await Promise.all([
      supabase
        .from("orders")
        .select(
          "id,order_number,customer_id,status,fulfillment_type,payment_method,payment_status,subtotal,delivery_fee,total,created_at",
        )
        .order("created_at", { ascending: false }),

      supabase
        .from("order_items")
        .select(
          "id,order_id,product_id,quantity,unit_price,size,line_total",
        ),

      supabase
        .from("profiles")
        .select("id,full_name,email,phone,role,created_at")
        .eq("role", "customer")
        .order("created_at", { ascending: false }),

      supabase
        .from("products")
        .select(
          "id,slug,name,category,category_label,price,size,active,featured",
        )
        .order("name", { ascending: true }),
    ]);

  const error =
    ordersResult.error ||
    itemsResult.error ||
    customersResult.error ||
    productsResult.error;

  if (error) throw error;

  return {
    orders: (ordersResult.data ?? []) as AnalyticsOrder[],
    items: (itemsResult.data ?? []) as AnalyticsOrderItem[],
    customers: (customersResult.data ?? []) as AnalyticsCustomer[],
    products: (productsResult.data ?? []) as AnalyticsProduct[],
  };
}

export async function getCustomerActivity(customerId: string) {
  const supabase = createClient();

  const [profileResult, ordersResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id,full_name,email,phone,role,created_at")
      .eq("id", customerId)
      .single(),

    supabase
      .from("orders")
      .select(
        "id,order_number,customer_id,status,fulfillment_type,payment_method,payment_status,subtotal,delivery_fee,total,created_at",
      )
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false }),
  ]);

  if (profileResult.error) throw profileResult.error;
  if (ordersResult.error) throw ordersResult.error;

  const orders = (ordersResult.data ?? []) as AnalyticsOrder[];

  let items: AnalyticsOrderItem[] = [];

  if (orders.length) {
    const { data, error } = await supabase
      .from("order_items")
      .select(
        "id,order_id,product_id,quantity,unit_price,size,line_total",
      )
      .in(
        "order_id",
        orders.map((order) => order.id),
      );

    if (error) throw error;
    items = (data ?? []) as AnalyticsOrderItem[];
  }

  return {
    customer: profileResult.data as AnalyticsCustomer,
    orders,
    items,
  };
}
