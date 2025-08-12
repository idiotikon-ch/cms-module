export default defineNuxtConfig({
  modules: ["../src/module", "@nuxtjs/strapi"],
  strapi: {},

  idiCmsModule: {},
  devtools: { enabled: true },
})
