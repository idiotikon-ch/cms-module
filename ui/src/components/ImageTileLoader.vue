<template>
    <ImageTile v-if="tile" :tile="tile" :size="size" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import ImageTile from './ImageTile.vue'
import { fetchTile } from '../tileFetchers'

const props = defineProps<{ block: any, size?: string }>()
const tile = ref(null)
const tileRef = computed(() => Array.isArray(props.block.tile) ? props.block.tile[0] : props.block.tile)
const slug = computed(() => tileRef.value?.slug || tileRef.value?.id)
const fetch = () => {
    if (slug.value) fetchTile(slug.value, tile)
}
onMounted(fetch)
watch(slug, fetch)
</script>
