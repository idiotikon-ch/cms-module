export async function findBySlug({
  strapi,
  slug,
  collectionType,
  populate = true,
}) {
  console.log(
    `findBySlug called with slug: ${slug}, collectionType: ${collectionType}`
  )
  try {
    const result = await strapi.db
      .query(`api::${collectionType}.${collectionType}`)
      .findOne({
        where: { slug },
        populate,
      })

    if (!result) {
      console.error(`No entry found for slug: ${slug}`)
      throw new Error(`No entry found for slug: ${slug}`)
    }

    console.log("Result from database query:", result)
    return result
  } catch (error) {
    console.error("Error in findBySlug:", error.message)
    throw new Error(`Error fetching slug: ${error.message}`)
  }
}
