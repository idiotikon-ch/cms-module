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

    <v-card @click="navigateTo(url)" variant="elevated" class="white-border-tile teaser" border>
        <v-card-title :style="{ whiteSpace: 'normal' }" class="text-h5">
            {{ title }}
        </v-card-title>
        <v-card-subtitle>
            {{ date }}
        </v-card-subtitle>
        <v-img v-if="picture" :src="`${cmsImagesUrl}${picture.url}`" cover></v-img>
        <v-card-text v-if="teaserText">
            {{ teaserText }}
        </v-card-text>
        <div v-if="url" class="d-flex read-more">
            <NuxtLink :to="url">{{ readMoreText }}</NuxtLink>
        </div>
        <template v-else>
            <v-card-title :style="{ whiteSpace: 'normal' }">
                {{ title }}
            </v-card-title>
            <v-card-subtitle>
                {{ date }}
            </v-card-subtitle>
            <v-img v-if="picture" :src="`${cmsImagesUrl}${picture.url}`" cover></v-img>
            <v-card-text v-if="teaserText">
                {{ teaserText }}
            </v-card-text>
        </template>
    </v-card>
</template>

<script lang="ts" setup>
import BlockRenderer from './BlockRenderer.vue'
import { computed } from 'vue'
import { getPlainTxtTeaser } from '../utils/markdown'
import { navigateTo } from '#imports'

const props = defineProps({
    title: String,
    date: String,
    picture: Object,
    content: {
        type: Array,
        required: true
    },
    url: String,
    baseUrl: {
        type: String,
        default: ''
    },
    teaserOnly: {
        type: Boolean,
        default: false
    },
    teaserLength: {
        type: Number,
        default: 180
    },
    detailView: {
        type: Boolean,
        default: false
    },
    readMoreText: {
        type: String,
        default: 'Weiterlesen'
    }
})

const cmsImagesUrl = computed(() => props.baseUrl)

const teaserText = computed(() => {
    if (!props.content) return ''
    const markdownBlock = props.content.find(block => block.__component === 'shared.markdown-text')
    if (markdownBlock && markdownBlock.body) {
        return getPlainTxtTeaser(markdownBlock.body, props.teaserLength)
    }
    return ''
})
</script>
