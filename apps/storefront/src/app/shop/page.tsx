import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { formatAmount, getProducts, isVariantAvailable } from "@/lib/commerce";
import type { Product } from "@/lib/commerce-types";

function ProductCard({ product }: { product: Product }) {
  const variants = product.variants ?? [];
  const pricedVariant = variants.find(
    (variant) => variant.calculated_price?.calculated_amount != null,
  );
  const price = pricedVariant?.calculated_price;
  const available = variants.some(isVariantAvailable);
  const image = product.thumbnail ?? product.images?.[0]?.url;
  const optionCount = variants.length;

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#d7d3d3]">
        {image ? (
          <Image
            src={image}
            alt={product.title}
            fill
            sizes="(max-width: 1023px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.015]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-5 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-[#605d5d]">
            Image being prepared
          </div>
        )}
        {!available && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#f3f2f2]/78">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#201e1d]">Sold out</span>
          </div>
        )}
      </div>
      <div className="pt-4">
        <div className="flex items-start justify-between gap-4 text-sm">
          <div>
            <h2 className="font-medium tracking-[-0.015em] transition-colors group-hover:text-[#ec3013]">{product.title}</h2>
            {product.subtitle && <p className="mt-1 text-xs text-[#605d5d]">{product.subtitle}</p>}
          </div>
          <p className="shrink-0 text-[#201e1d]">
            {price?.calculated_amount != null && price.currency_code
              ? formatAmount(price.calculated_amount, price.currency_code)
              : "Price unavailable"}
          </p>
        </div>
        <div className="mt-3 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.13em] text-[#605d5d]">
          <span>{available ? `${optionCount} ${optionCount === 1 ? "option" : "options"}` : "Currently sold out"}</span>
          <span className="inline-flex items-center gap-1.5 transition-colors group-hover:text-[#ec3013]">
            View piece <ArrowUpRight size={14} weight="light" aria-hidden="true" />
          </span>
        </div>
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
      <main className="min-h-[calc(100vh-4rem)] bg-[#f3f2f2] pt-16 text-[#201e1d]">
        <section className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="border-b-2 border-[#201e1d]/40 py-10 md:py-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#605d5d]">The current edit</p>
            <h1 className="mt-3 text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl">Shop Monereen.</h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#605d5d] md:text-base">A small collection of expressive pieces, made to be worn often and kept for a long time.</p>
            <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold">
              <Link href={products.length ? "#available-pieces" : "#collection-status"} className="border-b border-[#201e1d] pb-1.5 transition-colors hover:border-[#ec3013] hover:text-[#ec3013]">Available pieces</Link>
              <Link href="/materials" className="border-b border-[#201e1d]/40 pb-1.5 text-[#605d5d] transition-colors hover:border-[#ec3013] hover:text-[#ec3013]">Materials and details</Link>
              <Link href="/archive" className="border-b border-[#201e1d]/40 pb-1.5 text-[#605d5d] transition-colors hover:border-[#ec3013] hover:text-[#ec3013]">View the archive</Link>
            </div>
          </div>

          {loadFailed ? (
            <div id="collection-status" className="max-w-lg scroll-mt-24 py-16">
              <h2 className="text-2xl font-semibold tracking-[-0.03em]">The collection is unavailable right now.</h2>
              <p className="mt-4 text-sm leading-7 text-[#605d5d]">Please try again shortly, or explore the archive while the shop reconnects.</p>
              <Link href="/archive" className="mt-7 inline-flex border-b border-[#201e1d] pb-1.5 text-sm font-semibold transition-colors hover:border-[#ec3013] hover:text-[#ec3013]">
                Explore the archive
              </Link>
            </div>
          ) : products.length ? (
            <div id="available-pieces" className="scroll-mt-24 py-9 md:py-12">
              <div className="mb-7 flex items-baseline justify-between border-b border-[#201e1d]/40 pb-4">
                <h2 className="text-lg font-semibold tracking-[-0.02em]">Available now</h2>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#605d5d]">{products.length} {products.length === 1 ? "piece" : "pieces"}</p>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 md:gap-x-7 md:gap-y-14">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              </div>
            </div>
          ) : (
            <div id="collection-status" className="max-w-lg scroll-mt-24 py-16">
              <h2 className="text-2xl font-semibold tracking-[-0.03em]">The first pieces are being prepared.</h2>
              <p className="mt-4 text-sm leading-7 text-[#605d5d]">Browse the archive while product details are published through Monereen.</p>
              <Link href="/archive" className="mt-7 inline-flex border-b border-[#201e1d] pb-1.5 text-sm font-semibold transition-colors hover:border-[#ec3013] hover:text-[#ec3013]">
                Explore the archive
              </Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
