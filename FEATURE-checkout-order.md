# Checkout-to-order

**Status:** verified

## Scoped as

Connect the checkout placeholder to Medusa so a guest can save contact and address details, choose eligible shipping and payment options, place an order, and view a real order confirmation.

## Tried

- Traced the Medusa 2.18 store routes and SDK sequence for cart updates, shipping options, payment collections, payment sessions, cart completion, and guest order retrieval.
- Confirmed the existing seed enables the manual fulfillment and system payment providers.

## Current approach

Use two progressively enhanced server-action forms. The address step updates the cart before delivery options are requested. The delivery step attaches shipping, initializes the selected payment provider, completes the cart, clears the cart cookie, and records the completed order ID in a short-lived HTTP-only cookie for the confirmation route.

## Verified

- The Medusa HTTP integration suite seeds a temporary database and completes a guest order from a stocked product.
- The browser flow saved a guest address, loaded delivery and payment options, completed an order, cleared the cart, and rendered the €30 confirmation.
- Refreshing the confirmation URL retained access through the short-lived order cookie.
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, and the root production build pass.
