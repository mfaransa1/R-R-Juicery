import { createClient } from "@/lib/supabase/client";

export type CheckoutFulfillment = "pickup" | "delivery";
export type CheckoutPaymentMethod = "mpesa" | "card" | "cash";

export type CheckoutItem = {
  productId: string;
  quantity: number;
  size?: string | null;
};

export type PlaceOrderInput = {
  customerName: string;
  customerEmail?: string | null;
  customerPhone: string;
  fulfillmentType: CheckoutFulfillment;
  deliveryAddress?: string | null;
  deliveryNotes?: string | null;
  paymentMethod: CheckoutPaymentMethod;
  notes?: string | null;
  items: CheckoutItem[];
};

export type PlacedOrder = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  fulfillment_type: CheckoutFulfillment;
  payment_method: CheckoutPaymentMethod;
  payment_status: "pending" | "paid" | "failed" | "refunded";
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: "pending" | "confirmed" | "preparing" | "pressing" | "ready" | "out_for_delivery" | "completed" | "cancelled";
  created_at: string;
};

const supabase = createClient();

export async function placeOrder(input: PlaceOrderInput): Promise<PlacedOrder> {
  if (!input.items.length) throw new Error("Your basket is empty.");

  const { data, error } = await supabase.rpc("place_order", {
    p_customer_name: input.customerName,
    p_customer_email: input.customerEmail ?? null,
    p_customer_phone: input.customerPhone,
    p_fulfillment_type: input.fulfillmentType,
    p_delivery_address: input.deliveryAddress ?? null,
    p_delivery_notes: input.deliveryNotes ?? null,
    p_payment_method: input.paymentMethod,
    p_notes: input.notes ?? null,
    p_items: input.items,
  });

  if (error) {
    throw new Error(error.message || "We could not place your order.");
  }

  return {
    ...data,
    subtotal: Number(data.subtotal),
    delivery_fee: Number(data.delivery_fee),
    total: Number(data.total),
  } as PlacedOrder;
}
