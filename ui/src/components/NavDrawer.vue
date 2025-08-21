<template>
    <v-navigation-drawer width="310" :temporary="mdAndDown" :scrim="mdAndDown" :style="{ padding: 0 }"
        :model-value="open" @update:model-value="onToggle">
        <v-list class="pa-0">
            <NavItems v-for="item in items" :key="item.rank || item.title" :item="item" @select="onSelect" />
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
});
const emit = defineEmits(['toggle', 'select']);

const mdAndDown = toRef(useDisplay(), 'mdAndDown');

function onToggle(val: boolean) {
    emit('toggle', val);
}

function onSelect(payload: any) {
    emit('select', payload);
}
</script>
