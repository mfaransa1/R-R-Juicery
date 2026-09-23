import AccountHero from "@/components/account/AccountHero";
import AccountMain from "@/components/account/AccountMain";
import AccountQuickLinks from "@/components/account/AccountQuickLinks";
import AccountMoves from "@/components/account/AccountMoves";
import AccountContact from "@/components/account/AccountContact";
import AccountClosing from "@/components/account/AccountClosing";

export const metadata = {
  title: "Your Account | The Rook & Reed Juicery",
  description:
    "Manage your R&R account, orders, favourites and R&R MOVES.",
};

export default function AccountPage() {
  return (
    <main>
      <AccountHero />
      <AccountMain />
      <AccountQuickLinks />
      <AccountMoves />
      <AccountContact />
      <AccountClosing />
    </main>
  );
}
