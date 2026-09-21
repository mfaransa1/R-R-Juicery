import SiteHeader from "@/components/navigation/SiteHeader";
import SiteFooter from "@/components/footer/SiteFooter";
import { RRCartProvider } from "@/components/cart/RRCartProvider";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RRCartProvider>
      <SiteHeader />

      <div className="min-h-screen">
        {children}
      </div>

      <SiteFooter />
    </RRCartProvider>
  );
}