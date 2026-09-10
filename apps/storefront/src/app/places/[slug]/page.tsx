import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default async function PlacePage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <section className="py-section-lg px-6 bg-charcoal text-ivory">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-body text-xs uppercase tracking-widest text-stone mb-4">
              Place
            </p>
            <h1 className="font-heading text-5xl md:text-display mb-4">
              Place Name
            </h1>
            <p className="font-body text-lg text-stone">Country, Region</p>
          </div>
        </section>

        <section className="py-section-md px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl text-charcoal mb-6">
              About this Place
            </h2>
            <div className="font-body text-lg text-charcoal leading-relaxed">
              Place description loaded from CMS.
            </div>
          </div>
        </section>

        <section className="py-section-lg px-6 bg-sand">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-heading text-3xl text-charcoal mb-8">
              Makers from this Place
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Maker cards */}
            </div>
          </div>
        </section>

        <section className="py-section-md px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-heading text-3xl text-charcoal mb-8">
              Products from this Place
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
