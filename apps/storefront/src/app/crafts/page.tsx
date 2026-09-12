import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Craft",
  description: "Explore the surfaces, materials, and artisanal details shaping Monereen.",
};

const craftDirections = [
  {
    id: "potlis",
    title: "Potlis",
    category: "Bags in development",
    description: "Compact forms envisioned through textile, surface, and ornament.",
    image: "/brand/archive/prints-detail.jpg",
    alt: "Close detail of layered red and printed Monereen textiles",
  },
  {
    id: "totes",
    title: "Totes",
    category: "Bags in development",
    description: "Everyday utility shaped by expressive cloth and considered construction.",
    image: "/brand/editorial/print-blue.jpg",
    alt: "Close view of embroidery and print on a deep blue Monereen garment",
  },
  {
    id: "scarves",
    title: "Scarves",
    category: "Accessories in development",
    description: "A future study in drape, motif, colour, and movement.",
    image: "/brand/editorial/print-red.jpg",
    alt: "Detail of a red printed Monereen garment",
  },
] as const;

export default function CraftsPage() {
  return (
    <>
      <Header />
      <main className="bg-[#f3f2f2] pt-16 text-[#201e1d]">
        <section className="mx-auto grid max-w-[1440px] gap-8 px-5 py-8 sm:px-8 md:grid-cols-[minmax(20rem,.8fr)_minmax(0,1.2fr)] md:py-10">
          <div className="flex flex-col justify-between border-t border-[#201e1d]/40 pt-6 md:border-t-0 md:pt-0">
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#7d7979]">Craft</p>
              <h1 className="mt-4 max-w-xl font-body text-4xl font-bold leading-[1.03] tracking-[-0.03em] sm:text-5xl md:text-6xl">Made by attention.</h1>
              <p className="mt-6 max-w-lg text-sm leading-7 text-[#605d5d] md:text-base">
                A growing study of the material gestures behind Monereen, from printed surface and embroidery to the future forms they can inhabit.
              </p>
            </div>
            <Link href="#category-studies" className="mt-10 inline-flex w-fit items-center gap-3 border-b border-[#201e1d] pb-2 text-sm font-semibold transition-colors hover:border-[#ec3013] hover:text-[#ec3013]">
              Explore material studies <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden bg-[#d7d3d3] grayscale md:aspect-auto md:min-h-[34rem]">
            <Image src="/brand/editorial/solid-duo.jpg" alt="Two women wearing embroidered black Monereen garments" fill priority sizes="(max-width: 767px) 100vw, 60vw" className="object-cover" />
          </div>
        </section>

        <section id="category-studies" className="scroll-mt-24 border-t-2 border-[#201e1d]/40 px-5 py-14 sm:px-8 md:py-20">
          <div className="mx-auto max-w-[1440px]">
            <h2 className="max-w-2xl font-body text-3xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-4xl">The craft portfolio begins here.</h2>
            <div className="mt-10 grid gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-7 md:gap-y-16">
              {craftDirections.map((item, index) => (
                <Link href={`/crafts/${item.id}`} id={item.id} key={item.id} className={`group block scroll-mt-24 ${index === 1 ? "md:mt-14" : ""}`}>
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#d7d3d3] grayscale transition-[filter] duration-500 hover:grayscale-0">
                    <Image src={item.image} alt={item.alt} fill sizes="(max-width: 767px) 100vw, 33vw" className="object-cover" />
                  </div>
                  <p className="mt-4 text-[10px] uppercase tracking-[0.13em] text-[#605d5d]">{item.category}</p>
                  <h3 className="mt-2 font-body text-xl font-semibold tracking-[-0.02em] transition-colors group-hover:text-[#ec3013]">{item.title}</h3>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-[#605d5d]">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t-2 border-[#201e1d]/40 px-5 py-14 sm:px-8 md:py-20">
          <div className="mx-auto grid max-w-[1440px] gap-8 border-b border-[#201e1d]/40 pb-12 md:grid-cols-[minmax(0,1fr)_minmax(18rem,.7fr)] md:items-end">
            <h2 className="max-w-2xl font-body text-3xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-4xl">A portfolio still taking shape.</h2>
            <div>
              <p className="max-w-md text-sm leading-7 text-[#605d5d]">The current photographs document Monereen’s textile language. Product-specific bag and scarf imagery will join this page as those categories are completed.</p>
              <Link href="/about#collaborate" className="mt-7 inline-flex bg-[#ec3013] px-6 py-3.5 text-sm font-semibold text-[#f3f2f2] transition-colors hover:bg-[#ae1800]">
                Collaborate with Monereen
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
