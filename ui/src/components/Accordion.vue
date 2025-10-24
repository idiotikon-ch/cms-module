<template>
    <div class="accordion-root" :aria-label="ariaLabel" :role="'region'">
        <v-expansion-panels v-model="panel" variant="accordion" multiple :style="{ width }" class="accordion-panels">
            <v-expansion-panel v-for="(item, i) in content" :id="'q' + (i + 1).toString()" :key="i" ref="hashRefs"
                :class="item.customClass" :aria-expanded="panel.includes(i)" :aria-controls="'panel-content-' + i"
                @group:selected="onPanelChange(i, $event)">
                <v-expansion-panel-title class="idcms_accordion" color="primary">
                    <v-icon v-if="item.icon" class="mr-2">{{ item.icon }}</v-icon>
                    <span>{{ item.title }}</span>
                    <span v-if="item.subtitle" class="subtitle">{{ item.subtitle }}</span>
                </v-expansion-panel-title>
                <v-expansion-panel-text :id="'panel-content-' + i">
                    <BlockRenderer v-if="item.content" :content="item.content" />
                    <slot v-else :name="`panel-${i}`" :item="item" />
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
</template>


<script setup lang="ts">
import MarkdownRenderer from '../components/MarkdownRenderer.vue'
import BlockRenderer from './BlockRenderer.vue'
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from '#imports'
const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const cms_images_url = runtimeConfig.public.strapi.url

interface AccordionPanel {
    title: string
    text?: string
    pictures?: Array<any>
    open?: boolean
    icon?: string
    subtitle?: string
    customClass?: string
}

const props = defineProps<{
    content: AccordionPanel[],
    width?: string,
    backgroundImage?: string,
    ariaLabel?: string,
    panelTitleBgImage?: string,
    panelTitleBgColor?: string
}>()

const width = computed(() => props.width || '1000px')
const backgroundImage = computed(() => props.backgroundImage)
const ariaLabel = computed(() => props.ariaLabel || 'Accordion')
const panelTitleBgImage = computed(() => props.panelTitleBgImage)
const panelTitleBgColor = computed(() => props.panelTitleBgColor || 'var(--v-theme-primary)')

// By default, all panels are collapsed unless 'open' is set to true for a panel
const openInitial: Array<number> = []
for (const [key, value] of Object.entries(props.content)) {
    if (value.open) {
        openInitial.push(parseInt(key))
    }
}
// If no panels are set to open, start with an empty array (all collapsed)
const panel = ref(openInitial.length ? openInitial : [])
const hashRefs = ref([])

onMounted(async function () {
    if (route.hash) {
        await new Promise(resolve => setTimeout(resolve, 100));
        window.scrollBy(0, -134)
    }
})

watch(
    () => route.hash,
    (newHash, oldHash) => { panel.value = getIndex(newHash) }
)

function getIndex(hash: string) {
    if (hash) {
        return parseInt(hash.slice(2)) - 1
    }
    else { return openInitial }
}

function onPanelChange(idx: number, event: any) {
    // Emits open/close events for parent
    if (event.value) {
        emit('open', idx)
    } else {
        emit('close', idx)
    }
}

const emit = defineEmits(['open', 'close'])
</script>

<style scoped>
.accordion-root {
    position: relative;
    width: 100%;
    padding: 0;
}

.accordion-panels {
    background: transparent;
}

.v-expansion-panel:not(:first-child) {
    margin-top: 10px;
}

.v-expansion-panel {
    background: transparent;
    /* fallback for panels over background image */
}

.v-expansion-panel-text {
    background: #fff;
}

.v-expansion-panel-title {
    font-size: 1.1rem;
    font-weight: bold;
    color: white !important;
    position: relative;
}

.v-expansion-panel-title__overlay {
    opacity: 0.5;
    /* covers the title bar for a semi-transparent overlay */
}

.v-expansion-panel-title .subtitle {
    font-size: 0.9rem;
    font-weight: normal;
    margin-left: 1em;
    color: #ccc;
}
</style>
