export default defineNuxtConfig({
  modules: ["../src/module", "@nuxtjs/strapi"],
  strapi: {},
  ssr: false,
  idiCmsModule: {},
  devtools: { enabled: true },
})
