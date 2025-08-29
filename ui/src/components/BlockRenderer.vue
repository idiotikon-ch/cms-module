<template>
    <div>
        <template v-for="(group, groupIdx) in groupedBlocks" :key="groupIdx">
            <!-- Render a flex row for a group of image-tile-reference blocks -->
            <div v-if="group[0].__component && group[0].__component.includes('image-tile-reference')"
                class="image-tile-row">
                <ImageTileLoader v-for="(block, i) in group" :key="i" :block="block" :size="block.size || 'default'" />
            </div>
            <Accordion v-else-if="group[0].__component && group[0].__component.includes('accordion')" :content="group.map(b => ({
                ...b.article,
                title: b.title || b.article?.title
            }))" />
            <!-- Render other blocks as usual -->
            <div v-else>
                <template v-for="(block, i) in group" :key="i">
                    <div v-if="block.__component && block.__component.includes('text')">
                        <StrapiBlocksText v-if="block.body && Array.isArray(block.body)"
                            :nodes="block.body as BlockNode[]" />
                        <MarkdownRenderer v-else :content="block.body" />
                    </div>
                    <ImageTileLoader
                        v-else-if="block.__component && (block.__component.includes('media') || block.__component.includes('image-tile-reference'))"
                        :block="block" :size="block.size || 'default'" />
                    <v-carousel
                        v-else-if="block.__component && block.__component.includes('slider') && block.files && block.files.length"
                        hide-delimiter-background height="360" class="article-slider mb-6">
                        <v-carousel-item v-for="(file, idx) in block.files" :key="file.id || idx">
                            <img :src="file.formats?.large?.url || file.formats?.medium?.url || file.url"
                                :alt="file.alternativeText || file.caption || file.name" class="slider-img" />
                            <div v-if="file.caption" class="slider-caption">{{ file.caption }}</div>
                        </v-carousel-item>
                    </v-carousel>
                    <Accordion v-else-if="block.__component && block.__component.includes('accordion')"
                        :title="block.title" :content="block.article?.content" />
                    <div v-else-if="block.__component && block.__component.includes('quote')">
                        <blockquote>{{ block.text }}</blockquote>
                        <div v-if="block.author" class="quote-author">— {{ block.author }}</div>
                    </div>
                    <!-- SEO block, usually not rendered visually -->
                    <div v-else-if="block.__component && block.__component.includes('seo')"></div>
                    <div v-else>Unknown: {{ block }}</div>
                </template>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import ImageTileLoader from './ImageTileLoader.vue'
import MarkdownRenderer from './MarkdownRenderer.vue'
import MediaRenderer from './MediaRenderer.vue'
import Accordion from './Accordion.vue'
import type { BlockNode } from '#strapi-blocks-renderer/types';

const props = defineProps({
    content: {
        type: Array,
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
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
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
</style>
