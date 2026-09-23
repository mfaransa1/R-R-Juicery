import AccountOrderHistory from "@/components/account/AccountOrderHistory";

export const metadata = {
  title: "Your Moves | R&R Passport",
  description: "View your Rook & Reed order history.",
};

export default function AccountOrdersPage() {
  return <AccountOrderHistory />;
}
