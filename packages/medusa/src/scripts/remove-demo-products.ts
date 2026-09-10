import type { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { deleteProductsWorkflow } from "@medusajs/medusa/core-flows";

const demoProductTitles = new Set([
  "Medusa T-Shirt",
  "Medusa Sweatshirt",
  "Medusa Sweatpants",
  "Medusa Shorts",
]);

export default async function removeDemoProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const inventoryModuleService = container.resolve(Modules.INVENTORY);
  const productModuleService = container.resolve(Modules.PRODUCT);
  const products = await productModuleService.listProducts({});
  const demoProducts = products.filter((product) =>
    demoProductTitles.has(product.title),
  );

  if (!demoProducts.length) {
    logger.info("No Medusa demo products found.");
    return;
  }

  const productIds = demoProducts.map((product) => product.id);
  const { data: variants } = await query.graph({
    entity: "product_variant",
    fields: ["id", "product_id"],
    filters: { product_id: productIds },
  });
  const { data: inventoryLinks } = await query.graph({
    entity: "product_variant_inventory_item",
    fields: ["inventory_item_id", "variant_id"],
    filters: { variant_id: variants.map((variant) => variant.id) },
  });
  const inventoryItemIds = inventoryLinks.map(
    (inventoryLink) => inventoryLink.inventory_item_id,
  );
  const reservations = inventoryItemIds.length
    ? await inventoryModuleService.listReservationItems(
        { inventory_item_id: inventoryItemIds },
        { take: 1000 },
      )
    : [];

  if (reservations.length) {
    await inventoryModuleService.deleteReservationItems(
      reservations.map((reservation) => reservation.id),
    );
    logger.info(`Removed ${reservations.length} demo inventory reservations.`);
  }

  await deleteProductsWorkflow(container).run({
    input: { ids: productIds },
  });

  logger.info(
    `Removed ${demoProducts.length} demo products: ${demoProducts
      .map((product) => product.title)
      .join(", ")}`,
  );
}
