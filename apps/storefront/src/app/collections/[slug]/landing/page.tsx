import { PuckRenderer } from "@/components/builder/puck-renderer";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MEDUSA_BACKEND_URL } from "@/lib/api";

async function getCollectionPage(slug: string) {
  try {
    const res = await fetch(`${MEDUSA_BACKEND_URL}/store/collections/${slug}/landing`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

export default async function CollectionLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const data = await getCollectionPage((await params).slug);

  if (!data?.page) {
    // Fallback to standard collection page
    return (
      <>
        <Header />
        <main className="min-h-[75svh] bg-[#f3f2f2] pt-16 text-[#201e1d]">
          <section className="mx-auto max-w-[1120px] px-5 py-14 sm:px-8 md:py-20">
            <div className="border-t-2 border-[#201e1d]/40 pt-6">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#7d7979]">Collection</p>
              <h1 className="mt-4 font-body text-4xl font-bold leading-[1.03] tracking-[-0.03em] sm:text-5xl">The current Monereen edit.</h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[#605d5d]">Browse available pieces from the collection.</p>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-16">
        <PuckRenderer data={data.page} />
      </main>
      <Footer />
    </>
  );
}
