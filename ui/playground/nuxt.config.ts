export default defineNuxtConfig({
  modules: ["../src/module"],
  strapi: {},
  ssr: false,
  idiCmsModule: {},
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      appBase: "http://localhost:3000",
    },
  },
})
