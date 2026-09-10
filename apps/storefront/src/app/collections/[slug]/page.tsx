import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

type CollectionEdit = {
  title: string;
  eyebrow: string;
  description: string;
  hero: string;
  heroAlt: string;
  gallery: readonly { src: string; alt: string; position?: string }[];
};

const collectionEdits: Record<string, CollectionEdit> = {
  "the-silk-route": {
    title: "The Silk Route",
    eyebrow: "Collection 01 · A study in movement",
    description: "Print, ornament, and colour meet in an evolving study of garments shaped by journeys and exchange.",
    hero: "/brand/editorial/print-violet.jpg",
    heroAlt: "Violet floral Monereen garment photographed against yellow cloth",
    gallery: [
      { src: "/brand/editorial/print-red.jpg", alt: "Red printed Monereen garment with embroidered neckline" },
      { src: "/brand/editorial/print-blue.jpg", alt: "Deep blue printed Monereen garment with detailed embroidery" },
      { src: "/brand/archive/prints-detail.jpg", alt: "Layered Monereen textiles in red and muted print" },
    ],
  },
  "the-jamdani-series": {
    title: "The Jamdani Series",
    eyebrow: "Collection 02 · Textile study",
    description: "An editorial space reserved for Monereen’s dialogue with indigenous textile knowledge and contemporary form.",
    hero: "/brand/editorial/solid-grey.jpg",
    heroAlt: "Grey Monereen garment with ivory embroidery",
    gallery: [
      { src: "/brand/editorial/solid-lifestyle.jpg", alt: "Blue embroidered Monereen garment photographed outdoors" },
      { src: "/brand/archive/solids-portrait.jpg", alt: "Portrait in an ivory Monereen garment with embellished details" },
      { src: "/brand/editorial/solid-duo.jpg", alt: "Two women wearing black embroidered Monereen garments" },
    ],
  },
  "summer-26": {
    title: "Summer ’26",
    eyebrow: "Collection 03 · Seasonal chapter",
    description: "Ease, saturated colour, and generous silhouettes compose a light seasonal wardrobe in progress.",
    hero: "/brand/archive/prints-hero.jpg",
    heroAlt: "Colourful Monereen kaftan against a vivid yellow textile backdrop",
    gallery: [
      { src: "/brand/editorial/kaftan-jute.jpg", alt: "Lilac jute cotton Monereen kaftan outdoors" },
      { src: "/brand/editorial/kaftan-silk.jpg", alt: "Silk printed Monereen kaftan against pink cloth" },
      { src: "/brand/archive/kaftans-tie-dye.jpg", alt: "Blue tie-dye Monereen kaftan against yellow cloth" },
    ],
  },
  bridal: {
    title: "Bridal",
    eyebrow: "Collection 04 · Ceremonial forms",
    description: "A future chapter exploring ornament, intimate detail, and pieces made for rituals of celebration.",
    hero: "/brand/editorial/solid-yellow.jpg",
    heroAlt: "Yellow embellished Monereen garment photographed outdoors",
    gallery: [
      { src: "/brand/editorial/solid-black.jpg", alt: "Black Monereen garment with gold embellishment" },
      { src: "/brand/editorial/solid-coral.jpg", alt: "Coral Monereen garment with embroidered neckline" },
      { src: "/brand/editorial/solid-duo.jpg", alt: "Two women wearing black embroidered Monereen garments" },
    ],
  },
};

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getCollectionEdit(slug: string): CollectionEdit {
  return collectionEdits[slug] ?? {
    ...collectionEdits["the-silk-route"],
    title: titleFromSlug(slug),
    eyebrow: "Monereen collection · Working edit",
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const collection = getCollectionEdit((await params).slug);
  return {
    title: collection.title,
    description: collection.description,
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const collection = getCollectionEdit((await params).slug);

  return (
    <>
      <Header />
      <main className="bg-[#f6f2ea] pt-16 text-[#211f1b]">
        <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden bg-[#211f1b] text-white">
          <Image src={collection.hero} alt={collection.heroAlt} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 flex min-h-[calc(100svh-4rem)] flex-col justify-between px-5 py-8 sm:px-8 md:p-12">
            <div className="flex justify-between gap-8 text-[10px] uppercase tracking-[0.2em]">
              <p>{collection.eyebrow}</p>
              <p className="text-right">Working editorial edit</p>
            </div>
            <div>
              <h1 className="max-w-6xl font-heading text-[clamp(4rem,10vw,9rem)] leading-[0.8] tracking-[-0.055em]">{collection.title}</h1>
              <div className="mt-8 flex items-end justify-between gap-8">
                <p className="max-w-xl text-sm leading-7 text-white/85 md:text-base">{collection.description}</p>
                <ArrowDown size={20} aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-24 sm:px-8 md:py-36">
          <div className="mx-auto max-w-[92rem]">
            <div className="grid gap-8 border-t border-[#aaa092] pt-7 md:grid-cols-[0.7fr_1.5fr]">
              <p className="text-[10px] uppercase tracking-[0.2em]">The visual study</p>
              <h2 className="max-w-4xl font-heading text-4xl leading-[1.04] tracking-[-0.035em] md:text-6xl">A collection in cloth, gesture, and detail.</h2>
            </div>

            <div className="mt-20 grid gap-6 md:grid-cols-12">
              <div className="relative aspect-[3/4] overflow-hidden md:col-span-5">
                <Image src={collection.gallery[0].src} alt={collection.gallery[0].alt} fill sizes="(max-width: 767px) 100vw, 42vw" className="object-cover" />
              </div>
              <div className="relative aspect-[3/4] overflow-hidden md:col-span-4 md:col-start-9 md:mt-32">
                <Image src={collection.gallery[1].src} alt={collection.gallery[1].alt} fill sizes="(max-width: 767px) 100vw, 34vw" className="object-cover" />
              </div>
              <div className="md:col-span-5 md:col-start-6 md:-mt-32">
                <p className="border-t border-[#aaa092] pt-5 text-sm leading-7 text-[#655e54]">
                  These photographs are drawn from the Monereen working image archive. Final collection assignments will evolve as the catalogue and product stories are completed.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid bg-[#e7ded2] md:grid-cols-[1.2fr_0.8fr]">
          <div className="relative min-h-[70svh]">
            <Image src={collection.gallery[2].src} alt={collection.gallery[2].alt} fill sizes="(max-width: 767px) 100vw, 60vw" className="object-cover" />
          </div>
          <div className="flex items-center px-6 py-20 sm:px-10 md:px-14 lg:px-20">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em]">Continue exploring</p>
              <h2 className="mt-5 font-heading text-4xl leading-tight tracking-[-0.035em] md:text-6xl">From image to memory.</h2>
              <p className="mt-7 max-w-md text-sm leading-7 text-[#655e54]">Continue through the complete Monereen visual record.</p>
              <Link href="/archive#image-index" className="mt-8 inline-flex items-center gap-3 border-b border-current pb-2 text-xs uppercase tracking-[0.2em]">
                Enter the image archive <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
