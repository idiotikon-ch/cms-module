import { resolve } from "node:path"
import {
  defineNuxtModule,
  addPlugin,
  installModule,
  createResolver,
  addComponentsDir,
} from "@nuxt/kit"

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "idi-cms-module",
    configKey: "idiCmsModule",
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  async setup(moduleOptions, nuxt) {
    const resolver = createResolver(import.meta.url)
    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addComponentsDir({
      path: resolver.resolve("./components"),
      prefix: "idiCms",
    })
    addPlugin(resolver.resolve("./runtime/plugin"))
    await installModule("@nuxtjs/device", { append: true })
  },
})
