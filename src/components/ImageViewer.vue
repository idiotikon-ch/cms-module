<template>
    <v-dialog @click="imgClick" content-class="custom-dialog d-flex" v-model="model" opacity="0.85">
        <v-carousel class="flex" height="100%" hide-delimiters :show-arrows="images.length > 1" v-model="carouselIndex">
            <v-carousel-item v-for="(img, index) in images" :key="index">
                <v-img :maxHeight="displayHeight" contain :src="`${cmsImagesUrl}${img.picture.url}`" :style="{
                    marginTop: `${displayHeight / 2 - imgHeight / 2}px`,
                }"></v-img>
                <v-btn v-if="handlers" variant="outlined" color="white" @click.stop="model = false" :icon="mdiClose"
                    class="close-btn"></v-btn>
                <v-sheet v-if="img.title" class="title-sheet" v-show="handlers">
                    <div class="title-text" v-html="img.title" />
                </v-sheet>
                <v-sheet v-if="handlers && (img.legend || img.content)" class="legend-sheet" :style="{
                    minHeight: compactLegend ? '' : '180px',
                }">
                    <div class="legend-text" v-html="img.legend || img.content" />
                </v-sheet>
            </v-carousel-item>
            <template v-slot:prev="{ props }">
                <v-btn v-if="handlers" variant="outlined" color="white" @click.stop="props.onClick"
                    :icon="mdiChevronLeft"></v-btn>
            </template>
            <template v-slot:next="{ props }">
                <v-btn v-if="handlers" variant="outlined" color="white" @click.stop="props.onClick"
                    :icon="mdiChevronRight"></v-btn>
            </template>
        </v-carousel>
    </v-dialog>
</template>

<script setup lang="ts">
import { mdiChevronLeft, mdiChevronRight, mdiClose } from '@mdi/js';
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';

/**
 * Props:
 * - images: Array of image objects with `url`, `title`, and `legend`.
 * - index: Starting index for the carousel.
 * - modelValue: Controls the visibility of the modal (v-model).
 * - compactLegend: Toggles compact layout for the legend.
 *
 * Emits:
 * - update:modelValue: Notifies parent when modal visibility changes.
 */
const props = defineProps({
    images: {
        type: Array,
        required: true,
    },
    index: {
        type: Number,
        default: 0,
    },
    modelValue: {
        type: Boolean,
        required: true,
    },
    compactLegend: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['update:modelValue']);
const model = computed({
    get: () => props.modelValue,
    set: (v) => emit('update:modelValue', v),
});
const handlers = ref(true);
const { index } = toRefs(props);
const cmsImagesUrl = useRuntimeConfig().public.strapi.url;
const displayHeight = ref(window.innerHeight);
const carouselIndex = ref(0);

watch(index, (ind) => {
    carouselIndex.value = ind;
});

onMounted(() => {
    window.addEventListener('keydown', keyDown);
    window.addEventListener('resize', updateDisplayHeight);
});

onUnmounted(() => {
    window.removeEventListener('keydown', keyDown);
    window.removeEventListener('resize', updateDisplayHeight);
});

function updateDisplayHeight() {
    displayHeight.value = window.innerHeight;
}

function keyDown(e) {
    if (model.value) {
        if (e.key === 'ArrowRight') {
            right();
        }
        if (e.key === 'ArrowLeft') {
            left();
        }
    }
}

function left() {
    carouselIndex.value--;
    if (carouselIndex.value < 0) carouselIndex.value = props.images.length - 1;
}

function right() {
    carouselIndex.value++;
    if (carouselIndex.value >= props.images.length) {
        carouselIndex.value = 0;
    }
}

function imgClick() {
    if (props.images[carouselIndex.value]) {
        handlers.value = !handlers.value;
    }
}
</script>

<style scoped>
.close-btn {
    position: fixed;
    top: 12px;
    right: 12px;
    z-index: 1000;
}

.title-sheet {
    position: fixed;
    top: 24px;
    left: 20%;
    right: 20%;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 1rem;
}

.title-text {
    color: white;
    text-align: center;
    font-size: 18px;
}

.legend-sheet {
    position: fixed;
    bottom: 24px;
    left: 10%;
    right: 10%;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 1rem;
}

.legend-text {
    color: white;
    text-align: center;
}
</style>
