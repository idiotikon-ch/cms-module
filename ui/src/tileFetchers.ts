import type { ApiTileTile } from "../../../strapi/types/generated/contentTypes"
import { useStrapi } from "#imports"

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
  // console.log(`Fetched tile ${id}:`, target.value)
}
