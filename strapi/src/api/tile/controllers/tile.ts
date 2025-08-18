import { factories } from "@strapi/strapi"
import { findBySlug } from "../../../utils/findBySlug"

export default factories.createCoreController(
  "api::tile.tile",
  ({ strapi }) => ({
    // Custom action: customFindBySlug
    async customFindBySlug(ctx) {
      try {
        const { slug } = ctx.params

        // Use the generalized findBySlug utility
        const result = await findBySlug({
          strapi,
          slug,
          collectionType: "tile",
        })

        ctx.body = result
      } catch (err) {
        ctx.badRequest("An error occurred", { error: err })
      }
    },
  })
)
