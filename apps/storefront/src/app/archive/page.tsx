import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ImageJourney } from "@/components/experience/image-journey";
import { completeImageArchive } from "@/lib/brand-gallery";

export const metadata: Metadata = {
  title: "Archive",
  description: "The evolving Monereen archive of collections, studies, craft, and the ideas shaping what comes next.",
};

const collectionIndex = [
  { id: "silk-route", name: "The Silk Route", note: "Collection", href: "/collections/the-silk-route" },
  { id: "jamdani-series", name: "The Jamdani Series", note: "Textile study", href: "/collections/the-jamdani-series" },
  { id: "summer-26", name: "Summer ’26", note: "Seasonal chapter", href: "/collections/summer-26" },
  { id: "bridal", name: "Bridal", note: "Ceremonial forms", href: "/collections/bridal" },
] as const;

export default function ArchivePage() {
  return (
    <>
      <Header />
      <main className="bg-[#f3f2f2] pt-16 text-[#201e1d]">
        <section className="mx-auto grid max-w-[1440px] gap-8 px-5 py-8 sm:px-8 md:grid-cols-[minmax(0,1.15fr)_minmax(20rem,.85fr)] md:py-10">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#d7d3d3] grayscale md:aspect-auto md:min-h-[34rem]">
            <Image
              src="/brand/archive/kaftans-group.jpg"
              alt="Three women wearing colourful Monereen kaftans"
              fill
              priority
              sizes="(max-width: 767px) 100vw, 58vw"
              className="object-cover object-[52%_top]"
            />
          </div>
          <div className="border-t border-[#201e1d]/40 pt-6 md:border-t-0 md:pt-0">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#7d7979]">Monereen archive</p>
            <h1 className="mt-4 max-w-xl font-body text-4xl font-bold leading-[1.03] tracking-[-0.03em] sm:text-5xl md:text-6xl">Made personal.</h1>
            <p className="mt-6 max-w-lg text-sm leading-7 text-[#605d5d]">An evolving record of cloth, colour, form, and the hands that bring each Monereen piece into being.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="#collections" className="inline-flex bg-[#ec3013] px-6 py-3.5 text-sm font-semibold text-[#f3f2f2] transition-colors hover:bg-[#ae1800]">Explore collections</Link>
              <Link href="/magazine" className="inline-flex items-center gap-3 border-b border-[#201e1d] pb-2 text-sm font-semibold transition-colors hover:border-[#ec3013] hover:text-[#ec3013]">Read the magazine <ArrowUpRight size={17} aria-hidden="true" /></Link>
            </div>
          </div>
        </section>

        <section className="border-t-2 border-[#201e1d]/40 px-5 py-14 sm:px-8 md:py-20">
          <div className="mx-auto max-w-[1440px]">
            <div>
              <h2 className="max-w-4xl font-body text-3xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-4xl md:text-5xl">
                Born from personal expression. Growing into a house of apparel, artisanal craft, and design innovation.
              </h2>
              <div className="mt-8 grid gap-8 text-sm leading-7 text-[#605d5d] md:grid-cols-2 md:text-base">
                <p>
                  Monereen began as a passion project and became a deliberate long-term practice: distinct in identity, attentive in construction, and close to the textile traditions of home.
                </p>
                <p>
                  This archive holds the work in motion, including experiments, early collections, recurring forms, and details that define the path toward greater scale and cultural impact.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="visual-journey" aria-labelledby="visual-journey-title" className="scroll-mt-16 border-t-2 border-[#201e1d]/40 px-5 py-14 sm:px-8 md:py-20">
          <div className="mx-auto max-w-[1440px]">
            <div>
              <h2 id="visual-journey-title" className="max-w-3xl font-body text-3xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-4xl">
                Enter the visual sequence.
              </h2>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-[#605d5d] md:text-base">
                Move through every frame as one continuous study of colour, cloth, and form. Swipe, drag, use the arrow keys, or let the sequence play.
              </p>
            </div>
          </div>
        </section>

        <ImageJourney />

        <section id="image-index" aria-labelledby="image-index-title" className="border-t-2 border-[#201e1d]/40 px-5 py-14 sm:px-8 md:py-20">
          <div className="mx-auto max-w-[1440px]">
            <div>
              <h2 id="image-index-title" className="max-w-3xl font-body text-3xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-4xl">Every frame in the working archive.</h2>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-[#605d5d] md:text-base">
                  The complete local image library, shown without cropping and kept in its original Kaftans, Prints, and Solids groupings.
                </p>
            </div>

            <div className="mt-24 space-y-28 md:mt-32 md:space-y-36">
              {completeImageArchive.map((group) => (
                <section key={group.category} aria-labelledby={`archive-${group.category.toLowerCase()}`}>
                  <div className="mb-8 flex items-end justify-between border-b border-[#201e1d]/40 pb-4">
                    <h3 id={`archive-${group.category.toLowerCase()}`} className="font-body text-2xl font-semibold tracking-[-0.025em] md:text-3xl">{group.category}</h3>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#605d5d]">{group.images.length} frames</p>
                  </div>
                  <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
                    {group.images.map(([filename, width, height], index) => (
                      <figure key={filename} className="mb-8 break-inside-avoid">
                        <Image
                          src={`/brand/gallery/${filename}`}
                          alt={`Monereen ${group.category.toLowerCase()} archive photograph ${index + 1}`}
                          width={width}
                          height={height}
                          unoptimized
                          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
                          className="h-auto w-full bg-[#d7d3d3] grayscale"
                        />
                      </figure>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section id="collections" className="scroll-mt-24 border-t-2 border-[#201e1d]/40 px-5 py-14 sm:px-8 md:py-20">
          <div className="mx-auto max-w-[1440px]">
            <div>
              <h2 className="max-w-3xl font-body text-3xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-4xl">Four chapters on the horizon.</h2>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-[#605d5d] md:text-base">
                  A growing portfolio that moves between travel, indigenous textile knowledge, seasonal ease, and ceremonial expression.
                </p>
            </div>

            <div className="mt-10 border-t border-[#201e1d]/40">
              {collectionIndex.map((collection) => (
                <Link
                  key={collection.id}
                  id={collection.id}
                  href={collection.href}
                  className="group grid grid-cols-[1fr_auto] items-center gap-4 border-b border-[#201e1d]/40 py-5 transition-colors hover:bg-[#eae9e9] md:grid-cols-[1fr_16rem_auto] md:px-4"
                >
                  <span className="font-body text-xl font-semibold tracking-[-0.02em] md:text-3xl">{collection.name}</span>
                  <span className="hidden text-[11px] uppercase tracking-[0.14em] text-[#605d5d] md:block">{collection.note}</span>
                  <ArrowUpRight size={19} weight="light" className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t-2 border-[#201e1d]/40 px-5 py-14 sm:px-8 md:py-20">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid gap-10 md:grid-cols-[minmax(0,.75fr)_minmax(0,1.25fr)]">
              <div>
                <h2 className="max-w-md font-body text-3xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-4xl">Craft carried forward.</h2>
              </div>
              <ol className="grid gap-x-8 gap-y-5 text-sm leading-6 text-[#605d5d] md:grid-cols-2">
                {[
                  "Earn organic adoption and lasting loyalty.",
                  "Grow through community and word of mouth.",
                  "Build a complete, diverse product portfolio.",
                  "Sustain artisan livelihoods through a resilient supply chain.",
                  "Welcome a growing international community.",
                  "Create a flagship home for the Monereen experience.",
                  "Celebrate cultural heritage through conscious design.",
                ].map((milestone) => (
                  <li key={milestone} className="border-t border-[#201e1d]/40 pt-4 md:text-base">
                    {milestone}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="px-5 pb-14 sm:px-8 md:pb-20">
          <div className="mx-auto grid max-w-[1440px] gap-8 border-t border-[#201e1d]/40 pt-8 md:grid-cols-2 md:items-end">
              <p className="max-w-xl font-body text-2xl font-bold leading-[1.1] tracking-[-0.03em] md:text-3xl">
                Distinct creations. Thoughtful design. Unwavering dedication to the craft.
              </p>
              <div className="md:text-right">
                <Link href="/magazine" className="inline-flex bg-[#ec3013] px-6 py-3.5 text-sm font-semibold text-[#f3f2f2] transition-colors hover:bg-[#ae1800]">
                  Open the magazine <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
