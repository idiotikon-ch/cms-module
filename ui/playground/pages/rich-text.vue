<template>
    <v-card class="focus general-content">
        <v-container class="article-page article-content-container" fluid>
            <h1 class="article-title">{{ article.title }}</h1>
            <div v-if="article.author || article.category" class="article-meta d-flex align-center mb-2"
                style="gap: 1.5rem;">
                <span v-if="article.author" class="article-author">
                    By
                    <template v-if="Array.isArray(article.author)">
                        <span v-for="(a, idx) in article.author" :key="a.id || idx">
                            {{ a.name || a }}<span v-if="idx < article.author.length - 1">, </span>
                        </span>
                    </template>
                    <template v-else>
                        {{ article.author?.name || article.author }}
                    </template>
                </span>
                <span v-if="article.category" class="article-category">
                    <template v-if="Array.isArray(article.category)">
                        <v-chip v-for="(cat, idx) in article.category" :key="cat.id || idx" color="primary"
                            variant="tonal" size="small">
                            {{ cat.name || cat }}
                        </v-chip>
                    </template>
                    <template v-else>
                        <v-chip color="primary" variant="tonal"
                            size="small">{{ article.category?.name || article.category }}</v-chip>
                    </template>
                </span>
            </div>
            <div v-if="article.abstract" class="article-abstract">
                {{ article.abstract }}
            </div>
            <div v-if="article.cover" class="article-cover">
                <img :src="fullCoverUrl" :alt="article.title" class="article-cover-img" />
            </div>
            <BlockRenderer v-if="article.content" :content="article.content" />
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


const response = await find("articles", {
    filters: { slug: "test-article" },
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
                        article: {
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


const article = response.data[0]
console.log('article', article)
console.log('author', article?.author)
console.log('category', article?.category)

const fullCoverUrl = computed(() => {
    if (!article.cover?.url) return ''
    const base = useRuntimeConfig().public.strapi.url
    return article.cover.url.startsWith('http') ? article.cover.url : base.replace(/\/$/, '') + article.cover.url
})



</script>

<style scoped>
.article-content-container {
    max-width: 1100px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 0;
    padding-right: 0;
}

.article-cover {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
}

.article-cover-img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    object-fit: contain;
    display: block;
}
</style>