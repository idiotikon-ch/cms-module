<template>
    <v-navigation-drawer width="310" :temporary="mdAndDown" :scrim="mdAndDown" :style="{ padding: 0 }"
        :model-value="open" :location="location" @update:model-value="onToggle">
        <v-list class="pa-0">
            <NavItems v-for="item in items" :key="item.rank || item.title" :item="item" :icon-map="iconMap" />
        </v-list>
    </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { toRef } from 'vue';
import { useDisplay } from 'vuetify';
import NavItems from './NavItems.vue';

const props = defineProps({
    items: { type: Array, default: () => [] },
    open: { type: Boolean, default: false },
    location: { type: String, default: 'left' },
    iconMap: { type: Object, default: () => ({}) },
});
const emit = defineEmits(['toggle']);

const mdAndDown = toRef(useDisplay(), 'mdAndDown');

function onToggle(val: boolean) {
    emit('toggle', val);
}
</script>
