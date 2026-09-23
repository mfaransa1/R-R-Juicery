import OrderHero from "@/components/order/OrderHero";
import LiveOrderTracker from "@/components/order/LiveOrderTracker";
import OrderProcess from "@/components/order/OrderProcess";
import OrderClosing from "@/components/order/OrderClosing";

export const metadata = {
  title: "Track Order | The Rook & Reed Juicery",
  description: "Track your Rook & Reed Juicery order.",
};

export default function OrderPage() {
  return (
    <main>
      <OrderHero />
      <LiveOrderTracker />
      <OrderProcess />
      <OrderClosing />
    </main>
  );
}
