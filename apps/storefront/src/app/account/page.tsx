import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: "Your profile",
  description: "Your Monereen profile, orders, preferences, and community connections.",
};

export default function AccountPage() {
  return (
    <>
      <Header />
      <main className="min-h-[75svh] bg-[#f3f2f2] px-5 pb-20 pt-16 text-[#201e1d] sm:px-8 md:pb-28">
        <div className="mx-auto max-w-[1120px] py-14 md:py-20">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#7d7979]">Profile</p>
          <h1 className="mt-4 max-w-2xl font-body text-4xl font-bold leading-[1.03] tracking-[-0.03em] sm:text-5xl md:text-6xl">Your Monereen account.</h1>
          <div className="mt-10 grid gap-8 border-t-2 border-[#201e1d]/40 pt-6 md:grid-cols-[minmax(0,1fr)_18rem] md:gap-16">
            <div>
              <p className="max-w-xl text-sm leading-7 text-[#605d5d] md:text-base">
                Account features are being prepared. This space will hold your orders, saved pieces, and personal details when customer accounts are available.
              </p>
              <Link href="/shop" className="mt-8 inline-flex bg-[#ec3013] px-6 py-3.5 text-sm font-semibold text-[#f3f2f2] transition-colors hover:bg-[#ae1800]">
                Explore the collection
              </Link>
            </div>
            <div className="border-t border-[#201e1d]/40 pt-5 md:border-t-0 md:border-l md:pl-8 md:pt-0">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#7d7979]">Need help?</p>
              <Link href="/pages/contact" className="mt-3 inline-block border-b border-[#201e1d] pb-1 text-sm font-semibold transition-colors hover:border-[#ec3013] hover:text-[#ec3013]">
                Contact Monereen
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
