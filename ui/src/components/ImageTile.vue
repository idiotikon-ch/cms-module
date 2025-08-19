<template>
    <v-card @click="dialog = true" class="flex w-100 sidebar">
        <v-card-title class="text-h5 text-wrap">
            <vue-markdown :source="thumb.title || ''" :options="{ html: true }" />
        </v-card-title>
        <v-img :src="`${cmsImagesUrl}${thumb.picture.url}`" cover></v-img>
    </v-card>
    <idiCmsImageViewer :wordStory="wordstory" :images="[thumb]" v-model="dialog"></idiCmsImageViewer>
</template>

<script setup lang="ts">
import { mdiMagnifyExpand } from '@mdi/js';
import VueMarkdown from 'vue-markdown-render';

const props = defineProps({
    thumb: {
        type: Object,
        required: true
    },
    wordstory: {
        type: Boolean,
        default: false
    }
})
const dialog = ref(false)
const cmsImagesUrl = useRuntimeConfig().public.strapi.url
</script>

<style scoped>
.sidebar {
    width: 100%;
    max-width: 400px;
}
</style>
