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
    number: "01",
    title: "Potlis",
    category: "Bags · In development",
    description: "Compact forms envisioned through textile, surface, and ornament.",
    image: "/brand/archive/prints-detail.jpg",
    alt: "Close detail of layered red and printed Monereen textiles",
  },
  {
    id: "totes",
    number: "02",
    title: "Totes",
    category: "Bags · In development",
    description: "Everyday utility shaped by expressive cloth and considered construction.",
    image: "/brand/editorial/print-blue.jpg",
    alt: "Close view of embroidery and print on a deep blue Monereen garment",
  },
  {
    id: "scarves",
    number: "03",
    title: "Scarves",
    category: "Accessories · In development",
    description: "A future study in drape, motif, colour, and movement.",
    image: "/brand/editorial/print-red.jpg",
    alt: "Detail of a red printed Monereen garment",
  },
] as const;

export default function CraftsPage() {
  return (
    <>
      <Header />
      <main className="bg-[#f6f2ea] pt-16 text-[#211f1b]">
        <section className="grid min-h-[80svh] md:grid-cols-2">
          <div className="flex flex-col justify-between px-5 py-12 sm:px-8 md:px-12 md:py-16">
            <p className="text-[10px] uppercase tracking-[0.2em]">Craft / Material language</p>
            <div className="py-20">
              <h1 className="font-heading text-[clamp(4rem,9vw,8rem)] leading-[0.82] tracking-[-0.05em]">Made by attention.</h1>
              <p className="mt-9 max-w-lg text-sm leading-7 text-[#655e54] md:text-base">
                A growing study of the material gestures behind Monereen—from printed surface and embroidery to the future forms they can inhabit.
              </p>
            </div>
            <p className="border-t border-[#aaa092] pt-5 text-[10px] uppercase tracking-[0.18em] text-[#6e655a]">Bags · Accessories · Textile studies</p>
          </div>
          <div className="relative min-h-[65svh] md:min-h-0">
            <Image src="/brand/editorial/solid-duo.jpg" alt="Two women wearing embroidered black Monereen garments" fill priority sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" />
          </div>
        </section>

        <section className="border-y border-[#d8d1c4] bg-[#e7ded2] px-5 py-20 sm:px-8 md:py-28">
          <div className="mx-auto max-w-[92rem]">
            <div className="mb-14 grid gap-8 md:grid-cols-[0.7fr_1.5fr]">
              <p className="text-[10px] uppercase tracking-[0.2em]">Category studies</p>
              <h2 className="max-w-4xl font-heading text-4xl leading-tight tracking-[-0.035em] md:text-6xl">The craft portfolio begins here.</h2>
            </div>
            <div className="grid gap-12 md:grid-cols-3 md:gap-5">
              {craftDirections.map((item, index) => (
                <article id={item.id} key={item.id} className={`scroll-mt-24 ${index === 1 ? "md:mt-24" : ""}`}>
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#d8d1c4]">
                    <Image src={item.image} alt={item.alt} fill sizes="(max-width: 767px) 100vw, 33vw" className="object-cover" />
                  </div>
                  <div className="mt-5 border-t border-[#aaa092] pt-4">
                    <p className="text-[9px] uppercase tracking-[0.18em] text-[#6e655a]">{item.number} · {item.category}</p>
                    <h3 className="mt-3 font-heading text-3xl">{item.title}</h3>
                    <p className="mt-4 max-w-sm text-sm leading-6 text-[#655e54]">{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#211f1b] px-5 py-24 text-[#f6f2ea] sm:px-8 md:py-32">
          <div className="mx-auto grid max-w-[92rem] gap-10 md:grid-cols-2 md:items-end">
            <h2 className="font-heading text-5xl leading-none tracking-[-0.04em] md:text-7xl">A portfolio still taking shape.</h2>
            <div className="md:justify-self-end">
              <p className="max-w-md text-sm leading-7 text-white/70">The current photographs document Monereen’s established textile language. Product-specific bag and scarf imagery will join this page as those categories are completed.</p>
              <Link href="/about#collaborate" className="mt-8 inline-flex items-center gap-3 border-b border-current pb-2 text-xs uppercase tracking-[0.2em]">
                Collaborate with Monereen <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
