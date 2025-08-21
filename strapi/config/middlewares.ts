export default ({ env }) => [
  "strapi::logger",
  "strapi::errors",
  "strapi::security",
  // Configure CORS to allow requests from the UI (dev at localhost:3000)
  {
    name: "strapi::cors",
    config: {
      enabled: true,
      origin: [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        // allow Nuxt preview/hot-reload port if used
        "http://localhost:24678",
      ],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
    },
  },
  "strapi::poweredBy",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
]
