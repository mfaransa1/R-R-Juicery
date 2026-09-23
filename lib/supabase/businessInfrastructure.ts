import { createClient } from "@/lib/supabase/client";

export type BusinessSetting = {
  id: string;
  key: string;
  value: string | null;
  description: string | null;
  updated_by: string | null;
  updated_at: string;
};

export type AdminNotification = {
  id: string;
  title: string;
  message: string;
  type: string;
  link: string | null;
  read_at: string | null;
  created_at: string;
};

export type AuditLog = {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

export async function getBusinessSettings() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("business_settings")
    .select("*")
    .order("key");

  if (error) throw error;
  return (data ?? []) as BusinessSetting[];
}

export async function saveBusinessSetting(input: {
  id?: string;
  key: string;
  value: string;
  description?: string;
}) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in.");

  const payload = {
    key: input.key.trim(),
    value: input.value,
    description: input.description || null,
    updated_by: user.id,
    updated_at: new Date().toISOString(),
  };

  if (input.id) {
    const { error } = await supabase
      .from("business_settings")
      .update(payload)
      .eq("id", input.id);

    if (error) throw error;
    return;
  }

  const { error } = await supabase
    .from("business_settings")
    .upsert(payload, { onConflict: "key" });

  if (error) throw error;
}

export async function getAdminNotifications() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("admin_notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw error;
  return (data ?? []) as AdminNotification[];
}

export async function markNotificationRead(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("admin_notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

export async function getAuditLogs() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw error;
  return (data ?? []) as AuditLog[];
}
