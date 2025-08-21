<template>
    <div>
        <p>Is Desktop: {{ isDesktop }}</p>
    </div>
    <div v-if="tile"
        :class="['tile-wrapper', { 'tile-wrapper--no-stretch': tile.link_target_type !== 'image' }, 'd-flex', 'w-100']">
        <idiCmsCurtainTile :tile="tile" />
    </div>
    <div v-else>
        Curtain: Tile {{ index + 1 }} not found.
    </div>

</template>

<script setup lang="ts">

const { isDesktop } = useDevice();
import { fetchTile } from '../utils/tileFetchers';
import { ref } from 'vue';

const tile = ref();
// const tile2 = ref();

fetchTile("statische-karten", tile);
// fetchTile("test-tile-1", tile2);
const tiles = ref([tile]);

</script>