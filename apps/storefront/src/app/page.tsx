import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ImageJourney } from "@/components/experience/image-journey";

export const metadata: Metadata = {
  title: "Monereen — A Living Study",
  description: "Enter Monereen: an immersive visual study of cloth, craft, colour, and personal expression.",
};

export default function Home() {
  return (
    <>
      <Header />
      <main className="overflow-clip bg-[#f4f0e7] pt-16 text-[#1b1915]">
        <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden bg-black text-white">
          <Image
            src="/brand/gallery/prints-dsc04233.jpg"
            alt="A vivid Monereen printed kaftan against yellow cloth"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="experience-image object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 flex min-h-[calc(100svh-4rem)] flex-col justify-between px-5 py-7 sm:px-8 md:p-12">
            <div className="flex items-start justify-between border-t border-white/70 pt-3 text-[9px] uppercase tracking-[0.22em]">
              <p>Monereen / A living study</p>
              <p className="text-right">Dhaka · Bangladesh<br />August 2026</p>
            </div>
            <div>
              <p className="mb-5 text-[10px] uppercase tracking-[0.25em]">Personal expression in cloth</p>
              <h1 className="max-w-6xl font-heading text-[clamp(4.5rem,13vw,12rem)] font-normal leading-[0.72] tracking-[-0.065em]">Enter<br />Monereen.</h1>
              <div className="mt-9 flex items-end justify-between gap-8 border-t border-white/65 pt-5">
                <p className="max-w-md text-sm leading-6 text-white/85">An immersive journey through colour, form, cultural memory, and the intimate gestures of making.</p>
                <Link href="#manifesto" aria-label="Begin the experience" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/70 transition-colors hover:bg-white hover:text-black">
                  <ArrowDown size={18} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="manifesto" className="scroll-mt-16 bg-[#1b1915] px-5 py-28 text-[#f4f0e7] sm:px-8 md:py-44">
          <div className="mx-auto max-w-[92rem]">
            <div className="grid gap-12 md:grid-cols-12">
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/50 md:col-span-3">Manifesto / 01</p>
              <div className="md:col-span-8 md:col-start-5">
                <p className="font-heading text-[clamp(2.7rem,6vw,6rem)] leading-[1.02] tracking-[-0.045em]">
                  What begins as a personal instinct can become a lasting cultural practice.
                </p>
                <div className="mt-14 grid gap-8 text-sm leading-7 text-white/65 sm:grid-cols-2 md:text-base">
                  <p>Monereen began through passion: an instinct for cloth, detail, and bespoke creation. The work holds the memory of how it was shaped and the person who will make it their own.</p>
                  <p>The next chapter grows across apparel, artisanal craft, and design innovation while staying close to traditional craftsmanship and indigenous textiles from home.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="experience" className="relative h-[190svh] bg-[#d2b51e]">
          <div className="sticky top-16 h-[calc(100svh-4rem)] overflow-hidden">
            <Image src="/brand/gallery/kaftans-copy-of-dsc04739-04.jpg" alt="Three women in expressive Monereen kaftans" fill unoptimized sizes="100vw" className="object-cover object-top" />
            <div className="absolute inset-0 bg-black/15" />
            <div className="absolute inset-x-0 top-0 flex justify-between p-5 text-[9px] uppercase tracking-[0.22em] text-white sm:p-8 md:p-12">
              <p>Chapter 01</p><p>Together / Individual</p>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8 md:p-12">
              <h2 className="max-w-6xl font-heading text-[clamp(4rem,11vw,10rem)] leading-[0.78] tracking-[-0.06em]">Expression<br />is personal.</h2>
            </div>
          </div>
          <div className="absolute inset-x-0 top-[112svh] z-10 px-5 sm:px-8 md:px-12">
            <div className="ml-auto max-w-md border-t border-white/70 pt-4 text-sm leading-7 text-white md:text-base">
              <p>A single form becomes many things through the person inside it: ease, movement, confidence, and a private language made visible.</p>
            </div>
          </div>
        </section>

        <section className="bg-[#1b1915] px-5 py-24 text-[#f4f0e7] sm:px-8 md:py-36">
          <div className="mx-auto max-w-[92rem]">
            <div className="grid gap-5 md:grid-cols-12">
              <figure className="md:col-span-5">
                <Image src="/brand/gallery/prints-22647.jpg" alt="Close study of floral textile and ornament" width={1600} height={1069} unoptimized className="h-auto w-full" />
                <figcaption className="mt-3 flex justify-between text-[9px] uppercase tracking-[0.2em] text-white/45"><span>Surface / Detail</span><span>Fig. 02</span></figcaption>
              </figure>
              <div className="flex flex-col justify-center py-16 md:col-span-5 md:col-start-8 md:py-0">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">Chapter 02 / The near view</p>
                <h2 className="mt-6 font-heading text-5xl leading-[0.94] tracking-[-0.045em] md:text-7xl">Look closer.<br />The hand is there.</h2>
                <p className="mt-8 max-w-md text-sm leading-7 text-white/60 md:text-base">In the repeat of a motif, the edge of an embroidery, and the meeting of one material with another, attention becomes visible.</p>
              </div>
            </div>

            <div className="mt-20 grid items-end gap-5 md:mt-36 md:grid-cols-12">
              <figure className="md:col-span-4 md:col-start-2">
                <Image src="/brand/gallery/prints-33266.jpg" alt="Deep blue Monereen textile with ornate embroidery" width={1600} height={1600} unoptimized className="h-auto w-full" />
              </figure>
              <figure className="md:col-span-5 md:col-start-7 md:mb-28">
                <Image src="/brand/gallery/prints-33543.jpg" alt="Red sleeve resting across layers of patterned cloth" width={1200} height={1600} unoptimized className="h-auto w-full" />
              </figure>
            </div>
          </div>
        </section>

        <section className="flex min-h-[80svh] items-center bg-[#ece6da] px-5 py-24 sm:px-8">
          <div className="mx-auto grid w-full max-w-[92rem] gap-14 md:grid-cols-12 md:items-center">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#6b6459] md:col-span-2">A pause / 03</p>
            <blockquote className="font-heading text-[clamp(3.2rem,8vw,8rem)] leading-[0.9] tracking-[-0.055em] md:col-span-9 md:col-start-4">
              Cloth remembers<br />what words leave behind.
            </blockquote>
          </div>
        </section>

        <section className="bg-[#c44f33] px-5 py-24 text-[#171511] sm:px-8 md:py-32">
          <div className="mx-auto grid max-w-[92rem] gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="text-[10px] uppercase tracking-[0.22em]">Chapter 04 / Complete visual journey</p>
              <h2 className="mt-4 font-heading text-5xl leading-[0.94] tracking-[-0.045em] md:text-7xl">Thirty-nine frames.<br />One evolving memory.</h2>
            </div>
            <p className="max-w-md text-sm leading-7 md:col-span-4 md:col-start-9">Move through every photograph one at a time. Follow the complete arc from kaftans to print and quiet solid forms.</p>
          </div>
        </section>

        <ImageJourney />

        <section className="grid min-h-[100svh] bg-[#ece6da] md:grid-cols-2">
          <div className="relative min-h-[70svh] md:min-h-full">
            <Image src="/brand/gallery/solids-dsc-3847-01.jpg" alt="Woman in a blue Monereen garment resting in a garden" fill unoptimized sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" />
          </div>
          <div className="flex flex-col justify-between px-6 py-14 sm:px-10 md:px-14 lg:px-20">
            <div className="flex justify-between border-t border-[#8e8678] pt-3 text-[9px] uppercase tracking-[0.2em]"><span>The horizon</span><span>August 2026</span></div>
            <div className="py-24">
              <h2 className="font-heading text-5xl leading-[0.92] tracking-[-0.045em] md:text-7xl">A house with a long memory—and a longer view.</h2>
              <p className="mt-8 max-w-md text-sm leading-7 text-[#655e54] md:text-base">A platform for cultural heritage, creative exchange, conscious design, and the artisan communities who carry knowledge forward.</p>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-4 border-t border-[#8e8678] pt-5 text-[10px] uppercase tracking-[0.2em]">
              <Link href="/magazine" className="inline-flex items-center gap-2">Open Issue 01 <ArrowUpRight size={14} aria-hidden="true" /></Link>
              <Link href="/archive#image-index" className="inline-flex items-center gap-2">Enter image archive <ArrowUpRight size={14} aria-hidden="true" /></Link>
              <Link href="/about" className="inline-flex items-center gap-2">Read our story <ArrowUpRight size={14} aria-hidden="true" /></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
