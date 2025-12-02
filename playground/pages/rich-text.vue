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
            <BlockRenderer v-if="text.content" :content="text.content" :baseUrl="config.strapi.url" />
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

.text-abstract {
    font-style: italic;
    color: #666;
    background: #f5f5f5;
    border-left: 4px solid #bdbdbd;
    padding: 1rem 1.5rem;
    margin: 2rem 0 2.5rem 0;
    border-radius: 0 8px 8px 0;
    font-size: 1.15rem;
    letter-spacing: 0.01em;
}

.custom-quote-block {
    font-family: Georgia, 'Times New Roman', Times, serif;
    font-size: 1.25rem;
    color: #444;
    background: #f9f9f9;
    border-left: 6px solid #1976d2;
    margin: 2.5rem 0 2.5rem 0;
    padding: 1.2rem 1.2rem 1.2rem 2.5rem;
    border-radius: 0 12px 12px 0;
    quotes: "\201C" "\201D" "\2018" "\2019";
    position: relative;
}

.custom-quote-block:before {
    content: open-quote;
    color: #1976d2;
    font-size: 2.5rem;
    line-height: 0.1em;
    margin-right: 0.25em;
    vertical-align: -0.4em;
}

.custom-quote-block:after {
    content: close-quote;
    color: #1976d2;
    font-size: 2.5rem;
    line-height: 0.1em;
    margin-left: 0.25em;
    vertical-align: -0.4em;
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