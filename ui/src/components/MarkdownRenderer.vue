<template>
    <div v-html="compiled"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import markdownItFootnote from 'markdown-it-footnote'

const props = defineProps<{ content: string }>()

const md = new MarkdownIt()
md.use(markdownItFootnote)
const compiled = computed(() => md.render(props.content || ''))
</script>
