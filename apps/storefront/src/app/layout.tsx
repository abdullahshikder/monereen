import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { SiteLoader } from "@/components/layout/site-loader";
import "./globals.css";

const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap" });

export const metadata: Metadata = {
  applicationName: "Monereen",
  title: {
    default: "Monereen",
    template: "%s — Monereen",
  },
  description:
    "A digital exhibition, archive, portfolio, and store where products exist inside stories.",
  openGraph: {
    title: "Monereen",
    description: "Products inside stories",
    type: "website",
  },
  icons: {
    icon: [{ url: "/brand/monereen-loader.png", type: "image/png" }],
    apple: "/brand/monereen-loader.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={archivo.variable}>
        <SiteLoader />
        {children}
      </body>
    </html>
  );
}
