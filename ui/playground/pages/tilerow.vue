<script setup lang="ts">

import CurtainTile from '../../src/components/CurtainTile.vue';
import { fetchTile } from '../../src/tileFetchers';
import { ref, onMounted } from 'vue';

const tile = ref();
const tile2 = ref();
const tile3 = ref();

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

onMounted(async () => {
    await fetchTile("another-tile", tile);
    await fetchTile("test-tile-1", tile2);
    await fetchTile("statische-karten", tile3);
    tile.value = absolutizeTileImage(tile.value);
    tile2.value = absolutizeTileImage(tile2.value);
    tile3.value = absolutizeTileImage(tile3.value);
});

</script>

<template>
    <v-row justify="center">
        <v-col cols="12" sm="6" md="4" class="flex" v-if="tile">
            <CurtainTile :tile="tile" class="tile-card-fixed" />
        </v-col>
        <v-col cols="12" sm="6" md="4" class="flex" v-if="tile2">
            <CurtainTile :tile="tile2" class="tile-card-fixed" />
        </v-col>
        <v-col cols="12" sm="6" md="4" class="flex" v-if="tile3">
            <CurtainTile :tile="tile3" class="tile-card-fixed" />
        </v-col>
    </v-row>
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
