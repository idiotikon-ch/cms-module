<template>
    <v-overlay class="align-center justify-center" v-model="overlay">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="{ ...props, ...$attrs }" variant="plain" :icon="mdiShareVariant"></v-btn>
        </template>
        <v-card class="white-border-tile teaser"
            :style="{ maxWidth: `${width * 0.9}px`, minWidth: `${Math.min(width * 0.9, 400)}px` }">
            <v-card-title>
                <v-row no-gutters>
                    <v-col cols="11" class="text-wrap" align-self="center"><v-icon :icon="mdiLink" /> Permalink/URI
                        teilen</v-col>
                    <v-col cols="1">
                        <v-btn variant="plain" @click="overlay = false" :icon="mdiClose">
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <v-row no-gutters>
                    <v-col cols="11" class="text-wrap"><v-tooltip v-model="copiedTooltip" location="top"
                            :open-on-hover="false">
                            <template v-slot:activator="{ props }">
                                <v-text-field v-bind="props" readonly hide-details :value="url" class="mr-1"
                                    @focus="$event.target.select()"></v-text-field>
                            </template>
                            Link kopiert
                        </v-tooltip></v-col>
                    <v-col cols="1">
                        <v-btn variant="plain" :icon="mdiContentCopy"></v-btn></v-col>
                </v-row>
                <v-row no-gutters class="mt-4">
                    <v-col cols="12" class="text-center">
                        <v-btn variant="plain" :href="whatsappUrl" target="_blank">
                            <v-icon :icon="mdiWhatsapp" size="36"></v-icon>
                        </v-btn>
                        <v-btn variant="plain" :href="facebookUrl" target="_blank">
                            <v-icon :icon="mdiFacebook" size="36"></v-icon>
                        </v-btn>
                        <v-btn variant="plain" :href="twitterUrl" target="_blank">
                            <v-icon :icon="mdiTwitter" size="36"></v-icon>
                        </v-btn>
                        <v-btn variant="plain" :href="emailUrl" target="_blank">
                            <v-icon :icon="mdiEmail" size="36"></v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-overlay>
</template>

<script setup lang="ts">
import {
    mdiShareVariant,
    mdiContentCopy,
    mdiWhatsapp,
    mdiFacebook,
    mdiTwitter,
    mdiEmail,
    mdiClose,
    mdiLink,
} from "@mdi/js"

import { useDisplay } from 'vuetify'
const props = defineProps({
    url: { type: String, required: true },
    title: { type: String, default: '' },
    excerpt: { type: String, default: '' },
})
const emit = defineEmits(['copy', 'openShare'])

const overlay = ref(false)
const copiedTooltip = ref(false)
const { width } = useDisplay()

const encodedUrl = computed(() => encodeURIComponent(props.url))
const encodedTitle = computed(() => encodeURIComponent(props.title))
const encodedExcerpt = computed(() => encodeURIComponent(props.excerpt))

const whatsappUrl = computed(() => `https://wa.me/?text=${encodedTitle.value ? encodedTitle.value + '%20' : ''}${encodedUrl.value}`)
const facebookUrl = computed(() => `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl.value}`)
const twitterUrl = computed(() => `https://twitter.com/intent/tweet?url=${encodedUrl.value}${props.title ? `&text=${encodedTitle.value}` : ''}`)
const emailUrl = computed(() => `mailto:?subject=${encodedTitle.value}&body=${encodedExcerpt.value ? encodedExcerpt.value + '%0A%0A' : ''}${encodedUrl.value}`)

async function copyUrl() {
    await navigator.clipboard.writeText(props.url)
    copiedTooltip.value = true
    emit('copy', props.url)
    setTimeout(() => (copiedTooltip.value = false), 1000)
}

function openShare(network) {
    emit('openShare', network)
}


</script>
