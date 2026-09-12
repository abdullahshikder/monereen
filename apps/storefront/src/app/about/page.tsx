import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

const chapters = [
  {
    title: "A personal beginning",
    copy: "An instinct for colour, cloth, and pieces made for the person wearing them.",
  },
  {
    title: "The deliberate pause",
    copy: "Time to refine the identity, understand the work, and choose a more purposeful direction.",
  },
  {
    title: "The pivotal loop",
    copy: "A return with a wider horizon across apparel, artisanal craft, and design innovation.",
  },
] as const;

export const metadata: Metadata = {
  title: "About",
  description: "Monereen is an artisanal fashion label devoted to personal expression, heritage, and thoughtful craft.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="bg-[#f3f2f2] pt-16 text-[#201e1d]">
        <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 md:py-20">
          <div className="border-t-2 border-[#201e1d]/40 pt-6">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#7d7979]">About Monereen</p>
            <div className="mt-4 max-w-5xl">
              <h1 className="font-body text-4xl font-bold leading-[1.03] tracking-[-0.03em] sm:text-5xl md:text-6xl lg:text-7xl">
                Personal expression, made tangible.
              </h1>
              <p className="mt-7 max-w-2xl text-sm leading-7 text-[#605d5d] md:text-base">
                Monereen is an artisanal fashion label founded on passion and devoted to bespoke creation. Each piece is shaped through thoughtful design, rigorous attention to detail, and an enduring respect for the craft.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="journey-title" className="border-t-2 border-[#201e1d]/40 px-5 py-14 sm:px-8 md:py-20">
          <div className="mx-auto max-w-[1440px]">
            <h2 id="journey-title" className="max-w-3xl font-body text-3xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-4xl">The path was never a straight line.</h2>
            <ol className="mt-10 grid border-t border-[#201e1d]/40 md:grid-cols-3">
              {chapters.map((chapter) => (
                <li key={chapter.title} className="border-b border-[#201e1d]/40 py-6 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
                  <div className="max-w-sm">
                    <h3 className="font-body text-xl font-semibold tracking-[-0.02em]">{chapter.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-[#605d5d]">{chapter.copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t-2 border-[#201e1d]/40 px-5 py-14 sm:px-8 md:py-20">
          <div className="mx-auto grid max-w-[1440px] gap-8 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#d7d3d3] grayscale md:aspect-auto md:min-h-[34rem]">
            <Image
              src="/brand/gallery/kaftans-copy-of-dsc04739-04.jpg"
              alt="Three women wearing expressive Monereen kaftans against pink cloth"
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              className="object-cover object-[center_35%]"
            />
          </div>
          <div className="flex items-center border-t border-[#201e1d]/40 pt-6 md:border-l md:border-t-0 md:pl-12 md:pt-0">
            <div className="max-w-xl">
              <h2 className="font-body text-3xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-4xl">From a personal beginning to a long-term practice.</h2>
              <p className="mt-6 text-sm leading-7 text-[#605d5d] md:text-base">
                The journey has included a distinct identity, a deliberate pause, and a transformative return. The next chapter expands Monereen across apparel, artisanal craft, and design innovation while remaining rooted in traditional craftsmanship and indigenous textiles close to home.
              </p>
            </div>
          </div>
          </div>
        </section>

        <section id="collaborate" className="scroll-mt-20 border-t-2 border-[#201e1d]/40 px-5 py-14 sm:px-8 md:py-20">
          <div className="mx-auto grid max-w-[1440px] gap-8 border-b border-[#201e1d]/40 pb-12 md:grid-cols-[minmax(0,1fr)_minmax(20rem,.75fr)] md:items-end">
            <div>
              <h2 className="max-w-2xl font-body text-3xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-4xl">Make the next chapter together.</h2>
            </div>
            <div>
              <p className="text-sm leading-7 text-[#605d5d] md:text-base">
                Monereen welcomes thoughtful collaboration with artisans, textile practitioners, artists, designers, and cultural storytellers whose work can deepen the relationship between heritage and contemporary expression.
              </p>
              <Link href="/pages/contact" className="mt-7 inline-flex bg-[#ec3013] px-6 py-3.5 text-sm font-semibold text-[#f3f2f2] transition-colors hover:bg-[#ae1800]">Begin a conversation</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
