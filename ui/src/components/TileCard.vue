<template>
    <v-card class="tile-card" @click="onClick">
        <slot />
    </v-card>
</template>

<script setup lang="ts">
const props = defineProps({
    tile: {
        type: Object,
        required: false,
    },
    onClick: {
        type: Function,
        required: false,
    }
})

function onClick(e: Event) {
    if (typeof props.onClick === 'function') props.onClick(e)
}
</script>

<style scoped>
@import '../styles/tiles.css';
</style>
