import { cookies } from "next/headers"
import type {
  Address,
  Cart,
  CompleteCartResult,
  Order,
  PaymentCollection,
  PaymentProvider,
  Product,
  ProductVariant,
  PublishedPage,
  Region,
  ShippingOption,
} from "./commerce-types"

const CART_COOKIE = "monereen_cart_id"
const CART_MAX_AGE = 60 * 60 * 24 * 30
const LAST_ORDER_COOKIE = "monereen_last_order_id"
const LAST_ORDER_MAX_AGE = 60 * 60 * 24 * 7

export const MEDUSA_BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL ||
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  "http://localhost:9000"

const PUBLISHABLE_KEY =
  process.env.MEDUSA_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ||
  ""

type StoreRequestOptions = RequestInit & {
  next?: { revalidate: number }
}

async function storeRequest<T>(
  path: string,
  options: StoreRequestOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set("accept", "application/json")

  if (options.body) {
    headers.set("content-type", "application/json")
  }

  if (PUBLISHABLE_KEY) {
    headers.set("x-publishable-api-key", PUBLISHABLE_KEY)
  }

  const response = await fetch(`${MEDUSA_BACKEND_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 240)
    throw new Error(
      `Medusa request failed (${response.status} ${response.statusText}): ${detail}`,
    )
  }

  return response.json() as Promise<T>
}

function catalogParams(regionId: string) {
  // Medusa prices use the region context; inventory is an opt-in response field.
  return new URLSearchParams({
    region_id: regionId,
    fields: "+variants.inventory_quantity",
  })
}

export async function getDefaultRegion(): Promise<Region> {
  const data = await storeRequest<{ regions: Region[] }>(
    "/store/regions?limit=1",
    { next: { revalidate: 300 } },
  )

  if (!data.regions[0]) {
    throw new Error("No Medusa region is configured")
  }

  return data.regions[0]
}

export async function getProducts(): Promise<Product[]> {
  const region = await getDefaultRegion()
  const params = catalogParams(region.id)
  params.set("limit", "100")

  const data = await storeRequest<{ products: Product[] }>(
    `/store/products?${params}`,
    { next: { revalidate: 60 } },
  )

  return data.products
}

export async function getProductByHandle(
  handle: string,
): Promise<Product | null> {
  const region = await getDefaultRegion()
  const params = catalogParams(region.id)
  params.set("handle", handle)
  params.set("limit", "1")

  const data = await storeRequest<{ products: Product[] }>(
    `/store/products?${params}`,
    { next: { revalidate: 60 } },
  )

  return data.products[0] ?? null
}

export async function getPublishedPageBySlug(
  slug: string,
): Promise<PublishedPage | null> {
  try {
    const data = await storeRequest<{ page: PublishedPage }>(
      `/store/pages/${encodeURIComponent(slug)}`,
      { next: { revalidate: 60 } },
    )
    return data.page
  } catch {
    return null
  }
}

export function isVariantAvailable(variant: ProductVariant): boolean {
  return (
    !variant.manage_inventory ||
    Boolean(variant.allow_backorder) ||
    (variant.inventory_quantity ?? 0) > 0
  )
}

export function formatAmount(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(amount)
}

export function getVariantLabel(variant: ProductVariant): string {
  const values = variant.options?.map((option) => option.value).filter(Boolean)
  return values?.length ? values.join(" / ") : variant.title
}

export async function getCart(): Promise<Cart | null> {
  const cookieStore = await cookies()
  const cartId = cookieStore.get(CART_COOKIE)?.value

  if (!cartId) {
    return null
  }

  try {
    const data = await storeRequest<{ cart: Cart }>(`/store/carts/${cartId}`, {
      cache: "no-store",
    })
    return data.cart
  } catch {
    return null
  }
}

export async function getCartQuantity(): Promise<number> {
  const cart = await getCart()
  return (cart?.items ?? []).reduce((total, item) => total + item.quantity, 0)
}

export async function getOrCreateCart(): Promise<Cart> {
  const cookieStore = await cookies()
  const existingCart = await getCart()

  if (existingCart) {
    return existingCart
  }

  const region = await getDefaultRegion()
  const data = await storeRequest<{ cart: Cart }>("/store/carts", {
    method: "POST",
    body: JSON.stringify({ region_id: region.id }),
    cache: "no-store",
  })

  cookieStore.set(CART_COOKIE, data.cart.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: CART_MAX_AGE,
    path: "/",
  })

  return data.cart
}

export async function addCartLineItem(
  cartId: string,
  variantId: string,
  quantity: number,
): Promise<Cart> {
  const data = await storeRequest<{ cart: Cart }>(
    `/store/carts/${cartId}/line-items`,
    {
      method: "POST",
      body: JSON.stringify({ variant_id: variantId, quantity }),
      cache: "no-store",
    },
  )
  return data.cart
}

export async function updateCartLineItem(
  cartId: string,
  lineItemId: string,
  quantity: number,
): Promise<Cart> {
  const data = await storeRequest<{ cart: Cart }>(
    `/store/carts/${cartId}/line-items/${lineItemId}`,
    {
      method: "POST",
      body: JSON.stringify({ quantity }),
      cache: "no-store",
    },
  )
  return data.cart
}

export async function deleteCartLineItem(
  cartId: string,
  lineItemId: string,
): Promise<void> {
  await storeRequest(`/store/carts/${cartId}/line-items/${lineItemId}`, {
    method: "DELETE",
    cache: "no-store",
  })
}

export async function updateCartDetails(
  cartId: string,
  details: {
    email: string
    shipping_address: Address
    billing_address: Address
  },
): Promise<Cart> {
  const data = await storeRequest<{ cart: Cart }>(`/store/carts/${cartId}`, {
    method: "POST",
    body: JSON.stringify(details),
    cache: "no-store",
  })
  return data.cart
}

export async function getShippingOptions(
  cartId: string,
): Promise<ShippingOption[]> {
  const params = new URLSearchParams({ cart_id: cartId })
  const data = await storeRequest<{ shipping_options: ShippingOption[] }>(
    `/store/shipping-options?${params}`,
    { cache: "no-store" },
  )
  return data.shipping_options.filter((option) => !option.insufficient_inventory)
}

export async function addCartShippingMethod(
  cartId: string,
  optionId: string,
): Promise<Cart> {
  const data = await storeRequest<{ cart: Cart }>(
    `/store/carts/${cartId}/shipping-methods`,
    {
      method: "POST",
      body: JSON.stringify({ option_id: optionId }),
      cache: "no-store",
    },
  )
  return data.cart
}

export async function getPaymentProviders(
  regionId: string,
): Promise<PaymentProvider[]> {
  const params = new URLSearchParams({ region_id: regionId })
  const data = await storeRequest<{ payment_providers: PaymentProvider[] }>(
    `/store/payment-providers?${params}`,
    { cache: "no-store" },
  )
  return data.payment_providers
}

async function createPaymentCollection(
  cartId: string,
): Promise<PaymentCollection> {
  const data = await storeRequest<{ payment_collection: PaymentCollection }>(
    "/store/payment-collections",
    {
      method: "POST",
      body: JSON.stringify({ cart_id: cartId }),
      cache: "no-store",
    },
  )
  return data.payment_collection
}

export async function initializePaymentSession(
  cart: Cart,
  providerId: string,
): Promise<void> {
  const collection =
    cart.payment_collection ?? (await createPaymentCollection(cart.id))

  await storeRequest(
    `/store/payment-collections/${collection.id}/payment-sessions`,
    {
      method: "POST",
      body: JSON.stringify({ provider_id: providerId }),
      cache: "no-store",
    },
  )
}

export async function completeCart(cartId: string): Promise<Order> {
  const cookieStore = await cookies()
  const result = await storeRequest<CompleteCartResult>(
    `/store/carts/${cartId}/complete`,
    { method: "POST", cache: "no-store" },
  )

  if (result.type === "cart") {
    throw new Error(result.error.message)
  }

  cookieStore.delete(CART_COOKIE)
  cookieStore.set(LAST_ORDER_COOKIE, result.order.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: LAST_ORDER_MAX_AGE,
    path: "/",
  })

  return result.order
}

export async function getOrderForConfirmation(
  orderId: string,
): Promise<Order | null> {
  const cookieStore = await cookies()
  if (cookieStore.get(LAST_ORDER_COOKIE)?.value !== orderId) {
    return null
  }

  try {
    const data = await storeRequest<{ order: Order }>(
      `/store/orders/${orderId}`,
      { cache: "no-store" },
    )
    return data.order
  } catch {
    return null
  }
}
