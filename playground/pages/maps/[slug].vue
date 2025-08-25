<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useRuntimeConfig } from '#imports';
import { fetchDocument } from '../../utils/tileFetchers';

const route = useRoute();
const config = useRuntimeConfig().public;
const url = computed(() => config.appBase + route.fullPath);

const map = ref(null);
const loading = ref(false);
const error = ref(null);

const slug = computed(() => route.params.slug);

async function fetchMap() {
    fetchDocument("maps", slug.value, map, { content: { populate: "*" } });

}

onMounted(fetchMap);
</script>

<template>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else-if="map">
        <h1>{{ map.title }}</h1>
        <idiCmsRichTextRenderer v-if="map && map.content" :content="map.content" />

    </div>
    <div v-else>
        Map not found.
    </div>
</template>