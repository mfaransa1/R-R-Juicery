import AccountOrderDetail from "@/components/account/AccountOrderDetail";

export const metadata = {
  title: "Order Details | The Rook & Reed Juicery",
  description: "View your R&R order details and track your move.",
};

export default async function AccountOrderDetailPage({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  return <main><AccountOrderDetail reference={reference} /></main>;
}
