import AdminOrderDetail from "@/components/admin/AdminOrderDetail";

export const metadata = {
  title: "Order | R&R Control Room",
  description: "View an individual Rook & Reed order.",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <AdminOrderDetail orderId={id} />;
}
