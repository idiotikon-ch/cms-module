<template>
    <ImageTile v-if="tile" :tile="tile" :size="size" :caption="tile.title || caption || ''" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import ImageTile from './ImageTile.vue'
import { fetchTile } from '../tileFetchers'

const props = defineProps<{ block: any, size?: string, baseUrl: string, caption?: string }>()
const tile = ref(null)
const tileRef = computed(() => Array.isArray(props.block.tile) ? props.block.tile[0] : props.block.tile)
const slug = computed(() => tileRef.value?.slug || tileRef.value?.id)

function absolutizeTileImage(t: any) {
    if (!t) return t;
    // handle main image
    if (t.picture && t.picture.url && !t.picture.url.startsWith('http')) {
        t.picture.url = props.baseUrl.replace(/\/$/, '') + t.picture.url;
    }
    // handle formats if present
    if (t.picture && t.picture.formats) {
        for (const key in t.picture.formats) {
            const f = t.picture.formats[key];
            if (f.url && !f.url.startsWith('http')) {
                f.url = props.baseUrl.replace(/\/$/, '') + f.url;
            }
        }
    }
    return t;
}

const fetch = async () => {
    if (slug.value) {
        await fetchTile(slug.value, tile)
        if (tile.value) {
            tile.value = absolutizeTileImage(tile.value)
        }
    }
}
onMounted(fetch)
watch(slug, fetch)
</script>
