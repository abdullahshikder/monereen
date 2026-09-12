import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Materials",
  description: "Textile, surface, and finishing studies from Monereen.",
};

const materialStudies = [
  { title: "Jamdani", href: "/materials/jamdani", note: "Textile study", image: "/brand/archive/prints-floral.jpg", alt: "Floral Monereen textile detail" },
  { title: "Printed cloth", href: "/materials/printed-cloth", note: "Surface and colour", image: "/brand/editorial/print-black.jpg", alt: "Black and ivory Monereen printed fabric" },
  { title: "Embroidery", href: "/materials/embroidery", note: "Hand-finished detail", image: "/brand/editorial/solid-black.jpg", alt: "Black Monereen garment with embroidered embellishment" },
] as const;

export default function MaterialsPage() {
  return (
    <>
      <Header />
      <main className="bg-[#f3f2f2] pt-16 text-[#201e1d]">
        <section className="border-b-2 border-[#201e1d]/40 px-5 pb-10 pt-14 sm:px-8 md:pb-14 md:pt-20">
          <div className="mx-auto max-w-[1440px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#605d5d]">Materials</p>
            <h1 className="mt-4 max-w-[12ch] text-4xl font-bold leading-[1.03] tracking-[-0.045em] sm:text-5xl md:text-6xl">Cloth is where the story begins.</h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-[#605d5d] md:text-base">Every surface carries its own instruction. The studio looks closely at texture, weight, colour, and the details that let a material speak.</p>
          </div>
        </section>

        <section className="px-5 py-10 sm:px-8 md:py-14">
          <div className="mx-auto grid max-w-[1440px] gap-x-6 gap-y-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)]">
            {materialStudies.map((study, index) => (
              <Link key={study.title} href={study.href} className={`group border-t border-[#201e1d]/40 pt-4 ${index === 0 ? "md:row-span-2" : ""}`}>
                <div className={`relative overflow-hidden bg-[#d7d3d3] grayscale transition-[filter] duration-500 group-hover:grayscale-0 ${index === 0 ? "aspect-[4/5]" : "aspect-[16/10]"}`}>
                  <Image src={study.image} alt={study.alt} fill sizes={index === 0 ? "(min-width: 768px) 55vw, 100vw" : "(min-width: 768px) 45vw, 100vw"} className="object-cover transition-transform duration-500 group-hover:scale-[1.015]" />
                </div>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#605d5d]">{study.note}</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.025em] transition-colors group-hover:text-[#ec3013] md:text-3xl">{study.title}</h2>
                  </div>
                  <ArrowUpRight size={18} weight="light" aria-hidden="true" className="mt-1 shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
