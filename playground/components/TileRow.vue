<template>
  <v-row>
    <v-col v-for="(tile, index) in tiles" :key="index" cols="12" sm="6" md="4" class="flex d-flex">
      <div v-if="tile"
        :class="['tile-wrapper', { 'tile-wrapper--no-stretch': tile.link_target_type !== 'image' }, 'd-flex', 'w-100']">
        <idiCmsGeneralTile :tile="tile" />
      </div>
      <div v-else>
        General: Tile {{ index + 1 }} not found.
      </div>
    </v-col>
    <v-col v-for="(tile, index) in tiles" :key="`curtain-${index}`" cols="12" sm="6" md="4" class="flex d-flex">
      <div v-if="tile"
        :class="['tile-wrapper', { 'tile-wrapper--no-stretch': tile.link_target_type !== 'image' }, 'd-flex', 'w-100']">
        <idiCmsCurtainTile :tile="tile" />
      </div>
      <div v-else>
        Curtain: Tile {{ index + 1 }} not found.
      </div>
    </v-col>
    <v-col v-for="(tile, index) in tiles" :key="`image-${index}`" cols="12" sm="6" md="4" class="flex d-flex">
      <div v-if="tile"
        :class="['tile-wrapper', { 'tile-wrapper--no-stretch': tile.link_target_type !== 'image' }, 'd-flex', 'w-100']">
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

<style scoped>
.tile-wrapper {
  display: flex;
  flex-direction: column;
  /* ensure the wrapper stretches to the full height of the column */
  flex: 1 1 0;
}

/* ensure v-card inside tile-wrapper stretches to fill available space
   but do NOT force stretch when the wrapper opted out via --no-stretch */
.tile-wrapper:not(.tile-wrapper--no-stretch) .tile-card {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
}

/* opt-out: do not force equal height for certain tile types (e.g. GeneralTile) */
.tile-wrapper--no-stretch {
  flex: 0 0 auto;
}

/* ensure no-stretch wrappers keep natural card sizing */
.tile-wrapper--no-stretch .tile-card {
  display: block;
  flex: 0 0 auto;
}
</style>
