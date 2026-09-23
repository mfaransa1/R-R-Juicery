import { redirect } from "next/navigation";
import AdminCustomers, {
  type AdminCustomer,
} from "@/components/admin/AdminCustomers";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Customers | R&R Control Room",
};

export default async function AdminCustomersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  // Customer records are restricted to administrators for now.
  if (profile?.role !== "admin") redirect("/admin");

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, email, full_name, phone, created_at")
    .eq("role", "customer")
    .order("created_at", { ascending: false });

  if (profilesError) {
    throw new Error(profilesError.message);
  }

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("id, customer_id, total, created_at")
    .not("customer_id", "is", null)
    .order("created_at", { ascending: false });

  if (ordersError) {
    throw new Error(ordersError.message);
  }

  const customerIds = (profiles ?? []).map((profile) => profile.id);

  const orderMap = new Map<
    string,
    { count: number; total: number; lastOrderAt: string | null }
  >();

  for (const order of orders ?? []) {
    if (!order.customer_id || !customerIds.includes(order.customer_id)) continue;

    const current = orderMap.get(order.customer_id) ?? {
      count: 0,
      total: 0,
      lastOrderAt: null,
    };

    current.count += 1;
    current.total += Number(order.total ?? 0);

    if (
      !current.lastOrderAt ||
      new Date(order.created_at).getTime() >
        new Date(current.lastOrderAt).getTime()
    ) {
      current.lastOrderAt = order.created_at;
    }

    orderMap.set(order.customer_id, current);
  }

  const customers: AdminCustomer[] = (profiles ?? []).map((profile) => {
    const activity = orderMap.get(profile.id) ?? {
      count: 0,
      total: 0,
      lastOrderAt: null,
    };

    return {
      id: profile.id,
      full_name: profile.full_name,
      phone: profile.phone,
      created_at: profile.created_at,
      email: profile.email ?? "No email recorded",
      orderCount: activity.count,
      totalSpent: activity.total,
      lastOrderAt: activity.lastOrderAt,
    };
  });

  return <AdminCustomers initialCustomers={customers} />;
}
