import { PuckRenderer } from "@/components/builder/puck-renderer";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getPublishedPageBySlug } from "@/lib/commerce";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";

const getPage = cache((slug: string) => getPublishedPageBySlug(slug));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const page = await getPage((await params).slug);
  if (!page) return { title: "Page not found" };

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || undefined,
  };
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const page = await getPage((await params).slug);
  const pageData = page?.pageData ?? null;

  if (!pageData) {
    return (
      <>
        <Header />
        <main className="min-h-[calc(100vh-4rem)] bg-[#f3f2f2] px-5 pb-20 pt-16 text-[#201e1d] sm:px-8 md:pb-28">
          <div className="mx-auto grid max-w-[1440px] gap-8 border-b-2 border-[#201e1d]/40 py-14 md:grid-cols-[minmax(0,1.15fr)_minmax(20rem,.85fr)] md:py-24">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#605d5d]">Monereen</p>
              <h1 className="mt-4 max-w-[10ch] text-4xl font-bold leading-[1.03] tracking-[-0.045em] sm:text-5xl md:text-6xl">This page is not live yet.</h1>
            </div>
            <div className="flex flex-col justify-end">
              <p className="max-w-md text-sm leading-7 text-[#605d5d] md:text-base">The collection, archive, and journal are ready to explore while this page is being prepared.</p>
              <div className="mt-8 flex flex-wrap gap-x-7 gap-y-4">
                <Link href="/shop" className="inline-flex items-center gap-2 border-b border-[#201e1d] pb-1.5 text-sm font-semibold transition-colors hover:border-[#ec3013] hover:text-[#ec3013]">
                  Shop the collection <ArrowUpRight size={16} weight="light" aria-hidden="true" />
                </Link>
                <Link href="/archive" className="inline-flex items-center gap-2 border-b border-[#201e1d] pb-1.5 text-sm font-semibold transition-colors hover:border-[#ec3013] hover:text-[#ec3013]">
                  View the archive <ArrowUpRight size={16} weight="light" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-16">
        <PuckRenderer data={pageData} />
      </main>
      <Footer />
    </>
  );
}
