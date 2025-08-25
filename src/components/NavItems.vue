<template>
    <v-list-group v-if="item.children && item.children.length" :value="false" :data-testid="item.title">
        <template #activator="{ props }">
            <v-list-item v-bind="props" :title="item.title" @click.stop.prevent="onSelect">
                <template #prepend>
                    <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
                </template>
            </v-list-item>
        </template>

        <NavItems v-for="subItem in item.children" :key="subItem.rank || subItem.title" :item="subItem"
            :parentLink="fullLink" @select="forwardSelect" />
    </v-list-group>

    <v-list-item v-else :data-testid="item.title" :key="item.rank || item.title" :title="item.title"
        @click.stop.prevent="onSelect">
        <template #prepend>
            <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
        </template>
    </v-list-item>
</template>

<script setup lang="ts">
import { toRefs, computed } from 'vue';

const props = defineProps({
    item: { type: Object, required: true },
    parentLink: { type: String, default: '' },
});
const emit = defineEmits(['select']);
const { item, parentLink } = toRefs(props);

// compute full link from parent + provided link (if present)
// support either a string path or a route-location object
const fullLink = computed(() => {
    const link = item.value.link ?? item.value.path ?? '';
    if (!link) return `${parentLink.value || ''}`.replace(/\/\/+/g, '/');
    if (typeof link === 'string') {
        return `${parentLink.value || ''}/${link}`.replace(/\/\/+/g, '/');
    }
    // assume route-location-like object (e.g. { name: 'index' }) and return it directly
    return link;
});

function onSelect() {
    emit('select', { item: item.value, link: fullLink.value });
}

function forwardSelect(payload: any) {
    // forward child selection up the chain
    emit('select', payload);
}
</script>

<style scoped>
.v-list-group__items .v-list-item {
    padding-inline-start: 72px !important;
    background-color: #e4e4e452;
}

.v-list-group__items .v-list-group__items .v-list-item {
    padding-inline-start: 85px !important;
    background-color: #e4e4e4f6;
}

.v-list-item.active_nav_item {
    background-color: #cdcdcd;
}
</style>
