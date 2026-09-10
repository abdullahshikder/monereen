import type { Data } from "@measured/puck"

export interface CalculatedPrice {
  calculated_amount: number | null
  original_amount: number | null
  currency_code: string | null
}

export interface ProductOptionValue {
  id: string
  value: string
  option?: {
    id: string
    title: string
  } | null
}

export interface ProductVariant {
  id: string
  title: string
  manage_inventory?: boolean
  allow_backorder?: boolean
  inventory_quantity?: number
  options?: ProductOptionValue[] | null
  calculated_price?: CalculatedPrice
}

export interface ProductImage {
  id: string
  url: string
}

export interface Product {
  id: string
  title: string
  handle: string
  subtitle?: string | null
  description?: string | null
  thumbnail?: string | null
  images?: ProductImage[] | null
  variants?: ProductVariant[] | null
}

export interface CartLineItem {
  id: string
  title: string
  subtitle?: string | null
  thumbnail?: string | null
  quantity: number
  unit_price: number
  total?: number
  product_handle?: string | null
  variant_title?: string | null
}

export interface Address {
  first_name?: string | null
  last_name?: string | null
  phone?: string | null
  company?: string | null
  address_1?: string | null
  address_2?: string | null
  city?: string | null
  country_code?: string | null
  province?: string | null
  postal_code?: string | null
}

export interface ShippingMethod {
  id: string
  name: string
  amount: number
  total?: number
}

export interface PaymentCollection {
  id: string
}

export interface Cart {
  id: string
  region_id?: string
  email?: string | null
  currency_code: string
  items?: CartLineItem[]
  shipping_address?: Address
  billing_address?: Address
  shipping_methods?: ShippingMethod[]
  payment_collection?: PaymentCollection
  item_total?: number
  subtotal?: number
  shipping_total?: number
  tax_total?: number
  total?: number
}

export interface Region {
  id: string
  currency_code: string
}

export interface ShippingOption {
  id: string
  name: string
  amount: number
  price_type: "flat" | "calculated"
  insufficient_inventory: boolean
}

export interface PaymentProvider {
  id: string
}

export interface PublishedPage {
  id: string
  title: string
  slug: string
  pageType: string
  pageData: Data | null
  seo?: {
    title?: string
    description?: string
  } | null
  publishedAt?: string | null
}

export interface OrderLineItem {
  id: string
  title: string
  subtitle?: string | null
  thumbnail?: string | null
  quantity: number
  unit_price: number
  total?: number
  product_handle?: string | null
  variant_title?: string | null
}

export interface Order {
  id: string
  display_id?: number
  email: string | null
  currency_code: string
  status: string
  payment_status: string
  fulfillment_status: string
  items: OrderLineItem[] | null
  shipping_address?: Address | null
  shipping_methods?: ShippingMethod[] | null
  item_total: number
  shipping_total: number
  tax_total: number
  total: number
  created_at: string
}

export type CompleteCartResult =
  | {
      type: "cart"
      cart: Cart
      error: { message: string; name: string; type: string }
    }
  | { type: "order"; order: Order }
