import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default async function MaterialPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <section className="py-section-lg px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="aspect-square bg-sand">
              <div className="w-full h-full flex items-center justify-center text-stone">
                <span className="text-6xl">▣</span>
              </div>
            </div>
            <div>
              <p className="font-body text-xs uppercase tracking-widest text-stone mb-4">
                Material
              </p>
              <h1 className="font-heading text-5xl text-charcoal mb-4">
                Material Name
              </h1>
              <p className="font-body text-lg text-stone mb-2">Origin</p>
              <p className="font-body text-lg text-charcoal leading-relaxed">
                Material description loaded from the CMS.
              </p>
            </div>
          </div>
        </section>

        <section className="py-section-md px-6 bg-sand">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl text-charcoal mb-6">
              About this Material
            </h2>
            <div className="font-body text-lg text-charcoal leading-relaxed">
              Detailed material information loaded from CMS.
            </div>
          </div>
        </section>

        <section className="py-section-lg px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-heading text-3xl text-charcoal mb-8">
              Products using this Material
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Product cards */}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
