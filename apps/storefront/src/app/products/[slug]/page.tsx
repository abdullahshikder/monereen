import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { addToCart } from "@/app/cart/actions";
import {
  formatAmount,
  getProductByHandle,
  getVariantLabel,
  isVariantAvailable,
} from "@/lib/commerce";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const product = await getProductByHandle((await params).slug);

  if (!product) {
    notFound();
  }

  const variants = product.variants ?? [];
  const firstAvailableVariant = variants.find(isVariantAvailable);
  const price = firstAvailableVariant?.calculated_price;
  const image = product.thumbnail ?? product.images?.[0]?.url;
  const productImages = product.images?.length
    ? product.images
    : image
      ? [{ id: "thumbnail", url: image }]
      : [];

  return (
    <>
      <Header />
      <main className="bg-[#f3f2f2] pt-16 text-[#201e1d]">
        <section className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 md:py-10">
          <nav className="mb-6 text-[11px] uppercase tracking-[0.14em] text-[#605d5d]">
            <Link href="/shop" className="transition-colors hover:text-[#ec3013]">
              Clothing
            </Link>
            <span className="mx-2">/</span>
            <span>{product.title}</span>
          </nav>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(21rem,.8fr)] lg:gap-12">
            <div className="grid gap-3 sm:grid-cols-2">
              {productImages.length ? (
                productImages.map((productImage, index) => (
                  <div
                    key={productImage.id}
                    className={`relative aspect-[3/4] overflow-hidden bg-[#d7d3d3] grayscale ${index === 0 ? "sm:col-span-2" : ""}`}
                  >
                    <Image
                      src={productImage.url}
                      alt={index === 0 ? product.title : `${product.title} detail ${index + 1}`}
                      fill
                      priority={index === 0}
                      sizes={index === 0 ? "(max-width: 1023px) 100vw, 55vw" : "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 28vw"}
                      className="object-cover"
                    />
                  </div>
                ))
              ) : (
                <div className="flex aspect-[3/4] items-center justify-center bg-[#d7d3d3] px-8 text-center text-sm text-[#605d5d] sm:col-span-2">
                  Product images are being prepared.
                </div>
              )}
            </div>

            <div className="flex flex-col border-t border-[#201e1d]/40 pt-6 lg:border-t-0 lg:pt-0">
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#7d7979]">Monereen collection</p>
                <h1 className="mt-4 font-body text-4xl font-bold leading-[1.03] tracking-[-0.03em] sm:text-5xl">
                  {product.title}
                </h1>
                {product.subtitle && (
                  <p className="mt-3 font-body text-sm text-[#605d5d]">
                    {product.subtitle}
                  </p>
                )}

                <div className="mt-6 border-y border-[#201e1d]/40 py-4 font-body text-lg font-medium">
                  {price?.calculated_amount != null && price.currency_code
                    ? formatAmount(price.calculated_amount, price.currency_code)
                    : "Price unavailable"}
                </div>

                <form action={addToCart}>
                  <fieldset className="py-7">
                    <legend className="mb-4 font-body text-[11px] uppercase tracking-[0.14em] text-[#605d5d]">
                      Choose an option
                    </legend>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {variants.map((variant) => {
                        const available = isVariantAvailable(variant);
                        return (
                          <label key={variant.id} className="relative">
                            <input
                              type="radio"
                              name="variantId"
                              value={variant.id}
                              required
                              disabled={!available}
                              defaultChecked={variant.id === firstAvailableVariant?.id}
                              className="peer sr-only"
                            />
                            <span className="block cursor-pointer border border-[#201e1d]/40 px-4 py-3 text-center font-body text-sm transition-colors peer-checked:border-[#ec3013] peer-checked:bg-[#ec3013] peer-checked:text-[#f3f2f2] peer-disabled:cursor-not-allowed peer-disabled:opacity-40">
                              {getVariantLabel(variant)}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  <button
                    type="submit"
                    disabled={!firstAvailableVariant || price?.calculated_amount == null}
                    className="w-full bg-[#ec3013] py-4 font-body text-sm font-semibold text-[#f3f2f2] transition-colors hover:bg-[#ae1800] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {firstAvailableVariant ? "Add to Bag" : "Sold Out"}
                  </button>
                </form>

                <div className="mt-10 border-t border-[#201e1d]/40 pt-6">
                  <h3 className="font-body text-[11px] uppercase tracking-[0.14em] text-[#605d5d]">
                    About this piece
                  </h3>
                  <p className="mt-4 font-body text-sm leading-7 text-[#444141] whitespace-pre-line">
                    {product.description || "More details about this piece are coming soon."}
                  </p>
                </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
