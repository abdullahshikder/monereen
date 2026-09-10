import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";

export default async function MakerPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Maker Hero */}
        <section className="py-section-lg px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="aspect-square bg-sand">
              <div className="w-full h-full flex items-center justify-center text-stone">
                <span className="text-6xl">◎</span>
              </div>
            </div>
            <div>
              <p className="font-body text-xs uppercase tracking-widest text-stone mb-4">
                Maker
              </p>
              <h1 className="font-heading text-5xl text-charcoal mb-4">
                Maker Name
              </h1>
              <p className="font-body text-lg text-stone mb-2">Location</p>
              <p className="font-body text-lg text-charcoal leading-relaxed">
                Short bio text will be loaded from the CMS. This connects the
                maker to their craft and products.
              </p>
            </div>
          </div>
        </section>

        {/* Maker's products */}
        <section className="py-section-md px-6 bg-sand">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-heading text-3xl text-charcoal mb-8">
              Objects by this Maker
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Link
                  key={i}
                  href={`/products/product-${i}`}
                  className="group block"
                >
                  <div className="aspect-[3/4] bg-ivory mb-4 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-stone group-hover:bg-ivory/80 transition-colors">
                      <span className="text-4xl">◇</span>
                    </div>
                  </div>
                  <h3 className="font-body text-sm text-charcoal">Product {i}</h3>
                  <p className="font-body text-sm text-stone">$0</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Related stories */}
        <section className="py-section-lg px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-heading text-3xl text-charcoal mb-8">
              Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Story cards */}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
