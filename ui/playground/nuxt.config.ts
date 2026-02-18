export default defineNuxtConfig({
  modules: ["../src/module", "nuxt-strapi-blocks-renderer"],
  strapi: {},
  ssr: false,
  idiCmsModule: {},
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      strapi: {
        url: "http://localhost:1338",
      },
      appBase: "http://localhost:3000",
    },
  },
  css: ["assets/global.scss"],
})
