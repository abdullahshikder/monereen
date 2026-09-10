import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { allBrandImages } from "@/lib/brand-gallery";

export const metadata: Metadata = {
  title: "Magazine — Issue 01",
  description: "Monereen Magazine Issue 01: The Pivotal Loop, an editorial study of cloth, colour, form, and cultural memory.",
};

const contents = [
  ["08", "The Pivotal Loop", "A house takes shape"],
  ["18", "A Language of Cloth", "Print, solid, and surface"],
  ["32", "Four Horizons", "The collections ahead"],
  ["44", "Working Index", "Thirty-nine archive frames"],
] as const;

export default function MagazinePage() {
  return (
    <>
      <Header />
      <main className="bg-[#f2eee5] pt-16 text-[#181713]">
        <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden bg-black text-white">
          <Image
            src="/brand/gallery/prints-dsc04233.jpg"
            alt="Monereen printed kaftan against vivid yellow cloth"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 flex min-h-[calc(100svh-4rem)] flex-col justify-between p-4 sm:p-7 md:p-10">
            <div className="flex items-start justify-between border-t border-white/80 pt-3 text-[10px] uppercase tracking-[0.22em]">
              <p>Issue 01 · August 2026</p>
              <p className="text-right">Fashion · Craft · Culture<br />Dhaka, Bangladesh</p>
            </div>
            <div>
              <h1 className="font-heading text-[clamp(4.5rem,15vw,14rem)] font-normal leading-[0.68] tracking-[-0.07em]">Monereen</h1>
              <div className="mt-8 grid gap-5 border-y border-white/70 py-4 sm:grid-cols-[1fr_auto] sm:items-end">
                <p className="max-w-xl font-heading text-2xl leading-tight sm:text-3xl md:text-4xl">The Pivotal Loop<br />A house in the making</p>
                <Link href="#inside" className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em]">Open the issue <ArrowDown size={15} aria-hidden="true" /></Link>
              </div>
            </div>
          </div>
        </section>

        <section id="inside" className="scroll-mt-16 border-b border-[#292720] bg-[#181713] px-5 py-20 text-[#f2eee5] sm:px-8 md:py-28">
          <div className="mx-auto max-w-[92rem]">
            <div className="grid gap-12 md:grid-cols-12">
              <div className="md:col-span-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/55">Inside Issue 01</p>
                <h2 className="mt-5 font-heading text-5xl leading-none tracking-[-0.045em] md:text-7xl">Contents</h2>
              </div>
              <ol className="border-t border-white/35 md:col-span-7 md:col-start-6">
                {contents.map(([page, title, note]) => (
                  <li key={page} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-white/25 py-5 md:grid-cols-[4rem_1fr_12rem] md:items-baseline">
                    <span className="text-[10px] tabular-nums text-white/45">{page}</span>
                    <span className="font-heading text-2xl md:text-3xl">{title}</span>
                    <span className="col-start-2 text-xs text-white/55 md:col-start-auto">{note}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <article className="px-5 py-24 sm:px-8 md:py-36">
          <div className="mx-auto max-w-[92rem]">
            <div className="grid gap-12 md:grid-cols-12">
              <header className="md:col-span-7">
                <p className="text-[10px] uppercase tracking-[0.22em]">Essay 01 · Identity</p>
                <h2 className="mt-6 font-heading text-6xl leading-[0.9] tracking-[-0.05em] md:text-8xl lg:text-9xl">The pivotal<br />loop.</h2>
              </header>
              <div className="md:col-span-4 md:col-start-9 md:pt-20">
                <p className="font-heading text-2xl leading-snug">What begins as personal expression can become a lasting cultural practice.</p>
                <p className="mt-7 text-sm leading-7 text-[#625c51] md:text-base">
                  Monereen began through passion: a private instinct for cloth, detail, and bespoke creation. The path since has been deliberate—an identity formed, a pause taken, and a return with greater clarity about what the house can become.
                </p>
              </div>
            </div>

            <div className="mt-24 grid gap-5 md:mt-36 md:grid-cols-12">
              <figure className="md:col-span-7">
                <Image src="/brand/gallery/kaftans-copy-of-dsc04739-04.jpg" alt="Three women wearing colourful Monereen kaftans" width={1244} height={1600} unoptimized className="h-auto w-full" />
                <figcaption className="mt-3 flex justify-between text-[9px] uppercase tracking-[0.18em]"><span>Collective expression</span><span>Fig. 01</span></figcaption>
              </figure>
              <div className="flex flex-col justify-end md:col-span-4 md:col-start-9 md:pb-24">
                <p className="border-l-2 border-[#181713] pl-6 font-heading text-3xl leading-tight md:text-5xl">“Distinct creations begin with the courage to remain personal.”</p>
              </div>
            </div>
          </div>
        </article>

        <section className="grid min-h-[92svh] bg-[#d3b51e] md:grid-cols-2">
          <div className="relative min-h-[70svh] md:min-h-0">
            <Image src="/brand/gallery/prints-dsc04240.jpg" alt="Violet floral Monereen garment against yellow cloth" fill unoptimized sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" />
          </div>
          <div className="flex flex-col justify-between px-6 py-12 sm:px-10 md:px-14 md:py-16">
            <div className="flex justify-between border-t border-black/60 pt-3 text-[10px] uppercase tracking-[0.2em]"><span>Colour study</span><span>02 / 04</span></div>
            <p className="py-24 font-heading text-5xl leading-[0.94] tracking-[-0.04em] md:text-7xl lg:text-8xl">Print is rhythm.<br />Colour is memory.</p>
            <p className="max-w-md text-sm leading-7">Motifs gather like fragments of a journey—botanical marks, repetitions, contrast, and colour held in conversation.</p>
          </div>
        </section>

        <article className="px-5 py-24 sm:px-8 md:py-36">
          <div className="mx-auto max-w-[92rem]">
            <div className="grid gap-10 md:grid-cols-12">
              <div className="md:col-span-4">
                <p className="text-[10px] uppercase tracking-[0.22em]">Essay 02 · Material</p>
                <h2 className="mt-5 font-heading text-5xl leading-none tracking-[-0.04em] md:text-7xl">A language<br />of cloth.</h2>
              </div>
              <div className="columns-1 gap-8 text-sm leading-7 text-[#625c51] sm:columns-2 md:col-span-7 md:col-start-6 md:text-base">
                <p>Monereen’s vocabulary moves between expressive print and quiet solid cloth. One foregrounds motif and movement; the other reveals construction, proportion, embroidery, and finishing by hand.</p>
                <p className="mt-7 sm:mt-0">The long view extends this language across apparel, artisanal craft, and design innovation while remaining rooted in traditional craftsmanship and indigenous textiles close to home.</p>
              </div>
            </div>

            <div className="mt-20 grid grid-cols-2 gap-3 md:mt-28 md:grid-cols-4 md:gap-5">
              {[
                ["/brand/gallery/prints-33543.jpg", 1200, 1600, "Surface"],
                ["/brand/gallery/prints-33266.jpg", 1600, 1600, "Ornament"],
                ["/brand/gallery/solids-12674.jpg", 1059, 1600, "Line"],
                ["/brand/gallery/solids-2939.jpg", 1600, 1060, "Detail"],
              ].map(([src, width, height, label], index) => (
                <figure key={String(src)} className={index % 2 ? "mt-14 md:mt-24" : ""}>
                  <Image src={String(src)} alt={`Monereen ${String(label).toLowerCase()} study`} width={Number(width)} height={Number(height)} unoptimized className="h-auto w-full" />
                  <figcaption className="mt-3 border-t border-[#aaa092] pt-2 text-[9px] uppercase tracking-[0.18em]">0{index + 1} · {label}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </article>

        <section className="bg-[#181713] px-3 py-16 text-[#f2eee5] sm:px-5 md:py-24">
          <div className="mx-auto max-w-[96rem]">
            <div className="mb-10 grid gap-6 border-t border-white/40 pt-4 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/50">Portfolio / Contact sheet</p>
                <h2 className="mt-4 font-heading text-5xl tracking-[-0.045em] md:text-7xl">The working index</h2>
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">39 frames · 03 studies</p>
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-7 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {allBrandImages.map((image, index) => (
                <figure key={image.src}>
                  <div className="relative aspect-[3/4] overflow-hidden bg-white/5">
                    <Image src={image.src} alt={`Monereen ${image.category.toLowerCase()} contact sheet frame ${image.number}`} fill unoptimized sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, (max-width: 1279px) 25vw, 20vw" className="object-cover" />
                  </div>
                  <figcaption className="mt-2 flex justify-between text-[8px] uppercase tracking-[0.16em] text-white/50"><span>{image.category}</span><span>{String(index + 1).padStart(2, "0")}</span></figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#c34f33] px-5 py-24 text-[#181713] sm:px-8 md:py-36">
          <div className="mx-auto max-w-[92rem]">
            <p className="text-[10px] uppercase tracking-[0.22em]">End paper · Issue 01</p>
            <div className="mt-16 grid gap-12 md:grid-cols-2 md:items-end">
              <h2 className="font-heading text-6xl leading-[0.86] tracking-[-0.055em] md:text-8xl lg:text-9xl">The story<br />continues.</h2>
              <div className="flex flex-col gap-5 text-xs uppercase tracking-[0.2em] md:items-end">
                <Link href="/archive" className="flex items-center gap-3 border-b border-black/60 pb-2"><ArrowLeft size={15} aria-hidden="true" /> Return to archive</Link>
                <Link href="/about" className="flex items-center gap-3 border-b border-black/60 pb-2">Continue to our story <ArrowUpRight size={15} aria-hidden="true" /></Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
