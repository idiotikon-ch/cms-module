<template>
    <v-card v-if="!teaserOnly" class="white-border-tile" border>
        <v-btn v-if="detailView" :to="`/mitteilungen`" class="mb-10">Zurück zur Übersicht</v-btn>
        <v-card-title :style="{ whiteSpace: 'normal' }" :class="detailView ? `text-h3` : `text-h5`">
            <NuxtLink v-if="url" :to="url" :style="{ textDecoration: 'None' }">
                {{ title }}</NuxtLink>
            <span v-else>{{ title }}</span>
        </v-card-title>
        <v-card-subtitle>
            {{ date }}
        </v-card-subtitle>
        <v-row>
            <v-col v-if="content" cols="12" sm="6" md="8">
                <v-card-text>
                    <BlockRenderer :content="content" :baseUrl="cmsImagesUrl" />
                </v-card-text>
            </v-col>
            <v-col v-if="picture" cols="12" sm="6" md="4">
                <v-img :src="`${cmsImagesUrl}${picture.url}`" cover></v-img>
            </v-col>
        </v-row>
    </v-card>

    <v-card v-if="teaserOnly" variant="elevated" class="white-border-tile teaser" border @click="navigateTo(url)">
        <v-card-title :style="{ whiteSpace: 'normal' }" :class="detailView ? `text-h3` : `text-h5`">
            {{ title }}
        </v-card-title>
        <v-card-subtitle>
            {{ date }}
        </v-card-subtitle>
        <v-img v-if="picture" :src="`${cmsImagesUrl}${picture.url}`" cover></v-img>
        <v-card-text v-if="content">
            <BlockRenderer :content="teaserContent" :baseUrl="cmsImagesUrl" />
        </v-card-text>
        <div v-if="url" class="d-flex read-more">
            <NuxtLink :to="url">Weiterlesen</NuxtLink>
        </div>
    </v-card>
</template>

<script lang="ts" setup>
import BlockRenderer from './BlockRenderer.vue'
import { useRuntimeConfig, computed } from '#imports'

const runtimeConfig = useRuntimeConfig()
const cmsImagesUrl: string = runtimeConfig.public.strapi.url

const props = defineProps({
    title: String,
    date: String,
    picture: Object,
    content: {
        type: Array,
        required: true
    },
    url: String,
    teaserOnly: {
        type: Boolean,
        default: false
    },
    detailView: {
        type: Boolean,
        default: false
    }
})

const teaserContent = computed(() => {
    if (!props.content) return []
    const markdownBlock = props.content.find(block => block.__component === 'shared.markdown-text')
    if (markdownBlock && markdownBlock.body) {
        const text = markdownBlock.body
        const truncatedBody = text.length > 180 ? text.substring(0, 177) + '...' : text
        return [{ ...markdownBlock, body: truncatedBody }]
    }
    return []
})
</script>
