import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
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
    eyebrow: "A study in movement",
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
    eyebrow: "Textile study",
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
    eyebrow: "Seasonal chapter",
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
    eyebrow: "Ceremonial forms",
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
    eyebrow: "Monereen collection",
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
      <main className="bg-[#f3f2f2] pt-16 text-[#201e1d]">
        <section className="mx-auto grid max-w-[1440px] gap-8 px-5 py-8 sm:px-8 md:grid-cols-[minmax(0,1.15fr)_minmax(22rem,.85fr)] md:py-10">
          <div className="relative aspect-[3/4] overflow-hidden bg-[#d7d3d3] grayscale">
            <Image src={collection.hero} alt={collection.heroAlt} fill priority sizes="(max-width: 767px) 100vw, 58vw" className="object-cover" />
          </div>
          <div className="border-t border-[#201e1d]/40 pt-6 md:border-t-0 md:pt-0">
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#7d7979]">{collection.eyebrow}</p>
              <h1 className="mt-4 max-w-2xl font-body text-4xl font-bold leading-[1.03] tracking-[-0.03em] sm:text-5xl md:text-6xl">{collection.title}</h1>
              <p className="mt-6 max-w-lg text-sm leading-7 text-[#605d5d]">{collection.description}</p>
            </div>
            <Link href="/shop#pieces" className="mt-8 inline-flex w-fit items-center gap-3 bg-[#ec3013] px-6 py-3.5 text-sm font-semibold text-[#f3f2f2] transition-colors hover:bg-[#ae1800]">
              View available pieces <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="border-t-2 border-[#201e1d]/40 px-5 py-14 sm:px-8 md:py-20">
          <div className="mx-auto max-w-[1440px]">
            <h2 className="max-w-2xl font-body text-3xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-4xl">A collection in cloth, gesture, and detail.</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-12 md:gap-7">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#d7d3d3] grayscale md:col-span-5">
                <Image src={collection.gallery[0].src} alt={collection.gallery[0].alt} fill sizes="(max-width: 767px) 100vw, 42vw" className="object-cover" />
              </div>
              <div className="md:col-span-3 md:pt-20">
                <p className="border-t border-[#201e1d]/40 pt-4 text-sm leading-7 text-[#605d5d]">
                  These photographs are drawn from the Monereen image archive. Product stories will grow as the catalogue is completed.
                </p>
              </div>
              <div className="relative aspect-[3/4] overflow-hidden bg-[#d7d3d3] grayscale md:col-span-4 md:mt-16">
                <Image src={collection.gallery[1].src} alt={collection.gallery[1].alt} fill sizes="(max-width: 767px) 100vw, 34vw" className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        <section className="border-t-2 border-[#201e1d]/40 px-5 py-14 sm:px-8 md:py-20">
          <div className="mx-auto grid max-w-[1440px] gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(20rem,.9fr)]">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#d7d3d3] grayscale">
              <Image src={collection.gallery[2].src} alt={collection.gallery[2].alt} fill sizes="(max-width: 767px) 100vw, 58vw" className="object-cover" />
            </div>
            <div className="flex flex-col justify-end border-t border-[#201e1d]/40 pt-6 md:border-t-0 md:pt-0">
              <h2 className="max-w-md font-body text-3xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-4xl">Continue through the visual record.</h2>
              <Link href="/archive#image-index" className="mt-7 inline-flex w-fit items-center gap-3 border-b border-[#201e1d] pb-2 text-sm font-semibold transition-colors hover:border-[#ec3013] hover:text-[#ec3013]">
                Enter the image archive <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
