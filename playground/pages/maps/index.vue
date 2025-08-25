<template>
    <v-row>
        <v-col :key="text" cols="12">
            <div class="article-body">
                <h1 v-if="text && text.title">{{ text.title }}</h1>
                <idiCmsRichTextRenderer v-if="text && text.content" :content="text.content" />
                <div v-if="text" class="article-actions mt-4">
                    <idiCmsShareBtn :url="url" :title="text.title" :excerpt="text.excerpt" />
                </div>
            </div>
        </v-col>

        <v-col :key="tile">
            <div v-if="tile"
                :class="['tile-wrapper', { 'tile-wrapper--no-stretch': tile.link_target_type !== 'image' }, 'd-flex', 'w-100']">
                <idiCmsCurtainTile :tile="tile" />
            </div>
        </v-col>
        <v-col :key="tile2">
            <div v-if="tile2"
                :class="['tile-wrapper', { 'tile-wrapper--no-stretch': tile2.link_target_type !== 'image' }, 'd-flex', 'w-100']">
                <idiCmsCurtainTile :tile="tile2" />
            </div>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
const { isDesktop } = useDisplay();
import { IdiCmsRichTextRenderer } from '#components';
import { fetchTile, fetchDocument } from '../../utils/tileFetchers';

import { ref } from 'vue';

const tile = ref();
const tile2 = ref();
const text = ref();
fetchTile("statische-karten", tile);
fetchDocument("tiles", "interaktiv", tile2, ["picture"]);
fetchDocument("texts", "karten", text, { content: { populate: "*" } });


const route = useRoute()
const config = useRuntimeConfig().public
console.log(config.appBase)
console.log(route.fullPath)
const url = computed(() => config.appBase + route.fullPath)

</script>