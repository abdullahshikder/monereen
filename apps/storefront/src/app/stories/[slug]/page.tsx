import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default async function StoryPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Story Hero */}
        <section className="py-section-lg px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-body text-xs uppercase tracking-widest text-stone mb-4">
              Story Category
            </p>
            <h1 className="font-heading text-5xl md:text-display text-charcoal mb-4">
              Story Title
            </h1>
            <p className="font-body text-lg text-stone">
              Story subtitle or excerpt
            </p>
          </div>
        </section>

        {/* Story content — rendered from Puck pageData */}
        <section className="py-section-md px-6">
          <div className="max-w-3xl mx-auto">
            <div className="font-body text-lg text-charcoal leading-relaxed space-y-6">
              <p>
                Story content will be rendered from structured Puck JSON data.
                This supports rich editorial layouts with images, quotes,
                product references, and more.
              </p>
            </div>
          </div>
        </section>

        {/* Related products */}
        <section className="py-section-lg px-6 bg-sand">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-heading text-3xl text-charcoal mb-8">
              Related Objects
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Related product cards */}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
