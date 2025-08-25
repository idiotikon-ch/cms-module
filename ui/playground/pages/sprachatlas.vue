<template>
    <v-row>
        <v-col :key="text" cols="12">
            <div class="article-body">
                <h1 v-if="text && text.title">{{ text.title }}</h1>
                <idiCmsRichTextRenderer v-if="text && text.content" :content="text.content" />
            </div>
        </v-col>
    </v-row>

    <v-row>
        <v-col>
            <idiCmsAccordion :content="accordionPanels" panelTitleBgImage="/tabheader.png">
                <template #panel-0>
                    <v-img src="https://kleinersprachatlas.ch/images/allgemein/Inhaltsverzeichnis_KSDS.png" width="100%"
                        height="400px" cover />
                </template>
            </idiCmsAccordion>
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
fetchDocument("texts", "sprachatlas", text, { content: { populate: "*" } });

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