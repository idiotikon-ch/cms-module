<template>
    <div v-if="block && block.file">
        <img v-if="isImage" :src="fullBestUrl" :srcset="fullSrcset" :alt="block.file.alternativeText || ''"
            class="media-image" />
        <video v-else-if="isVideo" controls :src="block.file.url" class="media-video"></video>
        <a v-else :href="block.file.url" target="_blank" rel="noopener" class="media-file">
            Download file
        </a>
        <div v-if="block.file.caption" class="media-caption">{{ block.file.caption }}</div>
    </div>
    <div v-else>
        <em>No media data</em>
    </div>
</template>

<script setup lang="ts">

import { computed } from 'vue'
const props = defineProps<{ block: any }>()
import { useRuntimeConfig } from '#imports'
const cmsImagesUrl = useRuntimeConfig().public.strapi.url;

const isImage = computed(() => props.block?.file?.mime?.startsWith('image/'))
const isVideo = computed(() => props.block?.file?.mime?.startsWith('video/'))

function withBase(url: string) {
    if (!url) return ''
    if (url.startsWith('http')) return url
    return cmsImagesUrl.replace(/\/$/, '') + url
}

// Pick the best available image format (large > medium > small > thumbnail > original)
const bestUrl = computed(() => {
    const formats = props.block?.file?.formats || {}
    return (
        formats.large?.url ||
        formats.medium?.url ||
        formats.small?.url ||
        formats.thumbnail?.url ||
        props.block?.file?.url || ''
    )
})

const fullBestUrl = computed(() => withBase(bestUrl.value))

// Build a srcset for responsive images
const srcset = computed(() => {
    const formats = props.block?.file?.formats || {}
    const set = []
    if (formats.thumbnail?.url) set.push(`${withBase(formats.thumbnail.url)} 234w`)
    if (formats.small?.url) set.push(`${withBase(formats.small.url)} 500w`)
    if (formats.medium?.url) set.push(`${withBase(formats.medium.url)} 750w`)
    if (formats.large?.url) set.push(`${withBase(formats.large.url)} 1000w`)
    if (props.block?.file?.url) set.push(`${withBase(props.block.file.url)} ${props.block.file.width || ''}w`)
    return set.join(', ')
})
const fullSrcset = srcset
</script>

<style scoped>
.media-image {
    max-width: 100%;
    height: auto;
    display: block;
}

.media-video {
    max-width: 100%;
    display: block;
}

.media-caption {
    font-size: 0.9em;
    color: #666;
    margin-top: 0.25em;
}

.media-file {
    color: #1976d2;
    text-decoration: underline;
}
</style>
