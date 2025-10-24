<template>
    <v-dialog @click="imgClick" content-class="custom-dialog d-flex" v-model="model" opacity="0.85">
        <v-carousel class="flex" height="100%" hide-delimiters :show-arrows="images.length > 1" v-model="carouselIndex">
            <v-carousel-item v-for="(img, index) in images" :key="index">
                <v-img :maxHeight="displayHeight" contain :src="img.src
                    ? img.src
                    : (img.picture && img.picture.url
                        ? img.picture.url
                        : '')" :alt="img.alt || img.title || ''"></v-img>
                <v-btn v-if="handlers" variant="outlined" color="white" @click.stop="model = false" :icon="mdiClose"
                    class="close-btn"></v-btn>
                <v-sheet v-if="img.title || img.alt" class="title-sheet" v-show="handlers">
                    <div class="title-text" v-html="img.title || img.alt" />
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
import { ref, watch, onMounted, onUnmounted, computed, toRefs } from 'vue';


/**
 * Props:
 * - images: Array of image objects with `url`, `title`, and `legend`.
 * - index: Starting index for the carousel.
 *
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

const emit = defineEmits(['update:modelValue', 'close']);
const model = computed({
    get: () => props.modelValue,
    set: (v) => emit('update:modelValue', v),
});
const handlers = ref(true);

// No longer needed: expect absolute URLs only
const displayHeight = ref(600); // safe default
onMounted(() => {
    displayHeight.value = window.innerHeight;
    window.addEventListener('keydown', keyDown);
    window.addEventListener('resize', updateDisplayHeight);
});

const { index } = toRefs(props);
const carouselIndex = ref(0);

// Set initial index from index prop when opened
watch(
    () => [props.modelValue, props.index],
    ([open, idx]) => {
        if (open && typeof idx === 'number') {
            carouselIndex.value = idx;
        }
    },
    { immediate: true }
);

// Keep carouselIndex in sync with index prop if it changes
watch(index, (ind) => {
    if (typeof ind === 'number') carouselIndex.value = ind;
});

// Emit close event with last viewed index when dialog closes
watch(model, (val, oldVal) => {
    if (oldVal && !val) {
        emit('close', carouselIndex.value);
    }
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
