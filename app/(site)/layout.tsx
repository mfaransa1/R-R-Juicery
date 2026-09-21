import SiteHeader from "@/components/navigation/SiteHeader";
import SiteFooter from "@/components/footer/SiteFooter";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteHeader />

      <div className="min-h-screen">
        {children}
      </div>

      <SiteFooter />
    </>
  );
}