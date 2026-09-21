import OrderHero from "@/components/order/OrderHero";
import OrderTracker from "@/components/order/OrderTracker";
import OrderPickupDelivery from "@/components/order/OrderPickupDelivery";
import OrderProcess from "@/components/order/OrderProcess";
import OrderClosing from "@/components/order/OrderClosing";

export const metadata = {
  title: "Track Order | The Rook & Reed Juicery",
  description:
    "Track your R&R juice order from preparation to pickup or delivery.",
};

export default function OrderPage() {
  return (
    <main>
      <OrderHero />
      <OrderTracker />
      <OrderPickupDelivery />
      <OrderProcess />
      <OrderClosing />
    </main>
  );
}