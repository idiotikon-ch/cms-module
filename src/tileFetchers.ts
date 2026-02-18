import type { ApiTileTile } from "../../../strapi/types/generated/contentTypes"
import { useStrapi } from "#imports"

// Rename ApiTileTile to Tile for clarity
export type Tile = ApiTileTile

/**
 * Fetch a tile by its slug using the Strapi `find` method.
 * @param slug - The slug of the tile to fetch.
 * @param target - A ref to store the fetched tile.
 */
export const fetchTile = async (slug: string, target: any) => {
  const { find } = useStrapi()

  try {
    const response = await find<Tile>("tiles", {
      filters: { slug: slug },
      populate: ["picture"],
    })
    target.value = response.data[0]
  } catch (error) {
    console.error(`Error fetching tile by slug ${slug}:`, error)
    target.value = null
  }
}
