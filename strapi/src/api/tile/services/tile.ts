/**
 * tile service
 */

import { factories } from "@strapi/strapi"

export default factories.createCoreService("api::tile.tile", ({ strapi }) => ({
  async findBySlug(slug, populate = true) {
    try {
      const result = await strapi.db.query("api::tile.tile").findOne({
        where: { slug },
        populate,
      })

      if (!result) {
        throw new Error(`No entry found for slug: ${slug}`)
      }

      return result
    } catch (error) {
      throw new Error(`Error fetching slug: ${error.message}`)
    }
  },
}))
