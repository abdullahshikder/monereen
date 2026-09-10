import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Image from "next/image";
import Link from "next/link";
import { formatAmount, getCart } from "@/lib/commerce";
import { removeCartItem, updateCartItem } from "./actions";

export default async function CartPage() {
  const cart = await getCart();
  const items = cart?.items ?? [];

  return (
    <>
      <Header />
      <main className="pt-16">
        <section className="py-section-lg px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-heading text-5xl text-charcoal mb-12">
              Your Bag
            </h1>

            {items.length === 0 || !cart ? (
              <div className="text-center py-section-md">
                <p className="font-body text-lg text-stone mb-8">
                  Your bag is empty.
                </p>
                <Link
                  href="/shop"
                  className="inline-block font-body text-sm uppercase tracking-wider bg-charcoal text-ivory px-8 py-4 hover:bg-accent transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="grid gap-12 lg:grid-cols-[1fr_20rem]">
                <div className="divide-y divide-sand border-y border-sand">
                  {items.map((item) => (
                    <article key={item.id} className="py-6 flex gap-5">
                      <div className="relative h-36 w-28 shrink-0 bg-sand overflow-hidden">
                        {item.thumbnail ? (
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            fill
                            sizes="112px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center text-stone">
                            ◇
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between gap-4">
                          <div>
                            <Link
                              href={item.product_handle ? `/products/${item.product_handle}` : "/shop"}
                              className="font-heading text-xl hover:text-accent transition-colors"
                            >
                              {item.title}
                            </Link>
                            {item.variant_title && (
                              <p className="font-body text-sm text-stone mt-1">
                                {item.variant_title}
                              </p>
                            )}
                          </div>
                          <p className="font-body text-sm">
                            {formatAmount(
                              item.total ?? item.unit_price * item.quantity,
                              cart.currency_code,
                            )}
                          </p>
                        </div>
                        <div className="mt-6 flex items-end justify-between gap-4">
                          <form action={updateCartItem} className="flex items-end gap-2">
                            <input type="hidden" name="lineItemId" value={item.id} />
                            <label className="font-body text-xs uppercase tracking-wider text-stone">
                              Quantity
                              <input
                                name="quantity"
                                type="number"
                                min="1"
                                max="99"
                                defaultValue={item.quantity}
                                className="mt-2 block w-20 border border-sand bg-transparent px-3 py-2 text-charcoal"
                              />
                            </label>
                            <button className="font-body text-xs uppercase tracking-wider px-3 py-2 hover:text-accent">
                              Update
                            </button>
                          </form>
                          <form action={removeCartItem}>
                            <input type="hidden" name="lineItemId" value={item.id} />
                            <button className="font-body text-xs uppercase tracking-wider text-stone hover:text-accent">
                              Remove
                            </button>
                          </form>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <aside className="bg-sand/50 p-6 h-fit">
                  <h2 className="font-heading text-2xl mb-6">Summary</h2>
                  <div className="flex justify-between font-body text-sm pb-4 border-b border-stone/40">
                    <span>Subtotal</span>
                    <span>
                      {formatAmount(
                        cart.item_total ?? cart.subtotal ?? cart.total ?? 0,
                        cart.currency_code,
                      )}
                    </span>
                  </div>
                  <p className="font-body text-xs text-stone my-4">
                    Shipping and taxes are calculated at checkout.
                  </p>
                  <Link
                    href="/checkout"
                    className="block text-center bg-charcoal text-ivory font-body text-sm uppercase tracking-wider py-4 hover:bg-accent transition-colors"
                  >
                    Checkout
                  </Link>
                </aside>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
