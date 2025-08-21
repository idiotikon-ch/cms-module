<template>
    <v-row>
        <v-col :key="tile" cols="12" sm="6" md="4" class="flex d-flex">
            <div v-if="tile"
                :class="['tile-wrapper', { 'tile-wrapper--no-stretch': tile.link_target_type !== 'image' }, 'd-flex', 'w-100']">
                <idiCmsCurtainTile :tile="tile" />
            </div>
        </v-col>
        <v-col :key="tile2" cols="12" sm="6" md="4" class="flex d-flex">
            <div v-if="tile2"
                :class="['tile-wrapper', { 'tile-wrapper--no-stretch': tile2.link_target_type !== 'image' }, 'd-flex', 'w-100']">
                <idiCmsCurtainTile :tile="tile2" />
            </div>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">

const { isDesktop } = useDevice();
import { fetchTile } from '../utils/tileFetchers';
import { ref } from 'vue';

const tile = ref();
const tile2 = ref();

fetchTile("statische-karten", tile);
fetchTile("test-tile-1", tile2);
// const tiles = ref([tile, tile2]);

</script>