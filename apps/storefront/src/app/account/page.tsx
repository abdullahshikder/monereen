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
      <main className="min-h-[75svh] bg-[#f6f2ea] px-5 pb-24 pt-36 text-[#211f1b] sm:px-8 md:pb-36 md:pt-44">
        <div className="mx-auto grid max-w-[92rem] gap-14 border-t border-[#aaa092] pt-8 md:grid-cols-[0.7fr_1.5fr] md:gap-20">
          <p className="text-[10px] uppercase tracking-[0.2em]">Profile</p>
          <div>
            <h1 className="max-w-3xl font-heading text-5xl leading-none tracking-[-0.04em] md:text-7xl">Your place in the Monereen story.</h1>
            <p className="mt-8 max-w-xl text-sm leading-7 text-[#5f594f] md:text-base">
              Customer profiles will bring order history, personal information, saved pieces, and social community connections into one considered space.
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link href="/shop" className="bg-[#211f1b] px-7 py-3.5 text-xs uppercase tracking-[0.18em] text-[#f6f2ea]">Explore the catalogue</Link>
              <Link href="/about" className="border border-[#211f1b] px-7 py-3.5 text-xs uppercase tracking-[0.18em]">Meet Monereen</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
