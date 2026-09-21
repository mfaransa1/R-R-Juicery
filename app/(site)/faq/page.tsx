import FAQHero from "@/components/faq/FAQHero";
import FAQExplorer from "@/components/faq/FAQExplorer";
import FAQTransparency from "@/components/faq/FAQTransparency";
import FAQHouse from "@/components/faq/FAQHouse";
import FAQClosing from "@/components/faq/FAQClosing";

export const metadata = {
  title: "FAQ | The Rook & Reed Juicery",
  description:
    "Frequently asked questions about R&R juice, ingredients, orders, The House, events and visiting.",
};

export default function FAQPage() {
  return (
    <main>
      <FAQHero />
      <FAQExplorer />
      <FAQTransparency />
      <FAQHouse />
      <FAQClosing />
    </main>
  );
}