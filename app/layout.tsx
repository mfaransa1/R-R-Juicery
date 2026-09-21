import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const editorial = Cormorant_Garamond({
  variable: "--font-editorial",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Rook & Reed Juicery",
    template: "%s | Rook & Reed Juicery",
  },

  description:
    "Good Juice. Good Music. Good Company. An organic juicery and cultural space in Kilimani, Nairobi.",

  keywords: [
    "Rook & Reed Juicery",
    "organic juice Nairobi",
    "juice Kilimani",
    "fresh juice Nairobi",
    "jazz Nairobi",
    "Kilimani",
  ],

  metadataBase: new URL("https://rookandreedjuicery.co.ke"),

  manifest: "/site.webmanifest",

  alternates: {
    canonical: "https://rookandreedjuicery.co.ke",
  },

  authors: [
    {
      name: "Rook & Reed Juicery",
    },
  ],

  creator: "Rook & Reed Juicery",
  publisher: "Rook & Reed Juicery",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Rook & Reed Juicery",
    description:
      "Good Juice. Good Music. Good Company.",
    type: "website",
    locale: "en_KE",
  },

  twitter: {
    card: "summary_large_image",
    title: "Rook & Reed Juicery",
    description:
      "Good Juice. Good Music. Good Company.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${editorial.variable} ${sans.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}