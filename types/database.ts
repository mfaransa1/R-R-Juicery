export type AppRole = "customer" | "staff" | "admin";
export type OrganicStatus = "verified_organic" | "supplier_claimed" | "conventional" | "unknown";
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

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string; slug: string; name: string; category: string; category_label: string;
          description: string; note: string; price: number; size: string;
          preparation: string; freshness: string; additives: string; concentrate: string;
          featured: boolean; tone: string | null; image_path: string | null;
          video_path: string | null; active: boolean; created_at: string; updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["products"]["Row"]> & {
          slug: string; name: string; category: string; category_label: string;
          description: string; note: string; price: number; size: string;
          preparation: string; freshness: string; additives: string; concentrate: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Row"]>;
      };
      profiles: {
        Row: { id: string; full_name: string | null; phone: string | null; role: AppRole; created_at: string; updated_at: string };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      orders: {
        Row: {
          id: string; order_number: string; customer_id: string | null; customer_name: string;
          customer_email: string | null; customer_phone: string; fulfillment_type: FulfillmentType;
          delivery_address: string | null; delivery_notes: string | null; status: OrderStatus;
          payment_method: PaymentMethod; payment_status: PaymentStatus; subtotal: number;
          delivery_fee: number; total: number; notes: string | null; created_at: string; updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["orders"]["Row"]> & {
          order_number: string; customer_name: string; customer_phone: string;
          fulfillment_type: FulfillmentType; payment_method: PaymentMethod;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Row"]>;
      };
    };
  };
};
