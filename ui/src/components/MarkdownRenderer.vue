<template>
    <div v-html="compiled"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'

const props = defineProps<{ content: string }>()

const md = new MarkdownIt()
const compiled = computed(() => md.render(props.content || ''))
</script>
