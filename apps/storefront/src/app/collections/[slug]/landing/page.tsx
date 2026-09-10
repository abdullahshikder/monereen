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
        <main className="pt-16">
          <section className="py-section-lg px-6">
            <div className="max-w-7xl mx-auto text-center">
              <h1 className="font-heading text-5xl text-charcoal mb-4">
                Collection
              </h1>
              <p className="font-body text-lg text-stone">
                Browse products in this collection.
              </p>
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
