<template>
    <v-card @click="dialog = true" class="flex w-100 sidebar tile-card">
        <v-img :src="`${cmsImagesUrl}${thumb.picture.url}`" cover class="tile-image"></v-img>
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
    display: flex;
    flex-direction: column;
}

.tile-card {
    width: 100%;
    max-width: 400px;
    min-width: 300px;
}

.tile-image {
    flex-grow: 1;
    width: 100%;
    height: auto;
}
</style>
