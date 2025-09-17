// filepath: /home/florian/ling/idiotikon/cms-module/ui/plugins/vuetify.ts
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";
import "vuetify/styles";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: false,
    components,
    directives,
    theme: {
      themes: {
        light: {
          dark: false,
          colors: {
            primary: "#0004ffff",
            primaryLighten1: "#9799a1ff",
            secondary: "#ffffff",
          },
        },
      },
    },

    icons: {
      defaultSet: "mdi",
      aliases,
      sets: {
        mdi,
      },
    },
  });
  nuxtApp.vueApp.use(vuetify)
})