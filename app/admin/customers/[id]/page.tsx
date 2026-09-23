import AdminCustomerDetail from "@/components/admin/AdminCustomerDetail";

export const metadata = {
  title: "Customer | R&R Control Room",
};

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminCustomerDetail customerId={id} />;
}
