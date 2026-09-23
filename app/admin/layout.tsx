import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || (profile.role !== "staff" && profile.role !== "admin")) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#f5f1e8] text-[#111]">
      <AdminNav
        name={profile.full_name || profile.email || user.email || "R&R Staff"}
        role={profile.role}
      />
      <div className="lg:pl-[250px]">{children}</div>
    </div>
  );
}
