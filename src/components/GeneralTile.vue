<template>

  <v-card v-if="tile.link_target_type == 'image'" class="sidebar tile-card">
    <v-card-title class="text-h5 text-wrap">
      <MarkdownRenderer :content="tile.title || ''" />
    </v-card-title>
    <v-img :src="imageUrl" cover class="tile-image"></v-img>
    <v-card-text v-if="tile.content" class="text-wrap tile-body">
      <MarkdownRenderer :content="tile.content || ''" />
    </v-card-text>
  </v-card>
  <v-card v-else :hover="false" class="sidebar tile-card" @click="navigateTo(`${tile.link}`, {
    external: tile.link_target_type == '_blank', open: {
      target: tile.link_target_type
    }
  })" style="--v-hover-overlay-color: var(--v-theme-cardHover)">
    <v-card-title class="text-h5 text-wrap">
      <MarkdownRenderer :content="tile.title || ''" />
    </v-card-title>
    <v-img :src="imageUrl" cover class="tile-image"></v-img>
    <v-card-text v-if="tile.content" class="text-wrap tile-body">
      <MarkdownRenderer :content="tile.content || ''" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>

import MarkdownRenderer from '../components/MarkdownRenderer.vue'

const props = defineProps({
  tile: {
    type: Object,
    required: true,
  },
})

// Extract the absolute image URL from the tile (no construction)
const imageUrl = computed(() => {
  const pic = Array.isArray(props.tile.picture) ? props.tile.picture[0] : props.tile.picture;
  return pic?.url || '';
})
</script>

<style scoped></style>
