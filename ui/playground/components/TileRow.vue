<template>
  <v-row>
    <v-col cols="12" sm="6" md="4" class="flex d-flex">
      <div v-if="tile">
        <idiCmsGeneralTile :tile="tile"></idiCmsGeneralTile>
      </div>
      <div v-else>
        Tile 1 not found.
      </div>
    </v-col>
    <v-col cols="12" sm="6" md="4" class="flex d-flex">
      <div v-if="tile2">
        <idiCmsGeneralTile :tile="tile2"></idiCmsGeneralTile>
      </div>
      <div v-else>
        Tile 2 not found.
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import { fetchTile, fetchTileBySlug } from '../utils/tileFetchers';

const { find } = useStrapi()

const md = new MarkdownIt()

const tile = ref();
const tile2 = ref();

fetchTile("another-tile", tile);
fetchTile("test-tile-1", tile2);


</script>
