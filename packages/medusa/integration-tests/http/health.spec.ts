import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import seedDemoData from "../../src/scripts/seed"

jest.setTimeout(60 * 1000)

medusaIntegrationTestRunner({
  inApp: true,
  env: {},
  testSuite: ({ api, getContainer }) => {
    let storeHeaders: Record<string, string>

    beforeAll(async () => {
      await seedDemoData({ container: getContainer(), args: [] })

      const query = getContainer().resolve(ContainerRegistrationKeys.QUERY)
      const { data } = await query.graph({
        entity: "api_key",
        fields: ["token"],
        filters: { type: "publishable" },
      })

      storeHeaders = { "x-publishable-api-key": data[0].token }
    })

    describe("Ping", () => {
      it("ping the server health endpoint", async () => {
        const response = await api.get("/health")
        expect(response.status).toEqual(200)
      })
    })

    describe("Guest checkout", () => {
      it("creates an order from a stocked product", async () => {
        const regionsResponse = await api.get("/store/regions?limit=1", {
          headers: storeHeaders,
        })
        const region = regionsResponse.data.regions[0]

        const productsResponse = await api.get(
          `/store/products?limit=1&region_id=${region.id}`,
          { headers: storeHeaders },
        )
        const variant = productsResponse.data.products[0].variants[0]

        const cartResponse = await api.post(
          "/store/carts",
          { region_id: region.id },
          { headers: storeHeaders },
        )
        const cartId = cartResponse.data.cart.id

        await api.post(
          `/store/carts/${cartId}/line-items`,
          { variant_id: variant.id, quantity: 1 },
          { headers: storeHeaders },
        )

        const address = {
          first_name: "Test",
          last_name: "Customer",
          address_1: "1 Harbour Street",
          city: "Copenhagen",
          postal_code: "1058",
          country_code: "dk",
        }
        await api.post(
          `/store/carts/${cartId}`,
          {
            email: "customer@example.com",
            shipping_address: address,
            billing_address: address,
          },
          { headers: storeHeaders },
        )

        const shippingResponse = await api.get(
          `/store/shipping-options?cart_id=${cartId}`,
          { headers: storeHeaders },
        )
        const shippingOption = shippingResponse.data.shipping_options[0]
        expect(shippingOption).toBeTruthy()

        const shippedCartResponse = await api.post(
          `/store/carts/${cartId}/shipping-methods`,
          { option_id: shippingOption.id },
          { headers: storeHeaders },
        )

        const providersResponse = await api.get(
          `/store/payment-providers?region_id=${region.id}`,
          { headers: storeHeaders },
        )
        const provider = providersResponse.data.payment_providers[0]
        expect(provider).toBeTruthy()

        const collectionResponse = await api.post(
          "/store/payment-collections",
          { cart_id: shippedCartResponse.data.cart.id },
          { headers: storeHeaders },
        )
        await api.post(
          `/store/payment-collections/${collectionResponse.data.payment_collection.id}/payment-sessions`,
          { provider_id: provider.id },
          { headers: storeHeaders },
        )

        const completionResponse = await api.post(
          `/store/carts/${cartId}/complete`,
          {},
          { headers: storeHeaders },
        )

        expect(completionResponse.data.type).toEqual("order")
        expect(completionResponse.data.order.email).toEqual(
          "customer@example.com",
        )
        expect(completionResponse.data.order.items).toHaveLength(1)
        expect(completionResponse.data.order.shipping_methods).toHaveLength(1)
      })
    })

    describe("Page publishing", () => {
      it("exposes published pages by slug and keeps drafts private", async () => {
        const pageService = getContainer().resolve("page")
        const suffix = Date.now().toString()
        const draft = await pageService.createPages({
          title: "Draft page",
          slug: `draft-${suffix}`,
          pageType: "STANDARD",
          status: "DRAFT",
          pageData: { content: [], root: {} },
        })
        const published = await pageService.createPages({
          title: "Published page",
          slug: `published-${suffix}`,
          pageType: "STANDARD",
          status: "PUBLISHED",
          publishedAt: new Date(),
          pageData: {
            content: [
              {
                type: "EditorialText",
                props: { id: "intro", heading: "Published content", body: "Visible" },
              },
            ],
            root: {},
          },
        })

        const listResponse = await api.get("/store/pages", {
          headers: storeHeaders,
        })
        expect(listResponse.data.pages.map((page: { id: string }) => page.id)).toContain(
          published.id,
        )
        expect(listResponse.data.pages.map((page: { id: string }) => page.id)).not.toContain(
          draft.id,
        )

        const detailResponse = await api.get(`/store/pages/${published.slug}`, {
          headers: storeHeaders,
        })
        expect(detailResponse.status).toEqual(200)
        expect(detailResponse.data.page.pageData.content[0].props.heading).toEqual(
          "Published content",
        )

        await expect(
          api.get(`/store/pages/${draft.slug}`, { headers: storeHeaders }),
        ).rejects.toMatchObject({ response: { status: 404 } })
      })
    })

    describe("Page media", () => {
      it("stores and serves a public builder image", async () => {
        const fileService = getContainer().resolve(Modules.FILE)
        const file = await fileService.createFiles({
          filename: `builder-test-${Date.now()}.gif`,
          mimeType: "image/gif",
          content: "R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
          access: "public",
        })

        try {
          expect(file.url).toBeTruthy()
          const pageService = getContainer().resolve("page")
          const asset = await pageService.createPageAssets({
            fileId: file.id,
            url: file.url,
            filename: "builder-test.gif",
            mimeType: "image/gif",
            size: 35,
          })
          const [libraryFiles] = await pageService.listAndCountPageAssets(
            {},
            { take: 60, order: { created_at: "DESC" } },
          )
          expect(libraryFiles.map((item: { id: string }) => item.id)).toContain(asset.id)

          const response = await api.get(new URL(file.url).pathname, {
            responseType: "arraybuffer",
          })
          expect(response.status).toEqual(200)
          expect(response.data.byteLength).toBeGreaterThan(0)
        } finally {
          await fileService.deleteFiles(file.id)
        }
      })
    })

    describe("Admin page security", () => {
      it("requires an authenticated admin for page and media management", async () => {
        await expect(api.get("/admin/pages")).rejects.toMatchObject({
          response: { status: 401 },
        })
        await expect(api.get("/admin/page-media")).rejects.toMatchObject({
          response: { status: 401 },
        })
      })
    })
  },
})
