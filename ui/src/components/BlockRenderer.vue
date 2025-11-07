<template>
    <div>
        <template v-for="(group, groupIdx) in groupedBlocks" :key="groupIdx">
            <!-- Render a flex row for a group of image-tile-reference blocks -->
            <div v-if="group[0].__component && group[0].__component.includes('image-tile-reference')"
                class="image-tile-row">
                <template v-for="(block, i) in group" :key="i">
                    <template v-if="Array.isArray(block.tile)">
                        <ImageTileLoader v-for="(tileRef, j) in block.tile" :key="j" :block="{ tile: tileRef }"
                            :size="block.size || 'default'" :baseUrl="baseUrl" :caption="tileRef.title || ''" />
                    </template>
                    <template v-else>
                        <ImageTileLoader :block="block" :size="block.size || 'default'" :baseUrl="baseUrl"
                            :caption="block.tile && block.tile.title ? block.tile.title : ''" />
                    </template>
                </template>
            </div>
            <Accordion v-else-if="group[0].__component && group[0].__component.includes('accordion')"
                :content="group[0].panels" />
            <!-- Render other blocks as usual -->
            <div v-else>
                <template v-for="(block, i) in group" :key="i">
                    <div v-if="block.__component && block.__component.includes('text')">
                        <StrapiBlocksText v-if="block.body && Array.isArray(block.body)"
                            :nodes="block.body as BlockNode[]" />
                        <MarkdownRenderer v-else :content="block.body" />
                    </div>
                    <!-- Render bare media blocks: show image, open ImageViewer on click, centered -->
                    <div v-else-if="block.__component && block.__component.includes('media') && block.file"
                        class="d-flex flex-column align-center mb-4">
                        <v-img :src="getMediaUrl(block)" :alt="block.file.caption || ''" class="mb-2"
                            style="width: 50%; max-width: 400px; min-width: 200px; height: auto; cursor: pointer;"
                            @click="openImageViewerGlobal(block)" />
                        <div v-if="block.file.caption" class="slider-caption text-center">{{ block.file.caption }}</div>
                    </div>
                    <!-- Render other image-tile-reference blocks (legacy, fallback) -->
                    <div v-else-if="block.__component && block.__component.includes('image-tile-reference')">
                        <template v-if="Array.isArray(block.tile)">
                            <ImageTileLoader v-for="(tileObj, idx) in block.tile" :key="tileObj.id || idx"
                                :block="{ tile: tileObj }" :size="block.size || 'default'" :baseUrl="baseUrl"
                                :caption="tileObj.title || ''" />
                        </template>
                        <template v-else>
                            <ImageTileLoader :block="{ tile: block.tile }" :size="block.size || 'default'"
                                :baseUrl="baseUrl" :caption="block.tile && block.tile.title ? block.tile.title : ''" />
                        </template>
                    </div>
                    <v-carousel
                        v-else-if="block.__component && block.__component.includes('slider') && block.files && block.files.length"
                        hide-delimiter-background height="360" class="article-slider mb-6">
                        <v-carousel-item v-for="(file, idx) in block.files" :key="file.id || idx"
                            style="position:relative;">
                            <img :src="getMediaUrl({ file })" :alt="file.alternativeText || file.caption || file.name"
                                class="slider-img" />
                            <div v-if="file.caption" class="slider-caption slider-caption--overlay">{{ file.caption }}
                            </div>
                        </v-carousel-item>
                    </v-carousel>
                    <div v-else-if="block.__component && block.__component.includes('quote')">
                        <blockquote class="custom-quote-block">{{ block.body }}</blockquote>
                        <div v-if="block.title" class="quote-author">— {{ block.title }}</div>
                    </div>
                    <!-- SEO block, usually not rendered visually -->
                    <div v-else-if="block.__component && block.__component.includes('seo')"></div>
                    <div v-else>Unknown: {{ block }}</div>
                </template>
            </div>
        </template>
        <!-- Single global ImageViewer dialog for all media blocks -->
        <ImageViewer v-if="showImageViewer" :compactLegend="true" :images="allMediaImages" v-model="showImageViewer"
            :index="imageViewerIndex" />
    </div>
</template>

<script setup lang="ts">

import ImageTileLoader from './ImageTileLoader.vue'
import MarkdownRenderer from './MarkdownRenderer.vue'
import Accordion from './Accordion.vue'
import ImageViewer from './ImageViewer.vue'
import { computed, ref } from 'vue'

const props = defineProps({
    content: {
        type: Array,
        required: true
    },
    baseUrl: {
        type: String,
        required: true
    }
})




// Group consecutive image-tile-reference blocks into a row
function groupBlocks(blocks: any[]) {
    const groups = []
    let current = []
    let lastType = null
    for (const block of blocks) {
        const isTile = block.__component && block.__component.includes('image-tile-reference')
        const isAccordion = block.__component && block.__component.includes('accordion')
        if (isTile) {
            if (lastType !== 'tile' && current.length) {
                groups.push(current)
                current = []
            }
            current.push(block)
            lastType = 'tile'
        } else if (isAccordion) {
            if (lastType !== 'accordion' && current.length) {
                groups.push(current)
                current = []
            }
            current.push(block)
            lastType = 'accordion'
        } else {
            if ((lastType === 'tile' || lastType === 'accordion') && current.length) {
                groups.push(current)
                current = []
            }
            current.push(block)
            lastType = 'other'
        }
    }
    if (current.length) groups.push(current)
    return groups
}

const groupedBlocks = computed(() => groupBlocks(props.content))

// State for ImageViewer dialog
const showImageViewer = ref(false)
const imageViewerImages = ref([])
const imageViewerIndex = ref(0)

function openImageViewer(blocks, idx) {
    // Accepts an array of media blocks (or single block)
    // For single-image modal, just set the index and open the dialog
    imageViewerIndex.value = idx || 0
    showImageViewer.value = true
}

// Helper to calculate correct media URL (like useTile)
function getMediaUrl(block: any) {
    const file = block?.file || {}
    const url = file.formats?.large?.url || file.formats?.medium?.url || file.url || file.formats?.thumbnail?.url || ''
    if (!url) return ''
    return url.startsWith('http') ? url : props.baseUrl.replace(/\/$/, '') + url
}

const allMediaBlocks = computed(() => {
    // Flatten all groups and filter for media blocks
    return props.content.filter(b => b.__component && b.__component.includes('media') && b.file)
})

const allMediaImages = computed(() =>
    allMediaBlocks.value.map(block => ({
        picture: { url: getMediaUrl(block) },
        title: block.file.caption || '',
        legend: null,
    }))
)

function openImageViewerGlobal(block) {
    // Find the index of the clicked block in allMediaBlocks
    const idx = allMediaBlocks.value.findIndex(b => b === block)
    if (idx !== -1) {
        imageViewerIndex.value = idx
        showImageViewer.value = true
    }
}

</script>

<style scoped>
.image-tile-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: flex-start;
}

.image-tile-root.w50 {
    width: calc(50% - 0.25rem);
}

.article-slider {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
}

.slider-img {
    width: 100%;
    height: 360px;
    object-fit: contain;
    border-radius: 8px;
    background: #f8f8f8;
    display: block;
}

.slider-caption {
    text-align: center;
    font-size: 1rem;
    color: #444;
    margin-top: 0.5rem;
}

.slider-caption--overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    padding: 0.5rem 1rem;
    font-size: 1.1rem;
    z-index: 2;
}
</style>
