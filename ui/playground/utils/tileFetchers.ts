/**
 * Generic fetch-by-slug for any Strapi content type with a slug field.
 * @template T
 * @param contentType - The Strapi content type (e.g. "tiles", "texts").
 * @param slug - The slug to look up.
 * @param target - A ref to store the fetched document.
 * @param populate - Optional array of relations to populate.
 */
/**
 * Generic fetch-by-slug for any Strapi content type with a slug field.
 * Supports both string[] and object for nested populate.
 * @template T
 * @param contentType - The Strapi content type (e.g. "tiles", "texts").
 * @param slug - The slug to look up.
 * @param target - A ref to store the fetched document.
 * @param populate - Optional array of relations to populate, or an object for nested populate.
 */
export const fetchDocument = async <T = any>(
  contentType: string,
  slug: string,
  target: any,
  populate: string[] | Record<string, any> = []
) => {
  const { find } = useStrapi()
  try {
    const response = await find<T>(contentType, {
      filters: { slug },
      populate,
    })
    target.value = response.data?.[0] || null
  } catch (error) {
    console.error(`Error fetching ${contentType} by slug ${slug}:`, error)
    target.value = null
  }
}
import type { ApiTileTile } from "../../../strapi/types/generated/contentTypes"

// Rename ApiTileTile to Tile for clarity
export type Tile = ApiTileTile

/**
 * Fetch a tile by its slug using the Strapi API.
 * @param slug - The slug of the tile to fetch.
 * @param target - A ref to store the fetched tile.
 */
export const fetchTileBySlug = async (slug: string, target: any) => {
  try {
    const response = await fetch(`http://localhost:1337/api/tile/${slug}`)
    if (!response.ok) throw new Error("Network response was not ok")
    const data = await response.json()
    target.value = data
  } catch (error) {
    console.error(`Error fetching tile by slug ${slug}:`, error)
    target.value = null
  }
}

/**
 * Fetch a tile by its ID using the Strapi `find` method.
 * @param id - The ID of the tile to fetch.
 * @param target - A ref to store the fetched tile.
 */
export const fetchTile = async (id: string, target: any) => {
  const { find } = useStrapi()

  try {
    const response = await find<Tile>("tiles", {
      filters: { slug: id },
      populate: ["picture"],
    })
    target.value = response.data[0]
  } catch (error) {
    console.error(`Error fetching tile ${id}:`, error)
    target.value = null
  }
  console.log(`Fetched tile ${id}:`, target.value)
}
