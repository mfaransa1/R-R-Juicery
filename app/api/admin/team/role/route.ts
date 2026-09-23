import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const { data: caller } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (caller?.role !== "admin") return NextResponse.json({ error: "Administrator access required." }, { status: 403 });

  let body: { userId?: string; role?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const userId = body.userId;
  const role = body.role;
  if (!userId || !["staff", "admin", "customer"].includes(role || "")) return NextResponse.json({ error: "Invalid account or role." }, { status: 400 });
  if (userId === user.id && role !== "admin") return NextResponse.json({ error: "You cannot remove your own administrator access." }, { status: 400 });

  const admin = createAdminClient();
  if (role !== "admin") {
    const { data: admins, error } = await admin.from("profiles").select("id").eq("role", "admin");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if ((admins?.length ?? 0) <= 1) return NextResponse.json({ error: "Keep at least one administrator account." }, { status: 400 });
  }

  const { error } = await admin.from("profiles").update({ role, updated_at: new Date().toISOString() }).eq("id", userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
