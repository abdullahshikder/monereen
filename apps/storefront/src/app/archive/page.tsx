import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ImageJourney } from "@/components/experience/image-journey";
import { completeImageArchive } from "@/lib/brand-gallery";

export const metadata: Metadata = {
  title: "Archive",
  description: "The evolving Monereen archive—collections, studies, craft, and the ideas shaping what comes next.",
};

const collectionIndex = [
  { id: "silk-route", number: "01", name: "The Silk Route", note: "Collection", href: "/collections/the-silk-route" },
  { id: "jamdani-series", number: "02", name: "The Jamdani Series", note: "Textile study", href: "/collections/the-jamdani-series" },
  { id: "summer-26", number: "03", name: "Summer ’26", note: "Seasonal chapter", href: "/collections/summer-26" },
  { id: "bridal", number: "04", name: "Bridal", note: "Ceremonial forms", href: "/collections/bridal" },
] as const;

export default function ArchivePage() {
  return (
    <>
      <Header />
      <main className="bg-[#f6f2ea] pt-16 text-[#211f1b]">
        <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden bg-charcoal text-white">
          <div className="absolute inset-0 grid grid-cols-[1.25fr_0.75fr] gap-1 bg-[#171714] md:grid-cols-[1.4fr_0.6fr]">
            <div className="relative overflow-hidden">
              <Image
                src="/brand/archive/kaftans-group.jpg"
                alt="Three women wearing colourful Monereen kaftans"
                fill
                priority
                sizes="(max-width: 767px) 68vw, 72vw"
                className="object-cover object-[52%_top]"
              />
            </div>
            <div className="grid grid-rows-2 gap-1">
              <div className="relative overflow-hidden">
                <Image
                  src="/brand/archive/prints-detail.jpg"
                  alt="Close detail of layered Monereen prints"
                  fill
                  priority
                  sizes="(max-width: 767px) 32vw, 28vw"
                  className="object-cover"
                />
              </div>
              <div className="relative overflow-hidden">
                <Image
                  src="/brand/archive/solids-blue.jpg"
                  alt="Blue embroidered Monereen garment photographed on grass"
                  fill
                  priority
                  sizes="(max-width: 767px) 32vw, 28vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,6,0.66),rgba(8,8,6,0.08)_75%),linear-gradient(0deg,rgba(8,8,6,0.42),transparent_55%)]" />
          <div className="relative z-10 flex min-h-[calc(100svh-4rem)] flex-col justify-between px-5 py-7 sm:px-8 md:p-12">
            <div className="flex items-start justify-between gap-6 text-[10px] uppercase tracking-[0.2em]">
              <p>Monereen archive</p>
              <p className="text-right">Dhaka · Est. through passion</p>
            </div>
            <div className="max-w-5xl">
              <p className="mb-5 text-xs uppercase tracking-[0.22em]">Chapter one · The pivotal loop</p>
              <h1 className="max-w-4xl font-heading text-[clamp(4rem,11vw,10rem)] font-normal leading-[0.78] tracking-[-0.055em]">
                Made personal.
              </h1>
              <div className="mt-8 flex items-end justify-between gap-8">
                <div>
                  <p className="max-w-md text-sm leading-relaxed text-white/85 md:text-base">
                    An evolving record of cloth, colour, form, and the hands that bring each Monereen piece into being.
                  </p>
                  <Link href="#visual-journey" className="mt-6 inline-flex items-center gap-3 border-b border-white/70 pb-2 text-[10px] uppercase tracking-[0.2em]">
                    Enter visual journey <ArrowDown size={14} aria-hidden="true" />
                  </Link>
                  <Link href="/magazine" className="ml-6 mt-6 inline-flex items-center gap-3 border-b border-white/70 pb-2 text-[10px] uppercase tracking-[0.2em]">
                    Read magazine edition <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-24 sm:px-8 md:py-36">
          <div className="mx-auto grid max-w-[92rem] gap-12 border-t border-[#aaa092] pt-8 md:grid-cols-[0.7fr_1.5fr] md:gap-20">
            <p className="text-[10px] uppercase tracking-[0.2em]">The house / 2026</p>
            <div>
              <h2 className="max-w-4xl font-heading text-4xl leading-[1.02] tracking-[-0.035em] md:text-6xl lg:text-7xl">
                Born from personal expression. Growing into a house of apparel, artisanal craft, and design innovation.
              </h2>
              <div className="mt-12 grid gap-8 text-sm leading-7 text-[#5f594f] md:grid-cols-2 md:text-base">
                <p>
                  Monereen began as a passion project and became a deliberate long-term practice: distinct in identity, attentive in construction, and close to the textile traditions of home.
                </p>
                <p>
                  This archive holds the work in motion—the experiments, early collections, recurring forms, and details that define the path toward greater scale and cultural impact.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="visual-journey" aria-labelledby="visual-journey-title" className="scroll-mt-16 border-t border-[#d8d1c4] bg-[#e7ded2] px-5 py-20 sm:px-8 md:py-28">
          <div className="mx-auto grid max-w-[92rem] gap-10 border-t border-[#aaa092] pt-7 md:grid-cols-[0.7fr_1.5fr] md:gap-20">
            <p className="text-[10px] uppercase tracking-[0.2em]">Immersive archive · 39 frames</p>
            <div>
              <h2 id="visual-journey-title" className="max-w-4xl font-heading text-5xl leading-none tracking-[-0.04em] md:text-7xl">
                Enter the visual sequence.
              </h2>
              <p className="mt-8 max-w-2xl text-sm leading-7 text-[#5f594f] md:text-base">
                Move through every frame as one continuous study of colour, cloth, and form. Swipe, drag, use the arrow keys, or let the sequence play.
              </p>
            </div>
          </div>
        </section>

        <ImageJourney />

        <section id="image-index" aria-labelledby="image-index-title" className="border-b border-[#d8d1c4] px-5 py-24 sm:px-8 md:py-36">
          <div className="mx-auto max-w-[92rem]">
            <div className="grid gap-10 border-t border-[#aaa092] pt-7 md:grid-cols-[0.7fr_1.5fr] md:gap-20">
              <div className="flex justify-between gap-4 text-[10px] uppercase tracking-[0.2em] md:block">
                <p>Complete image index</p>
                <p className="mt-0 text-[#6e655a] md:mt-3">39 photographs</p>
              </div>
              <div>
                <h2 id="image-index-title" className="max-w-4xl font-heading text-5xl leading-none tracking-[-0.04em] md:text-7xl">Every frame in the working archive.</h2>
                <p className="mt-8 max-w-2xl text-sm leading-7 text-[#5f594f] md:text-base">
                  The complete local image library, shown without cropping and kept in its original Kaftans, Prints, and Solids groupings.
                </p>
              </div>
            </div>

            <div className="mt-24 space-y-28 md:mt-32 md:space-y-36">
              {completeImageArchive.map((group) => (
                <section key={group.category} aria-labelledby={`archive-${group.category.toLowerCase()}`}>
                  <div className="mb-8 flex items-end justify-between border-b border-[#aaa092] pb-4">
                    <h3 id={`archive-${group.category.toLowerCase()}`} className="font-heading text-4xl tracking-[-0.035em] md:text-5xl">{group.category}</h3>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#6e655a]">{String(group.images.length).padStart(2, "0")} frames</p>
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
                          className="h-auto w-full bg-[#e7ded2]"
                        />
                        <figcaption className="mt-3 flex justify-between border-t border-[#d8d1c4] pt-2 text-[9px] uppercase tracking-[0.16em] text-[#6e655a]">
                          <span>{group.category}</span>
                          <span>{String(index + 1).padStart(2, "0")}</span>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section id="collections" className="px-5 py-24 sm:px-8 md:py-36">
          <div className="mx-auto max-w-[92rem]">
            <div className="grid gap-10 md:grid-cols-[0.7fr_1.5fr] md:gap-20">
              <p className="text-[10px] uppercase tracking-[0.2em]">Collection map</p>
              <div>
                <h2 className="max-w-4xl font-heading text-5xl leading-none tracking-[-0.04em] md:text-7xl">Four chapters on the horizon.</h2>
                <p className="mt-8 max-w-2xl text-sm leading-7 text-[#5f594f] md:text-base">
                  A growing portfolio that moves between travel, indigenous textile knowledge, seasonal ease, and ceremonial expression.
                </p>
              </div>
            </div>

            <div className="mt-20 border-t border-[#aaa092]">
              {collectionIndex.map((collection) => (
                <Link
                  key={collection.id}
                  id={collection.id}
                  href={collection.href}
                  className="group grid grid-cols-[3rem_1fr_auto] items-center gap-4 border-b border-[#aaa092] py-6 transition-colors hover:bg-[#eee8dc] md:grid-cols-[6rem_1fr_16rem_auto] md:px-4"
                >
                  <span className="text-[10px] tabular-nums tracking-[0.18em]">{collection.number}</span>
                  <span className="font-heading text-2xl tracking-[-0.025em] md:text-4xl">{collection.name}</span>
                  <span className="hidden text-xs uppercase tracking-[0.16em] text-[#7a7165] md:block">{collection.note}</span>
                  <ArrowUpRight size={19} weight="light" className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#211f1b] px-5 py-24 text-[#f6f2ea] sm:px-8 md:py-36">
          <div className="mx-auto max-w-[92rem]">
            <div className="grid gap-12 md:grid-cols-12">
              <div className="md:col-span-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">August 2026 · The horizon</p>
                <h2 className="mt-5 font-heading text-5xl leading-[0.98] tracking-[-0.04em] md:text-7xl">Craft carried forward.</h2>
              </div>
              <ol className="divide-y divide-white/20 border-t border-white/20 md:col-span-6 md:col-start-7">
                {[
                  "Earn organic adoption and lasting loyalty.",
                  "Grow through community and word of mouth.",
                  "Build a complete, diverse product portfolio.",
                  "Sustain artisan livelihoods through a resilient supply chain.",
                  "Welcome a growing international community.",
                  "Create a flagship home for the Monereen experience.",
                  "Celebrate cultural heritage through conscious design.",
                ].map((milestone, index) => (
                  <li key={milestone} className="grid grid-cols-[2.5rem_1fr] gap-4 py-5 text-sm leading-6 md:py-6 md:text-base">
                    <span className="text-[10px] tabular-nums text-white/45">{String(index + 1).padStart(2, "0")}</span>
                    <span>{milestone}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="bg-[#211f1b] px-5 pb-24 text-[#f6f2ea] sm:px-8 md:pb-36">
          <div className="mx-auto max-w-[92rem] border-t border-white/20 pt-8">
            <div className="grid gap-8 md:grid-cols-2 md:items-end">
              <p className="max-w-xl font-heading text-3xl leading-tight md:text-5xl">
                Distinct creations. Thoughtful design. Unwavering dedication to the craft.
              </p>
              <div className="md:text-right">
                <Link href="/magazine" className="inline-flex items-center gap-3 border-b border-current pb-2 text-xs uppercase tracking-[0.2em]">
                  Open the magazine <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
