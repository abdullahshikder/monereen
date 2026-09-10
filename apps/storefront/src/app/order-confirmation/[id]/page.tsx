import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { formatAmount, getOrderForConfirmation } from "@/lib/commerce"

export default async function OrderConfirmationPage({
  params,
}: {
  params: { id: string }
}) {
  const order = await getOrderForConfirmation(params.id)
  if (!order) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="pt-16">
        <section className="py-section-lg px-6">
          <div className="max-w-3xl mx-auto">
            <p className="font-body text-xs uppercase tracking-widest text-accent mb-4">
              Order confirmed
            </p>
            <h1 className="font-heading text-5xl text-charcoal mb-4">
              Thank you for your order.
            </h1>
            <p className="font-body text-stone mb-10">
              Order #{order.display_id ?? order.id} was placed for {order.email}.
            </p>

            <div className="border-y border-sand divide-y divide-sand">
              {(order.items ?? []).map((item) => (
                <article key={item.id} className="py-6 flex gap-5">
                  <div className="relative h-28 w-24 shrink-0 bg-sand overflow-hidden">
                    {item.thumbnail && (
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 flex justify-between gap-4">
                    <div>
                      <p className="font-heading text-xl">{item.title}</p>
                      <p className="font-body text-sm text-stone mt-1">
                        {item.variant_title} · Qty {item.quantity}
                      </p>
                    </div>
                    <p className="font-body text-sm">
                      {formatAmount(
                        item.total ?? item.unit_price * item.quantity,
                        order.currency_code,
                      )}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-8 mt-10">
              <section>
                <h2 className="font-body text-xs uppercase tracking-widest text-stone mb-3">
                  Delivery address
                </h2>
                <p className="font-body text-sm leading-relaxed">
                  {order.shipping_address?.first_name} {order.shipping_address?.last_name}
                  <br />
                  {order.shipping_address?.address_1}
                  <br />
                  {order.shipping_address?.postal_code} {order.shipping_address?.city}
                  <br />
                  {order.shipping_address?.country_code?.toUpperCase()}
                </p>
              </section>
              <section>
                <h2 className="font-body text-xs uppercase tracking-widest text-stone mb-3">
                  Total
                </h2>
                <div className="font-body text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Items</span>
                    <span>{formatAmount(order.item_total, order.currency_code)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {formatAmount(order.shipping_total, order.currency_code)}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium border-t border-sand pt-2">
                    <span>Total</span>
                    <span>{formatAmount(order.total, order.currency_code)}</span>
                  </div>
                </div>
              </section>
            </div>

            <Link
              href="/shop"
              className="inline-block mt-12 bg-charcoal text-ivory font-body text-sm uppercase tracking-wider px-8 py-4 hover:bg-accent transition-colors"
            >
              Continue shopping
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
