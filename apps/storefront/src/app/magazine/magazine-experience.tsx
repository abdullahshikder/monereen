import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import {
  MagazineHeroMedia,
  MagazineProgress,
  Reveal,
} from "./magazine-motion";
import { MagazineChapterNav } from "./magazine-chapter-nav";
import styles from "./page.module.css";

const yellowBlur =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='10'%3E%3Cpath fill='%23c9ca31' d='M0 0h16v10H0z'/%3E%3C/svg%3E";
const violetBlur =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='16'%3E%3Cpath fill='%235961ad' d='M0 0h10v16H0z'/%3E%3C/svg%3E";

const contents = [
  {
    title: "The Pivotal Loop",
    note: "A personal passion becomes a house with a longer view.",
    href: "#manifesto",
  },
  {
    title: "Colour Has Memory",
    note: "Print, repetition, and the emotional force of a surface.",
    href: "#experience",
  },
  {
    title: "A Language of Cloth",
    note: "Construction and detail reveal the hand behind the work.",
    href: "#language-of-cloth",
  },
  {
    title: "The Working Edit",
    note: "Selected frames from the evolving Monereen archive.",
    href: "#working-edit",
  },
] as const;

const materialStudies = [
  {
    src: "/brand/gallery/prints-33543.jpg",
    width: 1200,
    height: 1600,
    alt: "Red embroidered sleeve resting over layered Monereen prints",
    caption: "Layered print and hand-finished edge",
  },
  {
    src: "/brand/gallery/prints-33266.jpg",
    width: 1600,
    height: 1600,
    alt: "Deep blue Monereen textile with ornate embroidery",
    caption: "Ornament held against a deep blue ground",
  },
  {
    src: "/brand/gallery/solids-12674.jpg",
    width: 1059,
    height: 1600,
    alt: "Monereen solid garment showing line and construction",
    caption: "A quieter cloth reveals proportion",
  },
] as const;

const selectedFrames = [
  {
    src: "/brand/gallery/kaftans-jute-cotton-kaftan.jpg",
    width: 1059,
    height: 1600,
    alt: "Lilac jute cotton Monereen kaftan photographed outdoors",
  },
  {
    src: "/brand/gallery/solids-dsc-3715-01.jpg",
    width: 1600,
    height: 1060,
    alt: "Green Monereen solid garment in a garden setting",
  },
  {
    src: "/brand/gallery/prints-22713.jpg",
    width: 1069,
    height: 1600,
    alt: "Pink Monereen print with intricate surface detail",
  },
] as const;

export function MagazineExperience() {
  return (
    <div className={styles.shell}>
      <Header />
      <MagazineProgress />

      <main className={styles.page}>
        <section className={styles.cover}>
          <div className={styles.coverCopy}>
            <div className={styles.issueMark}><span>Monereen Magazine</span></div>

            <div className={styles.coverTitle}>
              <p className={styles.coverTheme}>Personal expression in cloth</p>
              <h1>
                The pivotal loop.
              </h1>
              <p className={styles.coverDeck}>
                A record of cloth, colour, and the details that give each Monereen piece its voice.
              </p>
            </div>

            <Link href="#contents" className={styles.textLink}>
              Enter the issue <ArrowRight size={16} weight="light" aria-hidden="true" />
            </Link>
          </div>

          <MagazineHeroMedia className={styles.coverMedia}>
            <Image
              src="/brand/gallery/prints-dsc04233.jpg"
              alt="Woman wearing a violet floral Monereen kaftan against yellow cloth"
              fill
              priority
              placeholder="blur"
              blurDataURL={yellowBlur}
              sizes="(max-width: 767px) 100vw, 66vw"
              className={styles.coverImage}
            />
          </MagazineHeroMedia>
        </section>

        <MagazineChapterNav />

        <section id="contents" className={styles.contents}>
          <Reveal className={styles.sectionLead}>
            <p className={styles.topic}>Inside the issue</p>
            <h2>Four ways of looking.</h2>
            <p>
              Move from the origin of the house to the details that give every piece its voice.
            </p>
          </Reveal>

          <div className={styles.contentsGrid}>
            {contents.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06} className={styles.contentItem}>
                <Link href={item.href}>
                  <span className={styles.contentTitle}>{item.title}</span>
                  <span className={styles.contentNote}>{item.note}</span>
                  <ArrowUpRight className={styles.contentArrow} size={18} weight="light" aria-hidden="true" />
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        <article id="manifesto" className={styles.opener}>
          <Reveal className={styles.openerHeadline}>
            <p className={styles.topic}>The origin</p>
            <h2>A private instinct found a public form.</h2>
          </Reveal>

          <Reveal className={styles.openerBody} delay={0.08}>
            <p className={styles.dropCap}>
              Monereen began through passion: an instinct for cloth, detail, and bespoke creation.
              What followed was deliberate. An identity formed, a pause created room to think, and the
              return brought greater clarity about what the house can become.
            </p>
            <p>
              The work remains intimate even as the horizon expands. Every garment carries the trace of
              a hand, the logic of its material, and space for the wearer to make it their own.
            </p>
          </Reveal>

          <Reveal className={styles.openerPortrait} delay={0.1}>
            <Image
              src="/brand/gallery/kaftans-copy-of-dsc04739-04.jpg"
              alt="Three women wearing expressive Monereen kaftans"
              width={1244}
              height={1600}
              sizes="(max-width: 767px) 100vw, 52vw"
            />
          </Reveal>

          <Reveal className={styles.pullQuote} delay={0.12}>
            <blockquote>
              Distinct creations begin with the courage to remain personal.
            </blockquote>
          </Reveal>
        </article>

        <section id="experience" className={styles.colourStory}>
          <div className={styles.colourMedia}>
            <Image
              src="/brand/gallery/prints-dsc04240.jpg"
              alt="Violet floral Monereen garment against yellow cloth"
              fill
              placeholder="blur"
              blurDataURL={violetBlur}
              sizes="100vw"
              className={styles.colourImage}
            />
          </div>
          <Reveal className={styles.colourCopy}>
            <p className={styles.topic}>Colour has memory</p>
            <h2>Print becomes rhythm.</h2>
            <p>
              Botanical marks, repetition, and contrast gather like fragments of a journey. The surface
              speaks before the silhouette moves.
            </p>
          </Reveal>
        </section>

        <article id="language-of-cloth" className={styles.materials}>
          <Reveal className={styles.materialIntro}>
            <p className={styles.topic}>A language of cloth</p>
            <h2>The hand is visible when you look closely.</h2>
            <p>
              Expressive print foregrounds movement. Solid cloth makes room for construction,
              proportion, embroidery, and finishing to come forward.
            </p>
          </Reveal>

          <div className={styles.materialGrid}>
            {materialStudies.map((study, index) => (
              <Reveal key={study.src} delay={index * 0.08} className={styles.materialFigure}>
                <figure>
                  <Image
                    src={study.src}
                    alt={study.alt}
                    width={study.width}
                    height={study.height}
                    sizes="(max-width: 767px) 100vw, 34vw"
                  />
                  <figcaption>{study.caption}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <Reveal className={styles.horizon}>
            <p className={styles.horizonLead}>Where the horizon opens</p>
            <div className={styles.horizonCopy}>
              <h2>Apparel. Artisanal craft. Design innovation.</h2>
              <p>
                The long view grows a diverse body of work while staying close to traditional
                craftsmanship, indigenous textiles, and the artisan communities that carry knowledge
                forward.
              </p>
            </div>
          </Reveal>
        </article>

        <section id="working-edit" className={styles.workingEdit}>
          <Reveal className={styles.editLead}>
            <p className={styles.topic}>The working edit</p>
            <h2>Three frames from an evolving archive.</h2>
            <Link href="/archive#image-index" className={styles.textLink}>
              View all 39 images <ArrowUpRight size={16} weight="light" aria-hidden="true" />
            </Link>
          </Reveal>

          <div className={styles.editGrid}>
            {selectedFrames.map((frame, index) => (
              <Reveal key={frame.src} delay={(index % 3) * 0.06} className={styles.editFrame}>
                <Image
                  src={frame.src}
                  alt={frame.alt}
                  width={frame.width}
                  height={frame.height}
                  sizes="(max-width: 767px) 100vw, 40vw"
                />
              </Reveal>
            ))}
          </div>
        </section>

        <section className={styles.endPaper}>
          <Reveal className={styles.endPaperInner}>
            <p className={styles.topic}>Continue through Monereen</p>
            <h2>The story is still taking shape.</h2>
            <div className={styles.endLinks}>
              <Link href="/archive" className={styles.textLink}>
                <ArrowLeft size={16} weight="light" aria-hidden="true" /> Image archive
              </Link>
              <Link href="/about" className={styles.textLink}>
                Our story <ArrowRight size={16} weight="light" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}
