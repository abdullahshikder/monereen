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
      <main className="bg-[#f3f2f2] pt-16 text-[#201e1d]">
        <section className="mx-auto max-w-[1120px] px-5 py-14 sm:px-8 md:py-20">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#7d7979]">Cart</p>
            <h1 className="mt-3 font-body text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
              Your Bag
            </h1>

            {items.length === 0 || !cart ? (
              <div className="border-y border-[#201e1d]/40 py-16">
                <p className="font-body text-lg text-[#605d5d] mb-8">
                  Your bag is empty.
                </p>
                <Link
                  href="/shop"
                  className="inline-block bg-[#ec3013] px-6 py-3.5 font-body text-sm font-semibold text-[#f3f2f2] transition-colors hover:bg-[#ae1800]"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_20rem]">
                <div className="divide-y divide-[#201e1d]/25 border-y border-[#201e1d]/40">
                  {items.map((item) => (
                    <article key={item.id} className="py-6 flex gap-5">
                      <div className="relative h-36 w-28 shrink-0 overflow-hidden bg-[#d7d3d3] grayscale">
                        {item.thumbnail ? (
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            fill
                            sizes="112px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center px-3 text-center text-[9px] font-semibold uppercase tracking-[0.13em] text-[#605d5d]">
                            Image being prepared
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between gap-4">
                          <div>
                            <Link
                              href={item.product_handle ? `/products/${item.product_handle}` : "/shop"}
                              className="font-body text-lg font-semibold transition-colors hover:text-[#ec3013]"
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

                <aside className="h-fit border border-[#201e1d]/40 p-6">
                  <h2 className="font-body text-lg font-semibold mb-6">Summary</h2>
                  <div className="flex justify-between font-body text-sm pb-4 border-b border-[#201e1d]/40">
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
                    className="block bg-[#ec3013] py-4 text-center font-body text-sm font-semibold text-[#f3f2f2] transition-colors hover:bg-[#ae1800]"
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
