<template>
    <div :class="['image-tile-root', size]">
        <v-hover v-slot="{ isHovering, props }">
            <v-card v-bind="props" @click="dialog = true" class="w-100 tile-card" style="position: relative;">
                <v-img :src="imageUrl" cover class="tile-image tile-image--fill" />
                <v-btn v-show="isHovering" color="black" variant="flat"
                    :style="{ zIndex: 1000, bottom: '10%', right: '10%', opacity: 0.6, position: 'absolute' }"
                    :icon="mdiMagnifyExpand"></v-btn>
            </v-card>
        </v-hover>
        <idiCmsImageViewer :compactLegend="compactLegend" :images="images" v-model="dialog"></idiCmsImageViewer>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, unref } from 'vue'
import { useTile } from '../composables/useTile'
import idiCmsImageViewer from './ImageViewer.vue'
import { mdiMagnifyExpand } from '@mdi/js'

const props = defineProps({
    tile: {
        type: Object,
        required: true,
    },
    compactLegend: {
        type: Boolean,
        default: false,
    },
    size: {
        type: String,
        default: 'w100',
        validator: (val: string) => ['w100', 'w50', 'w30', 'w25', 'w20'].includes(val)
    }
})

const dialog = ref(false)

// use the shared composable which already handles refs or plain objects
const { imageUrl } = useTile(props.tile)

// ensure ImageViewer receives a plain, non-reactive array of image objects
const images = computed(() => {
    const t = unref(props.tile)
    return t ? [JSON.parse(JSON.stringify(t))] : []
})
</script>

<style scoped>
.image-tile-root {
    display: flex;
    flex-direction: column;
}

/* Rely on global tiles.css for .tile-image so flex/min-height rules apply consistently */

.image-tile-root.w100 {
    width: 100%;
}

.image-tile-root.w50 {
    width: 50%;
}

.image-tile-root.w30 {
    width: 30%;
}

.image-tile-root.w25 {
    width: 25%;
}

.image-tile-root.w20 {
    width: 20%;
}
</style>
