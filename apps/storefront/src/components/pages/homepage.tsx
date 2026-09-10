import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export function Homepage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative h-screen flex items-center justify-center bg-ivory">
          <div className="text-center max-w-4xl mx-auto px-6">
            <h1 className="font-heading text-display text-charcoal mb-6">
              Monereen
            </h1>
            <p className="font-body text-xl text-stone max-w-2xl mx-auto mb-8">
              Products inside stories. A living digital exhibition of craft,
              culture, and commerce.
            </p>
            <Link
              href="/shop"
              className="inline-block font-body text-sm uppercase tracking-wider bg-charcoal text-ivory px-8 py-4 hover:bg-accent transition-colors"
            >
              Explore Collection
            </Link>
          </div>
        </section>

        {/* Brand Statement */}
        <section className="py-section-lg px-6 bg-sand">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-heading text-3xl md:text-4xl text-charcoal leading-snug">
              Every object carries the memory of how it was made, who made it,
              and where it came from.
            </p>
          </div>
        </section>

        {/* Current Drop */}
        <section className="py-section-lg px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-baseline justify-between mb-12">
              <h2 className="font-heading text-4xl text-charcoal">
                Current Drop
              </h2>
              <Link
                href="/collections/current"
                className="font-body text-sm uppercase tracking-wider text-accent hover:text-accent-dark transition-colors"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Product cards */}
            </div>
          </div>
        </section>

        {/* Stories */}
        <section className="py-section-lg px-6 bg-charcoal text-ivory">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-baseline justify-between mb-12">
              <h2 className="font-heading text-4xl">Stories</h2>
              <Link
                href="/stories"
                className="font-body text-sm uppercase tracking-wider text-accent hover:text-accent-light transition-colors"
              >
                Read All
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Story cards */}
            </div>
          </div>
        </section>

        {/* Makers */}
        <section className="py-section-lg px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-heading text-4xl text-charcoal mb-12">
              Makers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Maker cards */}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
