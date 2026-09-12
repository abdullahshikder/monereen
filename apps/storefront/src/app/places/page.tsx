import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Places",
  description: "A visual record of the places, textiles, and cultural context that shape Monereen.",
};

export default function PlacesPage() {
  return (
    <>
      <Header />
      <main className="bg-[#f3f2f2] pt-16 text-[#201e1d]">
        <section className="mx-auto grid max-w-[1440px] gap-8 px-5 py-8 sm:px-8 md:grid-cols-[minmax(20rem,.85fr)_minmax(0,1.15fr)] md:py-10">
          <div className="flex flex-col justify-between border-t border-[#201e1d]/40 pt-6 md:border-t-0 md:pt-0">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#605d5d]">Places</p>
              <h1 className="mt-4 max-w-[10ch] text-4xl font-bold leading-[1.03] tracking-[-0.045em] sm:text-5xl md:text-6xl">Rooted close to home.</h1>
              <p className="mt-6 max-w-lg text-sm leading-7 text-[#605d5d] md:text-base">Monereen is made in Bangladesh, with a point of view shaped by local textiles, cultural memory, and a wider conversation about dress.</p>
            </div>
            <Link href="/places/bangladesh" className="mt-10 inline-flex w-fit items-center gap-3 border-b border-[#201e1d] pb-2 text-sm font-semibold transition-colors hover:border-[#ec3013] hover:text-[#ec3013]">
              Read the place study <ArrowUpRight size={17} weight="light" aria-hidden="true" />
            </Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden bg-[#d7d3d3] grayscale md:aspect-auto md:min-h-[34rem]">
            <Image src="/brand/editorial/solid-lifestyle.jpg" alt="Monereen garment photographed in a garden setting" fill priority sizes="(max-width: 767px) 100vw, 58vw" className="object-cover" />
          </div>
        </section>

        <section className="border-t-2 border-[#201e1d]/40 px-5 py-14 sm:px-8 md:py-20">
          <div className="mx-auto grid max-w-[1440px] gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,.8fr)] md:items-end">
            <div className="relative aspect-[16/10] overflow-hidden bg-[#d7d3d3] grayscale">
              <Image src="/brand/archive/prints-hero.jpg" alt="Monereen printed garment in a landscape" fill sizes="(min-width: 768px) 65vw, 100vw" className="object-cover" />
            </div>
            <div>
              <h2 className="max-w-[12ch] text-3xl font-bold leading-[1.05] tracking-[-0.035em] sm:text-4xl">Cloth connects the place and the person.</h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-[#605d5d]">The archive follows this connection through colour, material, and the evolving forms of the collection.</p>
              <Link href="/archive" className="mt-6 inline-flex items-center gap-2 border-b border-[#201e1d] pb-1.5 text-sm font-semibold transition-colors hover:border-[#ec3013] hover:text-[#ec3013]">
                Explore the archive <ArrowUpRight size={16} weight="light" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
