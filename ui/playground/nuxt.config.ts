export default defineNuxtConfig({
  modules: ["../src/module", "nuxt-strapi-blocks-renderer"],
  strapi: {},
  ssr: false,
  idiCmsModule: {},
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      appBase: "http://localhost:3000",
    },
  },
  css: ["assets/global.scss"],
})
