import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Makers",
  description: "The relationships, techniques, and hands that shape the work at Monereen.",
};

const makerStudies = [
  { title: "Textile knowledge", href: "/makers/textile-knowledge", text: "A growing practice shaped by craft traditions, material intelligence, and the people who carry them forward.", image: "/brand/archive/prints-detail.jpg", alt: "Detailed Monereen textile and embroidery" },
  { title: "The studio relationship", href: "/makers/studio-relationship", text: "Design decisions become garments through close attention to surface, proportion, and finishing.", image: "/brand/editorial/solid-grey.jpg", alt: "Monereen solid garment showing construction and line" },
  { title: "Making together", href: "/makers/making-together", text: "Monereen is building a future that keeps creative partnership and artisan livelihoods in view.", image: "/brand/editorial/kaftan-jute.jpg", alt: "Monereen jute kaftan photographed outdoors" },
] as const;

export default function MakersPage() {
  return (
    <>
      <Header />
      <main className="bg-[#f3f2f2] pt-16 text-[#201e1d]">
        <section className="mx-auto grid max-w-[1440px] gap-8 px-5 py-8 sm:px-8 md:grid-cols-[minmax(0,1.15fr)_minmax(20rem,.85fr)] md:py-10">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#d7d3d3] grayscale md:aspect-auto md:min-h-[34rem]">
            <Image src="/brand/editorial/solid-duo.jpg" alt="Two people wearing Monereen garments" fill priority sizes="(max-width: 767px) 100vw, 58vw" className="object-cover" />
          </div>
          <div className="flex flex-col justify-between border-t border-[#201e1d]/40 pt-6 md:border-t-0 md:pt-0">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#605d5d]">Makers</p>
              <h1 className="mt-4 max-w-[10ch] text-4xl font-bold leading-[1.03] tracking-[-0.045em] sm:text-5xl md:text-6xl">People make the difference.</h1>
              <p className="mt-6 max-w-lg text-sm leading-7 text-[#605d5d] md:text-base">The work begins with relationships: people who understand the cloth, recognise the detail, and make every finished piece possible.</p>
            </div>
            <Link href="/about#collaborate" className="mt-10 inline-flex w-fit items-center gap-3 border-b border-[#201e1d] pb-2 text-sm font-semibold transition-colors hover:border-[#ec3013] hover:text-[#ec3013]">
              Work with Monereen <ArrowUpRight size={17} weight="light" aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="border-t-2 border-[#201e1d]/40 px-5 py-14 sm:px-8 md:py-20">
          <div className="mx-auto max-w-[1440px]">
            <h2 className="max-w-2xl text-3xl font-bold leading-[1.05] tracking-[-0.035em] sm:text-4xl">A practice that stays close to the hand.</h2>
            <div className="mt-10 grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)]">
              {makerStudies.map((study, index) => (
                <Link key={study.title} href={study.href} className={`group block ${index === 0 ? "md:row-span-2" : ""}`}>
                  <div className={`relative overflow-hidden bg-[#d7d3d3] grayscale transition-[filter] duration-500 group-hover:grayscale-0 ${index === 0 ? "aspect-[4/5]" : "aspect-[16/10]"}`}>
                    <Image src={study.image} alt={study.alt} fill sizes={index === 0 ? "(min-width: 768px) 55vw, 100vw" : "(min-width: 768px) 45vw, 100vw"} className="object-cover transition-transform duration-500 group-hover:scale-[1.015]" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold tracking-[-0.02em] transition-colors group-hover:text-[#ec3013] md:text-2xl">{study.title}</h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-[#605d5d]">{study.text}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
