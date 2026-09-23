import { createClient } from "@/lib/supabase/client";

export type Supplier = {
  id: string;
  name: string;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type InventoryItem = {
  id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  reorder_level: number | null;
  notes: string | null;
  ingredient?: { name: string } | null;
};

export type InventoryMovement = {
  id: string;
  inventory_item_id: string;
  movement_type: "received" | "used" | "adjusted" | "wasted";
  quantity: number;
  unit: string;
  reference: string | null;
  notes: string | null;
  created_at: string;
};

export type DeliveryZone = {
  id: string;
  name: string;
  description: string | null;
  fee: number;
  minimum_order: number | null;
  free_delivery_threshold: number | null;
  active: boolean;
  sort_order: number;
};

export type OperationalBatch = {
  id: string;
  batch_code: string | null;
  product_id: string | null;
  ingredient_id: string | null;
  production_date: string | null;
  supplier_id: string | null;
  quantity: number | null;
  unit: string | null;
  use_by_date: string | null;
  status: string | null;
  notes: string | null;
  product?: { name: string; slug: string } | null;
  ingredient?: { name: string; slug: string } | null;
  supplier?: { name: string } | null;
};

export async function getSuppliers() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .order("name");

  if (error) throw error;
  return (data ?? []) as Supplier[];
}

export async function saveSupplier(
  input: Partial<Supplier> & Pick<Supplier, "name">,
) {
  const supabase = createClient();
  const payload = {
    name: input.name,
    contact_name: input.contact_name || null,
    phone: input.phone || null,
    email: input.email || null,
    address: input.address || null,
    notes: input.notes || null,
    active: input.active ?? true,
    updated_at: new Date().toISOString(),
  };

  const query = input.id
    ? supabase.from("suppliers").update(payload).eq("id", input.id)
    : supabase.from("suppliers").insert(payload);

  const { error } = await query;
  if (error) throw error;
}

export async function getInventory() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("inventory_items")
    .select("*, ingredient:ingredients(name)")
    .order("ingredient_id");

  if (error) throw error;
  return (data ?? []) as InventoryItem[];
}

export async function recordInventoryMovement(input: {
  inventoryItemId: string;
  movementType: InventoryMovement["movement_type"];
  quantity: number;
  unit: string;
  reference?: string;
  notes?: string;
}) {
  const supabase = createClient();

  const { data: item, error: itemError } = await supabase
    .from("inventory_items")
    .select("id,quantity")
    .eq("id", input.inventoryItemId)
    .single();

  if (itemError) throw itemError;

  const signedQuantity =
    input.movementType === "received"
      ? input.quantity
      : input.movementType === "used" || input.movementType === "wasted"
        ? -Math.abs(input.quantity)
        : input.quantity;

  const { error: movementError } = await supabase
    .from("inventory_movements")
    .insert({
      inventory_item_id: input.inventoryItemId,
      movement_type: input.movementType,
      quantity: input.quantity,
      unit: input.unit,
      reference: input.reference || null,
      notes: input.notes || null,
    });

  if (movementError) throw movementError;

  const { error: updateError } = await supabase
    .from("inventory_items")
    .update({
      quantity: Number(item.quantity) + signedQuantity,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.inventoryItemId);

  if (updateError) throw updateError;
}

export async function getDeliveryZones() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("delivery_zones")
    .select("*")
    .order("sort_order")
    .order("name");

  if (error) throw error;
  return (data ?? []) as DeliveryZone[];
}

export async function saveDeliveryZone(
  input: Partial<DeliveryZone> & Pick<DeliveryZone, "name">,
) {
  const supabase = createClient();

  const payload = {
    name: input.name,
    description: input.description || null,
    fee: Number(input.fee || 0),
    minimum_order:
      input.minimum_order === null || input.minimum_order === undefined
        ? null
        : Number(input.minimum_order),
    free_delivery_threshold:
      input.free_delivery_threshold === null ||
      input.free_delivery_threshold === undefined
        ? null
        : Number(input.free_delivery_threshold),
    active: input.active ?? true,
    sort_order: Number(input.sort_order || 0),
    updated_at: new Date().toISOString(),
  };

  const query = input.id
    ? supabase.from("delivery_zones").update(payload).eq("id", input.id)
    : supabase.from("delivery_zones").insert(payload);

  const { error } = await query;
  if (error) throw error;
}

export async function getOperationalBatches() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("batches")
    .select(
      "id,batch_code,product_id,ingredient_id,production_date,supplier_id,quantity,unit,use_by_date,status,notes,product:products(name,slug),ingredient:ingredients(name,slug),supplier:suppliers(name)",
    )
    .order("production_date", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as OperationalBatch[];
}
