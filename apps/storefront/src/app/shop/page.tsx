import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  formatAmount,
  getProducts,
  isVariantAvailable,
} from "@/lib/commerce";
import type { Product } from "@/lib/commerce-types";

const catalogueChapters = [
  {
    title: "Printed",
    href: "/archive#collections",
    image: "/brand/editorial/print-black.jpg",
    alt: "Black and ivory printed Monereen garment",
  },
  {
    title: "Kaftans",
    href: "/shop?category=kaftans",
    image: "/brand/editorial/kaftan-silk.jpg",
    alt: "Silk printed Monereen kaftan against pink cloth",
  },
  {
    title: "Solids",
    href: "/archive",
    image: "/brand/editorial/solid-black.jpg",
    alt: "Black Monereen garment with gold embellishment",
  },
] as const;

function ProductCard({ product }: { product: Product }) {
  const variants = product.variants ?? [];
  const pricedVariant = variants.find(
    (variant) => variant.calculated_price?.calculated_amount != null,
  );
  const price = pricedVariant?.calculated_price;
  const available = variants.some(isVariantAvailable);
  const image = product.thumbnail ?? product.images?.[0]?.url;

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="aspect-[3/4] bg-sand mb-4 overflow-hidden relative">
        {image ? (
          <Image
            src={image}
            alt={product.title}
            fill
            sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone">
            <span className="text-4xl">◇</span>
          </div>
        )}
        {!available && (
          <div className="absolute inset-0 bg-ivory/70 flex items-center justify-center">
            <span className="font-body text-xs uppercase tracking-widest text-charcoal">
              Sold Out
            </span>
          </div>
        )}
      </div>
      <h3 className="font-body text-sm text-charcoal mb-1">{product.title}</h3>
      <div className="font-body text-sm text-stone">
        {price?.calculated_amount != null && price.currency_code ? (
          <span className={available ? "text-charcoal" : "text-stone"}>
            {formatAmount(price.calculated_amount, price.currency_code)}
          </span>
        ) : (
          <span>Price unavailable</span>
        )}
      </div>
    </Link>
  );
}

export default async function ShopPage() {
  let products: Product[] = [];
  let loadFailed = false;

  try {
    products = await getProducts();
  } catch {
    loadFailed = true;
  }

  return (
    <>
      <Header />
      <main className="bg-[#f6f2ea] pt-16 text-[#211f1b]">
        <section className="grid border-b border-[#d8d1c4] md:grid-cols-[0.82fr_1.18fr]">
          <div className="flex min-h-[58svh] flex-col justify-between px-5 py-12 sm:px-8 md:px-12 md:py-16">
            <p className="text-[10px] uppercase tracking-[0.2em]">The catalogue</p>
            <div className="py-16">
              <h1 className="font-heading text-[clamp(4.5rem,9vw,8rem)] leading-[0.82] tracking-[-0.05em]">Objects with memory.</h1>
              <p className="mt-8 max-w-lg text-sm leading-7 text-[#655e54] md:text-base">
                Garments and crafted forms made for personal expression, each carrying a record of material, process, and hand.
              </p>
            </div>
            <p className="border-t border-[#aaa092] pt-5 text-[10px] uppercase tracking-[0.18em] text-[#6e655a]">Clothing · Craft · Limited studies</p>
          </div>
          <div className="relative min-h-[65svh] md:min-h-[75svh]">
            <Image src="/brand/editorial/print-black.jpg" alt="Woman wearing a black and ivory printed Monereen garment" fill priority sizes="(max-width: 767px) 100vw, 60vw" className="object-cover" />
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 md:py-28">
          <div className="mx-auto max-w-[92rem]">
            <div className="mb-12 flex items-end justify-between border-b border-[#aaa092] pb-5">
              <div>
                <p className="mb-3 text-[10px] uppercase tracking-[0.2em]">{products.length ? "Available pieces" : "From the archive"}</p>
                <h2 className="font-heading text-4xl tracking-[-0.035em] md:text-6xl">{products.length ? "The current edit" : "Collection preview"}</h2>
              </div>
              {products.length > 0 && <span className="text-[10px] tabular-nums uppercase tracking-[0.18em]">{products.length} pieces</span>}
            </div>

            {loadFailed ? (
              <div className="border border-sand p-8 font-body text-stone">
                The shop is temporarily unavailable. Check the Medusa connection
                and publishable key.
              </div>
            ) : products.length ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div>
                <p className="mb-10 max-w-xl text-sm leading-7 text-[#655e54]">The first commerce edit is being prepared. Explore the visual catalogue while product details are published through Medusa.</p>
                <div className="grid gap-10 md:grid-cols-3 md:gap-5">
                  {catalogueChapters.map((chapter, index) => (
                    <Link key={chapter.title} href={chapter.href} className={`group block ${index === 1 ? "md:mt-20" : ""}`}>
                      <div className="relative aspect-[3/4] overflow-hidden bg-[#d8d1c4]">
                        <Image src={chapter.image} alt={chapter.alt} fill sizes="(max-width: 767px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-[#aaa092] pt-4">
                        <h3 className="font-heading text-2xl">{chapter.title}</h3>
                        <ArrowUpRight size={17} aria-hidden="true" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
