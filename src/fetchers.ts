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
  populate: {} | Record<string, any> = {}
) => {
  const { find } = useStrapi()
  try {
    const response = await find<T>(contentType, {
      filters: { slug },
      populate,
    })
    // console.log("Success:", response.data[0])
    target.value = response.data?.[0] || null
  } catch (error) {
    console.error(`Error fetching ${contentType} by slug ${slug}:`, error)
    target.value = null
  }
}
