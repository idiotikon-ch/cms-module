<template>
    <div>
        <template v-for="(block, i) in content" :key="i">
            <!-- Strapi dynamic zone: rich text block -->
            <template v-if="block.__component && block.__component.includes('rich-text')">
                <div v-if="block.content && Array.isArray(block.content)">
                    <!-- Nested blocks (array) -->
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

            <!-- Strapi dynamic zone: image tile reference block -->
            <template v-else-if="block.__component && block.__component.includes('image-tile-reference')">
                <ImageTileLoader :block="block" :size="block.size || 'default'" />
            </template>

            <!-- Fallback: render nothing or add more block types as needed -->
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
</script>

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
