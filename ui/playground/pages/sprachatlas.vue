<template>
    <v-row>
        <v-col :key="text" cols="12" lg="9">
            <div class="article-body">
                <h1 v-if="text && text.title">{{ text.title }}</h1>
                <idiCmsRichTextRenderer v-if="text && text.content" :content="text.content" />
            </div>

            <div class="mt-5">
                <idiCmsAccordion :content="accordionPanels" panelTitleBgImage="/tabheader.png">
                    <template #panel-0>
                        <v-img src="https://kleinersprachatlas.ch/images/allgemein/Inhaltsverzeichnis_KSDS.png"
                            width="100%" height="400px" cover />
                    </template>
                </idiCmsAccordion>
            </div>
        </v-col>

        <v-col v-if="tile" cols="12" md="6" lg="3">
            <idiCmsImageTile :tile="tile" />
        </v-col>
    </v-row>

</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
const { isDesktop } = useDisplay();
import { IdiCmsRichTextRenderer } from '#components';
import { fetchTile, fetchDocument } from '../utils/tileFetchers';

import { ref } from 'vue';

const text = ref();
const tile = ref()

fetchDocument("texts", "sprachatlas", text, { content: { populate: "*" } });
fetchTile("ksds-cover", tile);

const accordionPanels = [
    {
        title: 'Inhaltsverzeichnis'
    },
    {
        title: 'Autorschaft',
        text: 'This panel uses the default markdown rendering.',
    },
    {
        title: 'Auszug',
        text: 'This panel uses the default markdown rendering.',
    },
    {
        title: 'Bezugsquelle',
        text: 'This panel uses the default markdown rendering.',
    }
]

const route = useRoute()
const config = useRuntimeConfig().public
const url = computed(() => config.appBase + route.fullPath)

</script>