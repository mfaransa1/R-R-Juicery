import ContactHero from "@/components/contact/ContactHero";
import ContactDetails from "@/components/contact/ContactDetails";
import ContactMain from "@/components/contact/ContactMain";
import ContactSocial from "@/components/contact/ContactSocial";
import ContactClosing from "@/components/contact/ContactClosing";

export const metadata = {
  title: "Contact | The Rook & Reed Juicery",
  description:
    "Contact The Rook & Reed Juicery in Kilimani, Nairobi.",
};

export default function ContactPage() {
  return (
    <main>
      <ContactHero />
      <ContactDetails />
      <ContactMain />
      <ContactSocial />
      <ContactClosing />
    </main>
  );
}