import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import { stories } from "./story-data";

export const metadata: Metadata = {
  title: "Stories",
  description: "Notes on dress, textile knowledge, colour, and the people who give Monereen its shape.",
};

export default async function StoriesPage() {
  return (
    <>
      <Header />
      <main className="bg-[#f3f2f2] pt-16 text-[#201e1d]">
        <section className="border-b border-[#201e1d]/40 px-5 py-10 md:px-8 lg:py-14">
          <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)] lg:items-end">
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#605d5d]">
                Monereen journal
              </p>
              <h1 className="max-w-[12ch] text-5xl font-bold tracking-[-0.055em] md:text-7xl">
                Stories that stay with you.
              </h1>
            </div>
            <p className="max-w-[34rem] text-base leading-7 text-[#605d5d] md:text-lg">
              Notes on dress, textile knowledge, colour, and the people who give Monereen its shape.
            </p>
          </div>
        </section>

        <section className="px-5 py-10 md:px-8 lg:py-14">
          <div className="mx-auto grid max-w-[1440px] gap-x-6 gap-y-12 md:grid-cols-2 lg:gap-y-16">
            {stories.map((story, index) => (
              <Link
                key={story.slug}
                href={`/stories/${story.slug}`}
                className={`group grid gap-5 border-t border-[#201e1d]/40 pt-4 ${index === 0 ? "md:col-span-2 md:grid-cols-[minmax(0,1.28fr)_minmax(18rem,0.72fr)] md:items-end md:gap-8" : ""}`}
              >
                <div className={`relative overflow-hidden bg-[#eae9e9] ${index === 0 ? "aspect-[16/9]" : "aspect-[4/5]"}`}>
                  <Image
                    src={story.image}
                    alt={story.imageAlt}
                    fill
                    sizes={index === 0 ? "(min-width: 768px) 70vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
                    className="object-cover grayscale transition duration-500 ease-out group-hover:scale-[1.02] group-hover:grayscale-0"
                  />
                </div>
                <div className="pb-1">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#605d5d]">
                    {story.category}
                  </p>
                  <h2 className="max-w-[14ch] text-3xl font-bold tracking-[-0.045em] transition-colors group-hover:text-[#ec3013] md:text-4xl">
                    {story.title}
                  </h2>
                  <p className="mt-4 max-w-[31rem] text-sm leading-6 text-[#605d5d] md:text-base">
                    {story.excerpt}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#201e1d] transition-colors group-hover:text-[#ec3013]">
                    Read story <ArrowUpRight size={16} weight="light" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
