import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStory, stories } from "../story-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const story = getStory((await params).slug);

  if (!story) return { title: "Story not found" };

  return {
    title: story.title,
    description: story.excerpt,
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const story = getStory((await params).slug);

  if (!story) notFound();

  const nextStory = stories.find((candidate) => candidate.slug !== story.slug) ?? story;

  return (
    <>
      <Header />
      <main className="bg-[#f3f2f2] pt-16 text-[#201e1d]">
        <section className="border-b border-[#201e1d]/40 px-5 py-6 md:px-8">
          <div className="mx-auto max-w-[1440px]">
            <Link
              href="/stories"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#201e1d] transition-colors hover:text-[#ec3013]"
            >
              <ArrowLeft size={16} weight="light" aria-hidden="true" />
              All stories
            </Link>
          </div>
        </section>

        <section className="px-5 py-10 md:px-8 lg:py-14">
          <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[minmax(0,1.18fr)_minmax(20rem,0.82fr)] lg:items-end">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#eae9e9] lg:aspect-[3/4]">
              <Image
                src={story.image}
                alt={story.imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 65vw, 100vw"
                className="object-cover grayscale"
              />
            </div>
            <div className="pb-1 lg:pb-10">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#605d5d]">
                {story.category}
              </p>
              <h1 className="max-w-[10ch] text-5xl font-bold tracking-[-0.055em] md:text-7xl">
                {story.title}
              </h1>
              <p className="mt-6 max-w-[31rem] text-base leading-7 text-[#605d5d] md:text-lg">
                {story.excerpt}
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-[#201e1d]/40 px-5 py-12 md:px-8 lg:py-16">
          <div className="mx-auto grid max-w-[960px] gap-10 md:grid-cols-[minmax(0,1fr)_minmax(13rem,0.58fr)] md:gap-16">
            <div className="space-y-7 text-lg leading-8 text-[#201e1d]">
              {story.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <blockquote className="border-l-2 border-[#ec3013] pl-5 text-2xl font-bold leading-tight tracking-[-0.035em] md:text-3xl">
              {story.pullQuote}
            </blockquote>
          </div>
        </section>

        <section className="px-5 py-10 md:px-8 lg:py-14">
          <div className="mx-auto grid max-w-[1440px] gap-6 border-t border-[#201e1d]/40 pt-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#605d5d]">
                Continue reading
              </p>
              <h2 className="mt-3 max-w-[12ch] text-3xl font-bold tracking-[-0.045em] md:text-5xl">
                {nextStory.title}
              </h2>
            </div>
            <Link
              href={`/stories/${nextStory.slug}`}
              className="inline-flex w-fit items-center gap-2 bg-[#ec3013] px-5 py-3 text-sm font-semibold text-[#201e1d] transition-colors hover:bg-[#201e1d] hover:text-[#f3f2f2]"
            >
              Read next <ArrowUpRight size={16} weight="light" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
