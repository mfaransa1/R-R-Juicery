import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const allowedRoles = new Set(["staff", "admin"]);

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { data: caller } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (caller?.role !== "admin") return NextResponse.json({ error: "Administrator access required." }, { status: 403 });

  let body: { email?: string; fullName?: string; phone?: string; role?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const email = body.email?.trim().toLowerCase();
  const fullName = body.fullName?.trim() || null;
  const phone = body.phone?.trim() || null;
  const role = body.role?.trim();

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  if (!role || !allowedRoles.has(role)) return NextResponse.json({ error: "Choose Staff or Admin." }, { status: 400 });

  const admin = createAdminClient();
  const { data: usersData, error: listError } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (listError) return NextResponse.json({ error: listError.message }, { status: 500 });

  const existing = usersData.users.find((item) => item.email?.toLowerCase() === email);

  if (existing) {
    const { error: updateError } = await admin.from("profiles").update({ full_name: fullName, phone, role, updated_at: new Date().toISOString() }).eq("id", existing.id);
    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
    return NextResponse.json({ ok: true, mode: "assigned", message: `${email} already has an account. The account has been assigned ${role}.` });
  }

  const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName, phone },
  });
  if (inviteError || !invited.user) return NextResponse.json({ error: inviteError?.message || "Invitation could not be sent." }, { status: 500 });

  // The existing auth trigger creates the profile as a customer. Promote it immediately.
  const { error: profileError } = await admin.from("profiles").update({ full_name: fullName, phone, role, updated_at: new Date().toISOString() }).eq("id", invited.user.id);
  if (profileError) return NextResponse.json({ error: `Invitation was sent, but the staff profile could not be assigned: ${profileError.message}` }, { status: 500 });

  return NextResponse.json({ ok: true, mode: "invited", message: `Invitation sent to ${email} as ${role}.` });
}
