import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default async function CraftPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Craft Hero */}
        <section className="py-section-lg px-6 bg-charcoal text-ivory">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-body text-xs uppercase tracking-widest text-stone mb-4">
              Craft
            </p>
            <h1 className="font-heading text-5xl md:text-display mb-4">
              Craft Name
            </h1>
            <p className="font-body text-lg text-stone">
              Origin and brief description
            </p>
          </div>
        </section>

        {/* Craft story */}
        <section className="py-section-md px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl text-charcoal mb-6">
              History
            </h2>
            <div className="font-body text-lg text-charcoal leading-relaxed space-y-6">
              <p>
                Craft history content will be loaded from the CMS. This provides
                rich editorial context about the tradition, its origins, and its
                significance.
              </p>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-section-md px-6 bg-sand">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl text-charcoal mb-6">
              The Process
            </h2>
            <div className="font-body text-lg text-charcoal leading-relaxed">
              Process description loaded from CMS.
            </div>
          </div>
        </section>

        {/* Makers */}
        <section className="py-section-lg px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-heading text-3xl text-charcoal mb-8">
              Makers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Maker cards */}
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="py-section-md px-6 bg-sand">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-heading text-3xl text-charcoal mb-8">
              Objects
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
