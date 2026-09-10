"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {
  addCartShippingMethod,
  completeCart,
  getCart,
  initializePaymentSession,
  updateCartDetails,
} from "@/lib/commerce"
import type { Address } from "@/lib/commerce-types"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

class CheckoutInputError extends Error {}

function value(formData: FormData, key: string): string {
  const field = formData.get(key)
  return typeof field === "string" ? field.trim() : ""
}

function requiredValue(formData: FormData, key: string): string {
  const field = value(formData, key)
  if (!field) {
    throw new CheckoutInputError("Please complete every required field.")
  }
  return field
}

function addressFromForm(formData: FormData, prefix: string): Address {
  return {
    first_name: requiredValue(formData, `${prefix}FirstName`),
    last_name: requiredValue(formData, `${prefix}LastName`),
    phone: value(formData, `${prefix}Phone`) || null,
    company: value(formData, `${prefix}Company`) || null,
    address_1: requiredValue(formData, `${prefix}Address1`),
    address_2: value(formData, `${prefix}Address2`) || null,
    city: requiredValue(formData, `${prefix}City`),
    country_code: requiredValue(formData, `${prefix}CountryCode`).toLowerCase(),
    province: value(formData, `${prefix}Province`) || null,
    postal_code: requiredValue(formData, `${prefix}PostalCode`),
  }
}

function checkoutError(step: "address" | "delivery", message: string): never {
  redirect(`/checkout?step=${step}&error=${encodeURIComponent(message)}`)
}

export async function saveCheckoutDetails(formData: FormData) {
  const cart = await getCart()
  if (!cart?.items?.length) {
    redirect("/cart")
  }

  try {
    const email = requiredValue(formData, "email")
    if (!EMAIL_PATTERN.test(email)) {
      throw new CheckoutInputError("Enter a valid email address.")
    }

    const shippingAddress = addressFromForm(formData, "shipping")
    const billingAddress = formData.get("billingSame")
      ? shippingAddress
      : addressFromForm(formData, "billing")

    await updateCartDetails(cart.id, {
      email,
      shipping_address: shippingAddress,
      billing_address: billingAddress,
    })
  } catch (error) {
    checkoutError(
      "address",
      error instanceof CheckoutInputError
        ? error.message
        : "We couldn't save your details. Please try again.",
    )
  }

  revalidatePath("/checkout")
  redirect("/checkout?step=delivery")
}

export async function placeOrder(formData: FormData) {
  const cart = await getCart()
  if (!cart?.items?.length) {
    redirect("/cart")
  }

  let orderId: string

  try {
    const shippingOptionId = requiredValue(formData, "shippingOptionId")
    const paymentProviderId = requiredValue(formData, "paymentProviderId")
    const updatedCart = await addCartShippingMethod(cart.id, shippingOptionId)
    await initializePaymentSession(updatedCart, paymentProviderId)
    const order = await completeCart(cart.id)
    orderId = order.id
  } catch {
    checkoutError(
      "delivery",
      "We couldn't place your order. Review the delivery and payment details, then try again.",
    )
  }

  revalidatePath("/", "layout")
  redirect(`/order-confirmation/${orderId}`)
}
