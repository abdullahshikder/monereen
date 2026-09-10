import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";

export default async function StoriesPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <section className="py-section-lg px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-heading text-5xl text-charcoal mb-4">
              Stories
            </h1>
            <p className="font-body text-lg text-stone mb-12">
              The narratives behind every craft, maker, and collection.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Story cards */}
              {[1, 2, 3, 4].map((i) => (
                <Link
                  key={i}
                  href={`/stories/story-${i}`}
                  className="group block"
                >
                  <div className="aspect-[16/9] bg-sand mb-4 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-stone group-hover:bg-sand/80 transition-colors">
                      <span className="text-4xl">◆</span>
                    </div>
                  </div>
                  <p className="font-body text-xs uppercase tracking-widest text-stone mb-2">
                    Story Category
                  </p>
                  <h2 className="font-heading text-2xl text-charcoal mb-2 group-hover:text-accent transition-colors">
                    Story Title
                  </h2>
                  <p className="font-body text-sm text-stone">
                    Story excerpt and preview text.
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
