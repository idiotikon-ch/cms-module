<script setup lang="ts">
import TileRow from '~/components/TileRow.vue';
import { fetchTile } from '../utils/tileFetchers';
import { ref } from 'vue';
import { IdiCmsCurtainTile } from '#components';

const tile = ref();
const tile2 = ref();
const tile3 = ref();

fetchTile("klein-u-gross", tile);
fetchTile("ksds-k", tile2);
fetchTile("karten", tile3);
</script>


<template>
    <v-container class="text-center">
        <v-row>
            <v-col cols="12">
                <img src="https://kleinersprachatlas.ch/images/home/pfuetze_home.png" alt="Header Image"
                    style="width: 100%; height: auto; object-fit: cover; margin-bottom: 2rem;" />
            </v-col>
        </v-row>
        <v-row>
            <v-col v-if="tile">
                <IdiCmsCurtainTile :tile="tile" />
            </v-col>
            <v-col v-if="tile2">
                <IdiCmsCurtainTile :tile="tile2" />
            </v-col>
            <v-col v-if="tile3">
                <IdiCmsCurtainTile :tile="tile3" />
            </v-col>
        </v-row>
    </v-container>
</template>


<style scoped>
h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

p {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
}
</style>
