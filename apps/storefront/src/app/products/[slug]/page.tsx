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
  params: { slug: string };
}) {
  const product = await getProductByHandle(params.slug);

  if (!product) {
    notFound();
  }

  const variants = product.variants ?? [];
  const firstAvailableVariant = variants.find(isVariantAvailable);
  const price = firstAvailableVariant?.calculated_price;
  const image = product.thumbnail ?? product.images?.[0]?.url;

  return (
    <>
      <Header />
      <main className="pt-16">
        <section className="py-section-md px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-[3/4] bg-sand relative overflow-hidden">
                {image ? (
                  <Image
                    src={image}
                    alt={product.title}
                    fill
                    priority
                    sizes="(max-width: 1023px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone">
                    <span className="text-6xl">◇</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col justify-center">
                <nav className="font-body text-xs uppercase tracking-widest text-stone mb-6">
                  <Link href="/shop" className="hover:text-charcoal transition-colors">
                    Shop
                  </Link>
                  <span className="mx-2">/</span>
                  <span>{product.title}</span>
                </nav>

                <h1 className="font-heading text-4xl text-charcoal mb-2">
                  {product.title}
                </h1>
                {product.subtitle && (
                  <p className="font-body text-lg text-stone mb-6">
                    {product.subtitle}
                  </p>
                )}

                <div className="font-body text-2xl text-charcoal mb-8">
                  {price?.calculated_amount != null && price.currency_code
                    ? formatAmount(price.calculated_amount, price.currency_code)
                    : "Price unavailable"}
                </div>

                <form action={addToCart}>
                  <fieldset className="mb-8">
                    <legend className="font-body text-xs uppercase tracking-widest text-stone mb-3">
                      Choose an option
                    </legend>
                    <div className="flex flex-wrap gap-3">
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
                            <span className="block border border-sand px-4 py-3 font-body text-sm text-charcoal cursor-pointer peer-checked:border-charcoal peer-checked:bg-charcoal peer-checked:text-ivory peer-disabled:opacity-40 peer-disabled:cursor-not-allowed transition-colors">
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
                    className="w-full bg-charcoal text-ivory font-body text-sm uppercase tracking-wider py-4 hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {firstAvailableVariant ? "Add to Bag" : "Sold Out"}
                  </button>
                </form>

                <div className="mt-12 pt-8 border-t border-sand">
                  <h3 className="font-body text-xs uppercase tracking-widest text-stone mb-4">
                    The Story
                  </h3>
                  <p className="font-body text-sm text-charcoal leading-relaxed whitespace-pre-line">
                    {product.description || "More details about this piece are coming soon."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
