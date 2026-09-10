import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: "About",
  description: "Monereen is an artisanal fashion label devoted to personal expression, heritage, and thoughtful craft.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="bg-[#f6f2ea] pt-16 text-[#211f1b]">
        <section className="px-5 py-24 sm:px-8 md:py-36">
          <div className="mx-auto grid max-w-[92rem] gap-12 md:grid-cols-[0.7fr_1.5fr] md:gap-20">
            <p className="border-t border-[#aaa092] pt-5 text-[10px] uppercase tracking-[0.2em]">About Monereen</p>
            <div>
              <h1 className="max-w-5xl font-heading text-5xl leading-[0.98] tracking-[-0.045em] md:text-7xl lg:text-8xl">
                Personal expression, made tangible.
              </h1>
              <p className="mt-10 max-w-2xl text-base leading-8 text-[#5f594f] md:text-lg">
                Monereen is an artisanal fashion label founded on passion and devoted to bespoke creation. Each piece is shaped through thoughtful design, rigorous attention to detail, and an enduring respect for the craft.
              </p>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-2">
          <div className="relative min-h-[65svh]">
            <Image src="/brand/archive/prints-floral.jpg" alt="Monereen floral garment in warm afternoon light" fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover object-top" />
          </div>
          <div className="flex items-center bg-[#e7ded2] px-6 py-20 sm:px-10 md:px-16 lg:px-24">
            <div className="max-w-xl">
              <p className="text-[10px] uppercase tracking-[0.2em]">A pivotal loop</p>
              <h2 className="mt-6 font-heading text-4xl leading-tight tracking-[-0.03em] md:text-6xl">From a personal beginning to a long-term practice.</h2>
              <p className="mt-8 text-sm leading-7 text-[#5f594f] md:text-base">
                The journey has included a distinct identity, a deliberate pause, and a transformative return. The next chapter expands Monereen across apparel, artisanal craft, and design innovation while remaining rooted in traditional craftsmanship and indigenous textiles close to home.
              </p>
            </div>
          </div>
        </section>

        <section id="collaborate" className="scroll-mt-20 bg-[#211f1b] px-5 py-24 text-[#f6f2ea] sm:px-8 md:py-36">
          <div className="mx-auto grid max-w-[92rem] gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/55">Innovation / Collaborate</p>
              <h2 className="mt-6 font-heading text-5xl leading-none tracking-[-0.04em] md:text-7xl">Make the next chapter together.</h2>
            </div>
            <div className="md:col-span-5 md:col-start-8">
              <p className="text-base leading-8 text-white/75">
                Monereen welcomes thoughtful collaboration with artisans, textile practitioners, artists, designers, and cultural storytellers whose work can deepen the relationship between heritage and contemporary expression.
              </p>
              <Link href="/pages/contact" className="mt-10 inline-block border-b border-current pb-2 text-xs uppercase tracking-[0.2em]">Begin a conversation</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
