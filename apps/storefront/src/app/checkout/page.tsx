import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import {
  formatAmount,
  getCart,
  getPaymentProviders,
  getShippingOptions,
} from "@/lib/commerce"
import type {
  Address,
  Cart,
  PaymentProvider,
  ShippingOption,
} from "@/lib/commerce-types"
import { placeOrder, saveCheckoutDetails } from "./actions"

const inputClass =
  "w-full border border-[#201e1d]/40 bg-[#eae9e9] px-4 py-3 font-body text-sm text-[#201e1d] outline-none focus:border-[#ec3013]"
const fieldLabelClass =
  "mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#605d5d]"

const countries = [
  ["bd", "Bangladesh"],
  ["dk", "Denmark"],
  ["fr", "France"],
  ["de", "Germany"],
  ["it", "Italy"],
  ["es", "Spain"],
  ["se", "Sweden"],
  ["gb", "United Kingdom"],
] as const

function AddressFields({
  prefix,
  address,
  required = true,
}: {
  prefix: "shipping" | "billing"
  address?: Address | null
  required?: boolean
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label>
          <span className={fieldLabelClass}>First name</span>
          <input name={`${prefix}FirstName`} defaultValue={address?.first_name ?? ""} autoComplete={`${prefix} given-name`} required={required} className={inputClass} />
        </label>
        <label>
          <span className={fieldLabelClass}>Last name</span>
          <input name={`${prefix}LastName`} defaultValue={address?.last_name ?? ""} autoComplete={`${prefix} family-name`} required={required} className={inputClass} />
        </label>
      </div>
      <label>
        <span className={fieldLabelClass}>Company (optional)</span>
        <input name={`${prefix}Company`} defaultValue={address?.company ?? ""} autoComplete={`${prefix} organization`} className={inputClass} />
      </label>
      <label>
        <span className={fieldLabelClass}>Address</span>
        <input name={`${prefix}Address1`} defaultValue={address?.address_1 ?? ""} autoComplete={`${prefix} address-line1`} required={required} className={inputClass} />
      </label>
      <label>
        <span className={fieldLabelClass}>Apartment, suite, etc. (optional)</span>
        <input name={`${prefix}Address2`} defaultValue={address?.address_2 ?? ""} autoComplete={`${prefix} address-line2`} className={inputClass} />
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label>
          <span className={fieldLabelClass}>City</span>
          <input name={`${prefix}City`} defaultValue={address?.city ?? ""} autoComplete={`${prefix} address-level2`} required={required} className={inputClass} />
        </label>
        <label>
          <span className={fieldLabelClass}>State or province (optional)</span>
          <input name={`${prefix}Province`} defaultValue={address?.province ?? ""} autoComplete={`${prefix} address-level1`} className={inputClass} />
        </label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label>
          <span className={fieldLabelClass}>Postal code</span>
          <input name={`${prefix}PostalCode`} defaultValue={address?.postal_code ?? ""} autoComplete={`${prefix} postal-code`} required={required} className={inputClass} />
        </label>
        <label>
          <span className={fieldLabelClass}>Country</span>
          <select name={`${prefix}CountryCode`} defaultValue={address?.country_code ?? "dk"} autoComplete={`${prefix} country`} required={required} className={inputClass}>
            {countries.map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        <span className={fieldLabelClass}>Phone (optional)</span>
        <input name={`${prefix}Phone`} defaultValue={address?.phone ?? ""} autoComplete={`${prefix} tel`} className={inputClass} />
      </label>
    </div>
  )
}

function OrderSummary({ cart }: { cart: Cart }) {
  return (
    <aside className="h-fit border border-[#201e1d]/40 p-6 lg:sticky lg:top-24">
      <h2 className="font-body text-[11px] uppercase tracking-[0.14em] text-[#605d5d] mb-6">
        Order Summary
      </h2>
      <div className="space-y-5 mb-6">
        {(cart.items ?? []).map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-[#d7d3d3] grayscale">
              {item.thumbnail && (
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex-1">
              <p className="font-body text-sm text-charcoal">{item.title}</p>
              <p className="font-body text-xs text-stone">
                {item.variant_title} · Qty {item.quantity}
              </p>
              <p className="font-body text-sm text-charcoal mt-1">
                {formatAmount(
                  item.total ?? item.unit_price * item.quantity,
                  cart.currency_code,
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-2 border-t border-[#201e1d]/40 pt-4">
        <div className="flex justify-between font-body text-sm">
          <span className="text-stone">Items</span>
          <span>{formatAmount(cart.item_total ?? 0, cart.currency_code)}</span>
        </div>
        <div className="flex justify-between font-body text-sm">
          <span className="text-stone">Shipping</span>
          <span>
            {cart.shipping_methods?.length
              ? formatAmount(cart.shipping_total ?? 0, cart.currency_code)
              : "Choose delivery"}
          </span>
        </div>
        <div className="flex justify-between border-t border-[#201e1d]/40 pt-3 font-body text-base font-medium">
          <span>Total</span>
          <span>{formatAmount(cart.total ?? 0, cart.currency_code)}</span>
        </div>
      </div>
    </aside>
  )
}

function providerName(provider: PaymentProvider): string {
  if (provider.id === "pp_system_default") {
    return "Manual payment (development)"
  }
  return provider.id.replace(/^pp_/, "").replaceAll("_", " ")
}

function DeliveryStep({
  cart,
  shippingOptions,
  paymentProviders,
}: {
  cart: Cart
  shippingOptions: ShippingOption[]
  paymentProviders: PaymentProvider[]
}) {
  const canPlaceOrder = shippingOptions.length > 0 && paymentProviders.length > 0

  return (
    <form action={placeOrder} className="space-y-10">
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-body text-xs uppercase tracking-widest text-stone">
            Deliver to
          </h2>
          <Link
            href="/checkout?step=address"
            className="font-body text-xs uppercase tracking-wider hover:text-accent"
          >
            Edit
          </Link>
        </div>
        <p className="font-body text-sm leading-relaxed">
          {cart.shipping_address?.first_name} {cart.shipping_address?.last_name}
          <br />
          {cart.shipping_address?.address_1}
          <br />
          {cart.shipping_address?.postal_code} {cart.shipping_address?.city},{" "}
          {cart.shipping_address?.country_code?.toUpperCase()}
          <br />
          {cart.email}
        </p>
      </section>

      <fieldset>
        <legend className="font-body text-xs uppercase tracking-widest text-stone mb-4">
          Delivery method
        </legend>
        <div className="space-y-3">
          {shippingOptions.map((option, index) => (
            <label
              key={option.id}
              className="flex items-center justify-between gap-4 p-4 border border-sand cursor-pointer has-[:checked]:border-charcoal"
            >
              <span className="flex items-center gap-3">
                <input
                  type="radio"
                  name="shippingOptionId"
                  value={option.id}
                  defaultChecked={index === 0}
                  required
                  className="accent-charcoal"
                />
                <span className="font-body text-sm">{option.name}</span>
              </span>
              <span className="font-body text-sm">
                {formatAmount(option.amount, cart.currency_code)}
              </span>
            </label>
          ))}
          {!shippingOptions.length && (
            <p className="font-body text-sm text-accent">
              No delivery method is available for this address.
            </p>
          )}
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-body text-xs uppercase tracking-widest text-stone mb-4">
          Payment method
        </legend>
        <div className="space-y-3">
          {paymentProviders.map((provider, index) => (
            <label
              key={provider.id}
              className="flex items-center gap-3 p-4 border border-sand cursor-pointer has-[:checked]:border-charcoal"
            >
              <input
                type="radio"
                name="paymentProviderId"
                value={provider.id}
                defaultChecked={index === 0}
                required
                className="accent-charcoal"
              />
              <span className="font-body text-sm capitalize">
                {providerName(provider)}
              </span>
            </label>
          ))}
          {!paymentProviders.length && (
            <p className="font-body text-sm text-accent">
              No payment provider is enabled for this region.
            </p>
          )}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={!canPlaceOrder}
        className="w-full bg-[#ec3013] py-4 font-body text-sm font-semibold text-[#f3f2f2] transition-colors hover:bg-[#ae1800] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Place order
      </button>
    </form>
  )
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string; error?: string }>
}) {
  const cart = await getCart()
  if (!cart?.items?.length) {
    redirect("/cart")
  }

  const deliveryStep = (await searchParams).step === "delivery"
  if (deliveryStep && !cart.shipping_address) {
    redirect("/checkout?step=address")
  }

  let shippingOptions: ShippingOption[] = []
  let paymentProviders: PaymentProvider[] = []
  let optionsFailed = false

  if (deliveryStep) {
    try {
      ;[shippingOptions, paymentProviders] = await Promise.all([
        getShippingOptions(cart.id),
        getPaymentProviders(cart.region_id ?? ""),
      ])
    } catch {
      optionsFailed = true
    }
  }

  return (
    <>
      <Header />
      <main className="bg-[#f3f2f2] pt-16 text-[#201e1d]">
        <section className="mx-auto max-w-[1120px] px-5 py-14 sm:px-8 md:py-20">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#7d7979]">Checkout</p>
            <h1 className="mt-3 font-body text-4xl font-bold tracking-[-0.03em] sm:text-5xl">Your selection</h1>
            <p className="mt-3 font-body text-sm text-[#605d5d] mb-12">
              {deliveryStep ? "Delivery and payment" : "Contact and address"}
            </p>

            {(await searchParams).error && (
              <p className="mb-8 border border-accent bg-accent/5 p-4 font-body text-sm text-accent">
                {(await searchParams).error}
              </p>
            )}
            {optionsFailed && (
              <p className="mb-8 border border-accent bg-accent/5 p-4 font-body text-sm text-accent">
                Delivery and payment options could not be loaded. Try again.
              </p>
            )}

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {deliveryStep ? (
                <DeliveryStep
                  cart={cart}
                  shippingOptions={shippingOptions}
                  paymentProviders={paymentProviders}
                />
              ) : (
                <form action={saveCheckoutDetails} className="space-y-10">
                  <section>
                    <h2 className="font-body text-xs uppercase tracking-widest text-stone mb-4">
                      Contact
                    </h2>
                    <label>
                      <span className={fieldLabelClass}>Email address</span>
                      <input type="email" name="email" defaultValue={cart.email ?? ""} autoComplete="email" required className={inputClass} />
                    </label>
                  </section>

                  <section>
                    <h2 className="font-body text-xs uppercase tracking-widest text-stone mb-4">
                      Shipping address
                    </h2>
                    <AddressFields
                      prefix="shipping"
                      address={cart.shipping_address}
                    />
                  </section>

                  <section>
                    <label className="flex items-center gap-3 font-body text-sm">
                      <input
                        type="checkbox"
                        name="billingSame"
                        defaultChecked
                        className="accent-charcoal"
                      />
                      Billing address is the same as shipping
                    </label>
                    <details className="mt-5 border-t border-sand pt-5">
                      <summary className="font-body text-sm cursor-pointer">
                        Enter a different billing address
                      </summary>
                      <div className="mt-5">
                        <AddressFields
                          prefix="billing"
                          address={cart.billing_address}
                          required={false}
                        />
                      </div>
                    </details>
                  </section>

                  <button
                    type="submit"
                    className="w-full bg-[#ec3013] py-4 font-body text-sm font-semibold text-[#f3f2f2] transition-colors hover:bg-[#ae1800]"
                  >
                    Continue to delivery
                  </button>
                </form>
              )}

              <OrderSummary cart={cart} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
