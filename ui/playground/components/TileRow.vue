<template>
  <v-row>
    <v-col v-for="(tile, index) in tiles" :key="index" cols="12" sm="6" md="4" class="flex d-flex">
      <div v-if="tile" class="d-flex w-100">
        <idiCmsGeneralTile :tile="tile" />
      </div>
      <div v-else>
        General: Tile {{ index + 1 }} not found.
      </div>
    </v-col>
    <v-col v-for="(tile, index) in tiles" :key="`curtain-${index}`" cols="12" sm="6" md="4" class="flex d-flex">
      <div v-if="tile" class="d-flex w-100">
        <idiCmsCurtainTile :tile="tile" />
      </div>
      <div v-else>
        Curtain: Tile {{ index + 1 }} not found.
      </div>
    </v-col>
    <v-col v-for="(tile, index) in tiles" :key="`image-${index}`" cols="12" sm="6" md="4" class="flex d-flex">
      <div v-if="tile" class="d-flex w-100">
        <idiCmsImageTile :tile="tile" />
      </div>
      <div v-else>
        Image: Tile {{ index + 1 }} not found.
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const props = defineProps({
  tiles: {
    type: Array,
    required: true,
  },
});
</script>
