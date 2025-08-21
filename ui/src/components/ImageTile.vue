<template>
    <v-card @click="dialog = true" class="sidebar tile-card">
        <v-img :src="imageUrl" cover class="tile-image" />
    </v-card>
    <idiCmsImageViewer :wordStory="wordstory" :images="[tile]" v-model="dialog"></idiCmsImageViewer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTile } from '../composables/useTile'

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
const { imageUrl } = useTile(props.tile)
</script>

<style scoped>
@import '../styles/tiles.css';
</style>
