/**
 * tile router
 */

export default {
  routes: [
    {
      method: "GET",
      path: "/tile/:slug", // Custom route
      handler: "tile.customFindBySlug",
    },
  ],
}
