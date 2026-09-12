import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

type StudyType = "craft" | "maker" | "material" | "place";

type Study = {
  title: string;
  eyebrow: string;
  summary: string;
  body: string;
  image: string;
  alt: string;
};

const studies: Record<StudyType, Record<string, Study>> = {
  craft: {
    potlis: { title: "Potlis", eyebrow: "Bags in development", summary: "A compact form imagined through textile, surface, and ornament.", body: "This is an early direction in the Monereen craft portfolio. The visual language begins with cloth and considers how a small object can carry colour, touch, and everyday purpose.", image: "/brand/archive/prints-detail.jpg", alt: "Close detail of layered red and printed Monereen textiles" },
    totes: { title: "Totes", eyebrow: "Bags in development", summary: "Everyday utility shaped by expressive cloth and considered construction.", body: "The tote is being explored as a useful, open form for Monereen textiles. Its development starts with the balance between carrying well and keeping the character of the material visible.", image: "/brand/editorial/print-blue.jpg", alt: "Close view of embroidery and print on a deep blue Monereen garment" },
    scarves: { title: "Scarves", eyebrow: "Accessories in development", summary: "A future study in drape, motif, colour, and movement.", body: "Scarves offer a different scale for the studio's pattern and colour work. This direction remains in development, with the fabric leading the decisions about proportion and finish.", image: "/brand/editorial/print-red.jpg", alt: "Detail of a red printed Monereen garment" },
  },
  maker: {
    "textile-knowledge": { title: "Textile knowledge", eyebrow: "Maker study", summary: "Craft traditions and material intelligence stay at the centre of the work.", body: "Monereen's work depends on the people who know a fabric through experience: how it falls, how it holds a seam, and when a surface has received enough attention. This study is about keeping that knowledge visible.", image: "/brand/archive/prints-detail.jpg", alt: "Detailed Monereen textile and embroidery" },
    "studio-relationship": { title: "The studio relationship", eyebrow: "Maker study", summary: "A garment is resolved through close attention to surface, proportion, and finishing.", body: "A design becomes a finished piece through conversation and careful repetition. The studio relationship holds space for the decisions that make a garment feel considered rather than merely completed.", image: "/brand/editorial/solid-grey.jpg", alt: "Monereen solid garment showing construction and line" },
    "making-together": { title: "Making together", eyebrow: "Maker study", summary: "Creative partnership and artisan livelihoods are part of the same future.", body: "Monereen is interested in the conditions around the object as much as the object itself. This study holds the idea that collaboration should create room for skill, exchange, and sustained creative work.", image: "/brand/editorial/kaftan-jute.jpg", alt: "Monereen jute kaftan photographed outdoors" },
  },
  material: {
    jamdani: { title: "Jamdani", eyebrow: "Textile study", summary: "A study in surface, pattern, and the patience of the cloth.", body: "The material direction begins by observing closely: transparency and density, a motif's movement, and the small shifts that happen when cloth meets the body. These observations guide the studio's textile conversations.", image: "/brand/archive/prints-floral.jpg", alt: "Floral Monereen textile detail" },
    "printed-cloth": { title: "Printed cloth", eyebrow: "Surface and colour", summary: "Print makes an everyday material into a field for rhythm and expression.", body: "A printed surface is considered from both close up and at a distance. Scale, density, and colour are adjusted so the material keeps changing as it moves through a garment.", image: "/brand/editorial/print-black.jpg", alt: "Black and ivory Monereen printed fabric" },
    embroidery: { title: "Embroidery", eyebrow: "Hand-finished detail", summary: "Stitch becomes a way to draw across cloth.", body: "Embroidery brings a slower, more tactile register to the collection. The studio uses it to focus the eye, alter a surface, and give a garment a sense of closeness.", image: "/brand/editorial/solid-black.jpg", alt: "Black Monereen garment with embroidered embellishment" },
  },
  place: {
    bangladesh: { title: "Bangladesh", eyebrow: "Place study", summary: "The local context that informs Monereen's material and cultural point of view.", body: "Monereen is made in Bangladesh. The studio looks outward from this home through cloth, cultural memory, and a continuing conversation about how dress can carry both history and possibility.", image: "/brand/editorial/solid-lifestyle.jpg", alt: "Monereen garment photographed in a garden setting" },
  },
};

const overviewPaths: Record<StudyType, string> = { craft: "/crafts", maker: "/makers", material: "/materials", place: "/places" };

export function getStudyMetadata(type: StudyType, slug: string): Metadata {
  const study = studies[type][slug];
  return study ? { title: study.title, description: study.summary } : { title: "Not found" };
}

export function EditorialStudyPage({ type, slug }: { type: StudyType; slug: string }) {
  const study = studies[type][slug];
  if (!study) notFound();

  const overviewPath = overviewPaths[type];
  const label = type === "craft" ? "Craft" : `${type.charAt(0).toUpperCase()}${type.slice(1)}s`;

  return (
    <>
      <Header />
      <main className="bg-[#f3f2f2] pt-16 text-[#201e1d]">
        <section className="mx-auto grid max-w-[1440px] gap-8 px-5 py-8 sm:px-8 md:grid-cols-[minmax(0,1.1fr)_minmax(20rem,.9fr)] md:py-10">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#d7d3d3] grayscale md:aspect-auto md:min-h-[38rem]">
            <Image src={study.image} alt={study.alt} fill priority sizes="(max-width: 767px) 100vw, 58vw" className="object-cover" />
          </div>
          <div className="flex flex-col justify-between border-t border-[#201e1d]/40 pt-6 md:border-t-0 md:pt-0">
            <div>
              <Link href={overviewPath} className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#605d5d] transition-colors hover:text-[#ec3013]">
                <ArrowLeft size={14} weight="light" aria-hidden="true" /> {label}
              </Link>
              <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#605d5d]">{study.eyebrow}</p>
              <h1 className="mt-4 max-w-[11ch] text-4xl font-bold leading-[1.03] tracking-[-0.045em] sm:text-5xl md:text-6xl">{study.title}</h1>
              <p className="mt-6 max-w-lg text-sm leading-7 text-[#605d5d] md:text-base">{study.summary}</p>
            </div>
            <Link href="/shop" className="mt-10 inline-flex w-fit items-center gap-3 border-b border-[#201e1d] pb-2 text-sm font-semibold transition-colors hover:border-[#ec3013] hover:text-[#ec3013]">
              Shop the collection <ArrowUpRight size={17} weight="light" aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="border-t-2 border-[#201e1d]/40 px-5 py-14 sm:px-8 md:py-20">
          <div className="mx-auto grid max-w-[1440px] gap-10 md:grid-cols-[minmax(0,.75fr)_minmax(0,1.25fr)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#605d5d]">Monereen study</p>
            <p className="max-w-3xl text-2xl font-medium leading-[1.25] tracking-[-0.025em] sm:text-3xl">{study.body}</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
