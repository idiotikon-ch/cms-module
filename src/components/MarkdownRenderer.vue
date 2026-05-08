<template>
    <div v-html="compiled"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import markdownItFootnote from 'markdown-it-footnote'
import markdownItAttrs from 'markdown-it-attrs'
import markdownItContainer from 'markdown-it-container'

const props = defineProps<{ content: string }>()

const md = new MarkdownIt({ html: true })
md.use(markdownItFootnote)
md.use(markdownItAttrs)
md.use(markdownItContainer, 'details', {
    validate: function (params) {
        return params.trim().match(/^details\s+(.*)$/)
    },
    render: function (tokens, idx) {
        const m = tokens[idx].info.trim().match(/^details\s+(.*)$/)
        if (tokens[idx].nesting === 1) {
            // opening tag
            return '<details><summary>' + md.utils.escapeHtml(m[1]) + '</summary>'
        } else {
            // closing tag
            return '</details>'
        }
    },
})
const compiled = computed(() => md.render(props.content || ''))
</script>
