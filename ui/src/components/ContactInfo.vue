<template>
    <div class="contact-info">
        <div v-if="address" class="contact-row">
            <fa :icon="['fas', 'map-marker-alt']" class="icon" />
            <span class="contact-text" v-html="formatMultiline(address)"></span>
        </div>
        <div v-if="email" class="contact-row">
            <fa :icon="['fas', 'envelope']" class="icon" />
            <a :href="`mailto:${email}`" class="contact-text">{{ email }}</a>
        </div>
        <div v-if="phone" class="contact-row">
            <fa :icon="['fas', 'phone']" class="icon" />
            <span class="contact-text" v-html="formatMultiline(phone)"></span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
// Make sure FontAwesome is globally registered in your app
const props = defineProps<{
    address?: string,
    email?: string,
    phone?: string
}>()

function escapeHtml(str: string) {
    return str.replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\'': '&#39;', '"': '&quot;' }[c] || c));
}

function formatMultiline(str?: string) {
    if (!str) return '';
    // Replace both literal '\n' and real newlines
    return escapeHtml(str).replace(/\\n|\n/g, '<br>');
}
</script>

<style scoped>
.contact-info {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
}

.contact-row {
    display: flex;
    align-items: flex-start;
    gap: 0.5em;
}
</style>
