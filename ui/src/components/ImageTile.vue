<template>
    <v-card @click="dialog = true" class="sidebar tile-card">
        <v-img :src="imageUrl" cover class="tile-image" />
    </v-card>
    <idiCmsImageViewer :wordStory="wordstory" :images="[tile]" v-model="dialog"></idiCmsImageViewer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
    tile: {
        type: Object,
        required: true,
    },
    wordstory: {
        type: Boolean,
        default: false,
    },
})

const dialog = ref(false)
const runtime = useRuntimeConfig()
const base = runtime.public.strapi.url || ''

const imageUrl = computed(() => {
    const p = props.tile?.picture
    if (!p) return ''
    return base + (p.url || p.formats?.thumbnail?.url || '')
})
</script>

<style scoped>
.sidebar {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.tile-card {
    width: 100%;
    min-height: 220px;
    /* ensure tiles without text don't collapse */
}

.tile-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
