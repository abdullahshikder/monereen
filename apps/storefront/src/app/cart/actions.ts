"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {
  addCartLineItem,
  deleteCartLineItem,
  getCart,
  getOrCreateCart,
  updateCartLineItem,
} from "@/lib/commerce"

function requiredString(formData: FormData, key: string): string {
  const value = formData.get(key)
  if (typeof value !== "string" || !value) {
    throw new Error(`${key} is required`)
  }
  return value
}

function refreshCartViews() {
  revalidatePath("/", "layout")
  revalidatePath("/cart")
}

export async function addToCart(formData: FormData) {
  const variantId = requiredString(formData, "variantId")
  const cart = await getOrCreateCart()
  await addCartLineItem(cart.id, variantId, 1)
  refreshCartViews()
  redirect("/cart")
}

export async function updateCartItem(formData: FormData) {
  const lineItemId = requiredString(formData, "lineItemId")
  const quantity = Number(formData.get("quantity"))
  const cart = await getCart()

  if (!cart || !Number.isInteger(quantity)) {
    return
  }

  if (quantity < 1) {
    await deleteCartLineItem(cart.id, lineItemId)
  } else {
    await updateCartLineItem(cart.id, lineItemId, quantity)
  }

  refreshCartViews()
}

export async function removeCartItem(formData: FormData) {
  const lineItemId = requiredString(formData, "lineItemId")
  const cart = await getCart()

  if (!cart) {
    return
  }

  await deleteCartLineItem(cart.id, lineItemId)
  refreshCartViews()
}
