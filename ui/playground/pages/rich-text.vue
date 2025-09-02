<template>
    <v-card v-if="text" class="focus general-content">
        <v-container class="text-page text-content-container" fluid>
            <h1 class="text-title">{{ text.title }}</h1>
            <div v-if="text.author || text.category" class="text-meta d-flex align-center mb-2" style="gap: 1.5rem;">
                <span v-if="text.author" class="text-author">
                    By
                    <template v-if="Array.isArray(text.author)">
                        <span v-for="(a, idx) in text.author" :key="a.id || idx">
                            {{ a.name || a }}<span v-if="idx < text.author.length - 1">, </span>
                        </span>
                    </template>
                    <template v-else>
                        {{ text.author?.name || text.author }}
                    </template>
                </span>
                <span v-if="text.category" class="text-category">
                    <template v-if="Array.isArray(text.category)">
                        <v-chip v-for="(cat, idx) in text.category" :key="cat.id || idx" color="primary" variant="tonal"
                            size="small">
                            {{ cat.name || cat }}
                        </v-chip>
                    </template>
                    <template v-else>
                        <v-chip color="primary" variant="tonal"
                            size="small">{{ text.category?.name || text.category }}</v-chip>
                    </template>
                </span>
            </div>
            <div v-if="text.abstract" class="text-abstract">
                {{ text.abstract }}
            </div>
            <div v-if="text.cover" class="text-cover">
                <img :src="fullCoverUrl" :alt="text.title" class="text-cover-img" />
            </div>
            <BlockRenderer v-if="text.content" :content="text.content" />
        </v-container>
    </v-card>
</template>


<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useRuntimeConfig } from '#imports';
import type { BlockNode } from '#strapi-blocks-renderer/types';
import MarkdownRenderer from '../../src/components/MarkdownRenderer.vue';
import BlockRenderer from '../../src/components/BlockRenderer.vue';
const { find } = useStrapi();

const route = useRoute();
const config = useRuntimeConfig().public;
const url = computed(() => config.appBase + route.fullPath);


const response = await find("texts", {
    filters: { slug: "example-text" },
    populate: {
        content: {
            on: {
                'shared.media': { populate: { file: true } },
                'shared.rich-text': { populate: '*' },
                'shared.markdown-text': { populate: '*' },
                'shared.image-tile-reference': { populate: '*' },
                'shared.slider': { populate: '*' },
                'shared.quote': { populate: '*' },
                'shared.seo': { populate: '*' },
                'shared.accordion': {
                    populate: {
                        panels: {
                            populate: {
                                content: {
                                    on: {
                                        'shared.media': { populate: { file: true } },
                                        'shared.rich-text': { populate: '*' },
                                        'shared.markdown-text': { populate: '*' },
                                        'shared.image-tile-reference': { populate: '*' },
                                        'shared.slider': { populate: '*' },
                                        'shared.quote': { populate: '*' },
                                        'shared.seo': { populate: '*' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        author: true,
        category: true,
        cover: true
    }
})


const text = response.data[0]
console.log('text', text)
console.log('author', text?.author)
console.log('category', text?.category)

const fullCoverUrl = computed(() => {
    if (!text.cover?.url) return ''
    const base = useRuntimeConfig().public.strapi.url
    return text.cover.url.startsWith('http') ? text.cover.url : base.replace(/\/$/, '') + text.cover.url
})



</script>

<style scoped>
.text-content-container {
    max-width: 1100px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 0;
    padding-right: 0;
}

.text-cover {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
}

.text-cover-img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    object-fit: contain;
    display: block;
}
</style>