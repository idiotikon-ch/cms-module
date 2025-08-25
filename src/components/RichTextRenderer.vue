<template>
    <div>
        <template v-for="(group, groupIdx) in groupedBlocks" :key="groupIdx">
            <!-- Render a flex row for a group of image-tile-reference blocks -->
            <div v-if="group[0].__component && group[0].__component.includes('image-tile-reference')"
                class="image-tile-row">
                <ImageTileLoader v-for="(block, i) in group" :key="i" :block="block" :size="block.size || 'default'" />
            </div>
            <!-- Render other blocks as usual -->
            <template v-else>
                <template v-for="(block, i) in group" :key="i">
                    <template v-if="block.__component && block.__component.includes('rich-text')">
                        <div v-if="block.content && Array.isArray(block.content)">
                            <template v-for="(sub, j) in block.content" :key="'rt-' + j">
                                <p v-if="sub.type === 'paragraph'">
                                    <template v-for="(child, k) in sub.children" :key="k">
                                        {{ child.text }}
                                    </template>
                                </p>
                                <h2 v-else-if="sub.type === 'heading'">
                                    <template v-for="(child, k) in sub.children" :key="k">
                                        {{ child.text }}
                                    </template>
                                </h2>
                                <!-- Add more block types as needed -->
                            </template>
                        </div>
                        <div v-else-if="typeof block.content === 'string'">
                            <!-- Fallback: render as HTML if string -->
                            <div v-html="block.content" />
                        </div>
                        <div v-else-if="typeof block.body === 'string'">
                            <!-- Fallback: render as HTML if .body string -->
                            <div v-html="block.body" />
                        </div>
                    </template>
                    <!-- Add more block/component types as needed -->
                </template>
            </template>
        </template>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import ImageTileLoader from './ImageTileLoader.vue'

const props = defineProps({
    content: {
        type: Array,
        required: true
    }
})
import { computed } from 'vue'

// Group consecutive image-tile-reference blocks into a row
function groupBlocks(blocks) {
    const groups = []
    let current = []
    let lastType = null
    for (const block of blocks) {
        const isTile = block.__component && block.__component.includes('image-tile-reference')
        if (isTile) {
            if (lastType !== 'tile' && current.length) {
                groups.push(current)
                current = []
            }
            current.push(block)
            lastType = 'tile'
        } else {
            if (lastType === 'tile' && current.length) {
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
</style>

// Local subcomponent for loading a tile by slug/id and rendering ImageTile
const ImageTileLoader = {
props: {
block: {
type: Object,
required: true
}
},
setup(props: any) {
const tile = ref(null)
const tileRef = computed(() => Array.isArray(props.block.tile) ? props.block.tile[0] : props.block.tile)
const slug = computed(() => tileRef.value?.slug || tileRef.value?.id)
const fetch = () => {
if (slug.value) fetchTile(slug.value, tile)
}
onMounted(fetch)
watch(slug, fetch)
return { tile }
},
components: { ImageTile },
