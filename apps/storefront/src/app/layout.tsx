import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SiteLoader } from "@/components/layout/site-loader";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Monereen — Products Inside Stories",
    template: "%s | Monereen",
  },
  description:
    "A digital exhibition, archive, portfolio, and store where products exist inside stories.",
  openGraph: {
    title: "Monereen",
    description: "Products inside stories",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable}`}>
        <SiteLoader />
        {children}
      </body>
    </html>
  );
}
