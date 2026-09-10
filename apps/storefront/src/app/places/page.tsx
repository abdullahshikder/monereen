import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";

export default async function PlacesPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <section className="py-section-lg px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-heading text-5xl text-charcoal mb-4">
              Places
            </h1>
            <p className="font-body text-lg text-stone mb-12">
              The geographies of craft and culture.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Link
                  key={i}
                  href={`/places/place-${i}`}
                  className="group block"
                >
                  <div className="aspect-[4/3] bg-sand mb-4 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-stone group-hover:bg-sand/80 transition-colors">
                      <span className="text-4xl">◎</span>
                    </div>
                  </div>
                  <h3 className="font-heading text-2xl text-charcoal group-hover:text-accent transition-colors">
                    Place Name
                  </h3>
                  <p className="font-body text-sm text-stone">
                    Country, Region
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
