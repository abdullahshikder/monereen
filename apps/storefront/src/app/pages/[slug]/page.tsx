import { PuckRenderer } from "@/components/builder/puck-renderer";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getPublishedPageBySlug } from "@/lib/commerce";
import type { Metadata } from "next";
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
        <main className="pt-16 py-section-lg px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading text-5xl text-charcoal mb-4">
              Page Not Found
            </h1>
            <p className="font-body text-lg text-stone">
              The page you are looking for does not exist or has been archived.
            </p>
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
