<script setup lang="ts">

import TileRow from '~/components/TileRow.vue';
import { fetchTile } from '../../src/tileFetchers';
import { ref, computed } from 'vue';

const tile = ref();
const tile2 = ref();

const cmsImagesUrl = useRuntimeConfig().public.strapi.url;

function absolutizeTileImage(t) {
    if (!t) return t;
    // handle main image
    if (t.picture && t.picture.url && !t.picture.url.startsWith('http')) {
        t.picture.url = cmsImagesUrl.replace(/\/$/, '') + t.picture.url;
    }
    // handle formats if present
    if (t.picture && t.picture.formats) {
        for (const key in t.picture.formats) {
            const f = t.picture.formats[key];
            if (f.url && !f.url.startsWith('http')) {
                f.url = cmsImagesUrl.replace(/\/$/, '') + f.url;
            }
        }
    }
    return t;
}

const absoluteTiles = computed(() => [absolutizeTileImage(tile.value), absolutizeTileImage(tile2.value)]);

fetchTile("another-tile", tile);
fetchTile("test-tile-1", tile2);
</script>

<template>
    <v-card class="focus general-content">
        <v-card-title class="text-h3 pl-0 text-wrap">Tiles</v-card-title>
        <v-container>
            <TileRow :tiles="absoluteTiles" />
        </v-container>
    </v-card>
</template>

<style scoped>
.nwb_link {
    color: #FFFFFF;
    font-size: 1.1rem;
    font-weight: bold;
    font-style: italic;
    text-decoration: none;
}
</style>
