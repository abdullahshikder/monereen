import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { formatAmount, getOrderForConfirmation } from "@/lib/commerce"

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const order = await getOrderForConfirmation((await params).id)
  if (!order) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="bg-[#f3f2f2] pt-16 text-[#201e1d]">
        <section className="mx-auto max-w-[1120px] px-5 py-14 sm:px-8 md:py-20">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#7d7979]">
              Order confirmed
            </p>
            <h1 className="mt-4 font-body text-4xl font-bold leading-[1.03] tracking-[-0.03em] sm:text-5xl">
              Thank you for your order.
            </h1>
            <p className="mt-4 font-body text-sm text-[#605d5d]">
              Order #{order.display_id ?? order.id} was placed for {order.email}.
            </p>

            <div className="mt-10 border-y border-[#201e1d]/40 divide-y divide-[#201e1d]/25">
              {(order.items ?? []).map((item) => (
                <article key={item.id} className="py-6 flex gap-5">
                  <div className="relative h-28 w-24 shrink-0 overflow-hidden bg-[#d7d3d3] grayscale">
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
                      <p className="font-body text-lg font-semibold">{item.title}</p>
                      <p className="mt-1 font-body text-sm text-[#605d5d]">
                        {item.variant_title} / Qty {item.quantity}
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

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <section>
                <h2 className="mb-3 font-body text-[11px] uppercase tracking-[0.14em] text-[#7d7979]">
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
              <section className="border-t border-[#201e1d]/40 pt-5 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
                <h2 className="mb-3 font-body text-[11px] uppercase tracking-[0.14em] text-[#7d7979]">
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
                  <div className="flex justify-between border-t border-[#201e1d]/40 pt-2 font-medium">
                    <span>Total</span>
                    <span>{formatAmount(order.total, order.currency_code)}</span>
                  </div>
                </div>
              </section>
            </div>

            <Link
              href="/shop"
              className="mt-12 inline-block bg-[#ec3013] px-6 py-3.5 font-body text-sm font-semibold text-[#f3f2f2] transition-colors hover:bg-[#ae1800]"
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
