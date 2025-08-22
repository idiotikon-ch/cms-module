<script setup lang="ts">
import TileRow from '~/components/TileRow.vue';
import { fetchTile } from '../utils/tileFetchers';
import { ref } from 'vue';

const tile = ref();
const tile2 = ref();

fetchTile("another-tile", tile);
console.log(tile.value);
fetchTile("test-tile-1", tile2);
</script>

<template>
    <v-container>
        <TileRow :tiles="[tile, tile2]" />
    </v-container>
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
