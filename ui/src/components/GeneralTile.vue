<template>

  <v-card v-if="tile.link_target_type == 'image'" class="sidebar">
    <v-card-title class="text-h5 text-wrap">
      <vue-markdown :source="tile.title" :options="{ html: true }" />
    </v-card-title>
    <!-- <ImageTile :thumb="tile"></ImageTile> -->
    <v-card-text v-if="tile.content" class="text-wrap">
      <vue-markdown :source="tile.content" :options="{ html: true }" />
    </v-card-text>
  </v-card>
  <v-card v-else :hover="false" class="sidebar" @click="navigateTo(`${tile.link}`, {
    external: tile.link_target_type == '_blank', open: {
      target: tile.link_target_type
    }
  })" style="--v-hover-overlay-color: var(--v-theme-cardHover)">
    <v-card-title class="text-h5 text-wrap"><vue-markdown :source="tile.title" :options="{ html: true }" />
    </v-card-title>
    <v-img :src="`${cms_images_url}${tile.picture.url}`" cover></v-img>
    <v-card-text v-if="tile.content" class="text-wrap">
      <vue-markdown :source="tile.content" :options="{ html: true }" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
const { tile } = defineProps(['tile'])

import VueMarkdown from 'vue-markdown-render'

const runtimeConfig = useRuntimeConfig()
const cms_images_url = runtimeConfig.public.strapi.url

</script>
