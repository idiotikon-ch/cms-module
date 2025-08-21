<template>

  <v-card v-if="tile.link_target_type == 'image'" class="sidebar tile-card">
    <v-card-title class="text-h5 text-wrap">
      <vue-markdown :source="tile.title || ''" :options="{ html: true }" />
    </v-card-title>
    <v-img :src="imageUrl" cover class="tile-image"></v-img>
    <v-card-text v-if="tile.content" class="text-wrap">
      <vue-markdown :source="tile.content || ''" :options="{ html: true }" />
    </v-card-text>
  </v-card>
  <v-card v-else :hover="false" class="sidebar tile-card" @click="navigateTo(`${tile.link}`, {
    external: tile.link_target_type == '_blank', open: {
      target: tile.link_target_type
    }
  })" style="--v-hover-overlay-color: var(--v-theme-cardHover)">
    <v-card-title class="text-h5 text-wrap"><vue-markdown :source="tile.title || ''" :options="{ html: true }" />
    </v-card-title>
    <v-img :src="imageUrl" cover class="tile-image"></v-img>
    <v-card-text v-if="tile.content" class="text-wrap">
      <vue-markdown :source="tile.content || ''" :options="{ html: true }" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import VueMarkdown from 'vue-markdown-render'

const props = defineProps({
  tile: {
    type: Object,
    required: true,
  },
})

const runtimeConfig = useRuntimeConfig()
const base = runtimeConfig.public.strapi.url || ''

const imageUrl = computed(() => {
  const p = props.tile?.picture
  if (!p) return ''
  return base + (p.url || p.formats?.thumbnail?.url || '')
})
</script>

<style scoped>
.sidebar {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.tile-card {
  width: 100%;
  min-height: 220px;
}

.tile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
