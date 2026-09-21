import { createClient } from "@/lib/supabase/client";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "pressing"
  | "ready"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

export type FulfillmentType = "pickup" | "delivery";
export type PaymentMethod = "mpesa" | "card" | "cash";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type AdminOrder = {
  id: string;
  order_number: string;
  customer_id: string | null;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  fulfillment_type: FulfillmentType;
  delivery_address: string | null;
  delivery_notes: string | null;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  subtotal: number;
  delivery_fee: number;
  total: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  size: string | null;
  created_at: string;
};

export type CreateOrderItemInput = {
  product_id?: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  size?: string | null;
};

export type CreateOrderInput = {
  order_number: string;
  customer_id?: string | null;
  customer_name: string;
  customer_email?: string | null;
  customer_phone: string;
  fulfillment_type: FulfillmentType;
  delivery_address?: string | null;
  delivery_notes?: string | null;
  payment_method: PaymentMethod;
  payment_status?: PaymentStatus;
  notes?: string | null;
  items: CreateOrderItemInput[];
};

const supabase = createClient();

function errorMessage(error: {
  message?: string;
  details?: string;
  hint?: string;
  code?: string;
}) {
  if (error.code === "23505") {
    return `That order number already exists. Please use a unique order number.`;
  }

  return [
    error.message || "Supabase request failed.",
    error.details ? `Details: ${error.details}` : "",
    error.hint ? `Hint: ${error.hint}` : "",
    error.code ? `Code: ${error.code}` : "",
  ].filter(Boolean).join(" ");
}

function clean(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

const orderColumns = `
  id,
  order_number,
  customer_id,
  customer_name,
  customer_email,
  customer_phone,
  fulfillment_type,
  delivery_address,
  delivery_notes,
  status,
  payment_method,
  payment_status,
  subtotal,
  delivery_fee,
  total,
  notes,
  created_at,
  updated_at
`;

export async function getAdminOrders(): Promise<AdminOrder[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(orderColumns)
    .order("created_at", { ascending: false });

  if (error) throw new Error(errorMessage(error));

  return (data ?? []).map((row) => ({
    ...row,
    subtotal: Number(row.subtotal),
    delivery_fee: Number(row.delivery_fee),
    total: Number(row.total),
  })) as AdminOrder[];
}

export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  const { data, error } = await supabase
    .from("order_items")
    .select(`
      id,
      order_id,
      product_id,
      product_name,
      quantity,
      unit_price,
      line_total,
      size,
      created_at
    `)
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(errorMessage(error));

  return (data ?? []).map((row) => ({
    ...row,
    unit_price: Number(row.unit_price),
    line_total: Number(row.line_total),
  })) as OrderItem[];
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
) {
  const { data, error } = await supabase
    .from("orders")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select(orderColumns)
    .single();

  if (error) throw new Error(errorMessage(error));

  return {
    ...data,
    subtotal: Number(data.subtotal),
    delivery_fee: Number(data.delivery_fee),
    total: Number(data.total),
  } as AdminOrder;
}

export async function updateOrderPaymentStatus(
  orderId: string,
  paymentStatus: PaymentStatus,
) {
  const { data, error } = await supabase
    .from("orders")
    .update({
      payment_status: paymentStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select(orderColumns)
    .single();

  if (error) throw new Error(errorMessage(error));

  return {
    ...data,
    subtotal: Number(data.subtotal),
    delivery_fee: Number(data.delivery_fee),
    total: Number(data.total),
  } as AdminOrder;
}

export async function createOrder(
  input: CreateOrderInput,
): Promise<AdminOrder> {
  if (!input.order_number.trim()) {
    throw new Error("Order number is required.");
  }

  if (!input.customer_name.trim()) {
    throw new Error("Customer name is required.");
  }

  if (!input.customer_phone.trim()) {
    throw new Error("Customer phone is required.");
  }

  if (!input.items.length) {
    throw new Error("At least one order item is required.");
  }

  const subtotal = input.items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0,
  );

  const deliveryFee = 0;
  const total = subtotal + deliveryFee;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: input.order_number.trim(),
      customer_id: input.customer_id ?? null,
      customer_name: input.customer_name.trim(),
      customer_email: clean(input.customer_email),
      customer_phone: input.customer_phone.trim(),
      fulfillment_type: input.fulfillment_type,
      delivery_address: clean(input.delivery_address),
      delivery_notes: clean(input.delivery_notes),
      status: "pending",
      payment_method: input.payment_method,
      payment_status: input.payment_status ?? "pending",
      subtotal,
      delivery_fee: deliveryFee,
      total,
      notes: clean(input.notes),
    })
    .select(orderColumns)
    .single();

  if (orderError) throw new Error(errorMessage(orderError));

  const items = input.items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id ?? null,
    product_name: item.product_name,
    quantity: item.quantity,
    unit_price: item.unit_price,
    line_total: item.unit_price * item.quantity,
    size: clean(item.size),
  }));

  const { error: itemError } = await supabase
    .from("order_items")
    .insert(items);

  if (itemError) {
    // Remove the parent order if its items could not be created.
    await supabase.from("orders").delete().eq("id", order.id);
    throw new Error(errorMessage(itemError));
  }

  return {
    ...order,
    subtotal: Number(order.subtotal),
    delivery_fee: Number(order.delivery_fee),
    total: Number(order.total),
  } as AdminOrder;
}
