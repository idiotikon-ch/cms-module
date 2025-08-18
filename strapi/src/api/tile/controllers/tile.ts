import { factories } from "@strapi/strapi"

export default factories.createCoreController(
  "api::tile.tile",
  ({ strapi }) => ({
    // Custom action: customFindBySlug
    async customFindBySlug(ctx) {
      try {
        const { slug } = ctx.params

        // Query the database for the tile with the given slug
        const result = await strapi.db.query("api::tile.tile").findOne({
          where: { slug },
        })

        if (!result) {
          return ctx.notFound("Tile not found")
        }

        ctx.body = result
      } catch (err) {
        ctx.badRequest("An error occurred", { error: err })
      }
    },
  })
)
