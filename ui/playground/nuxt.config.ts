export default defineNuxtConfig({
  modules: ["../src/module", "@nuxtjs/strapi", "@nuxtjs/device"],
  strapi: {},
  ssr: false,
  idiCmsModule: {},
  devtools: { enabled: true },
})
