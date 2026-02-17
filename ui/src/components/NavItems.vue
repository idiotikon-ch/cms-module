<template>
    <v-list-group v-if="item.sub_menus && item.sub_menus.length" :data-testid="item.title">
        <template #activator="{ props }">
            <v-list-item v-bind="props" :title="item.title">
                <template #prepend>
                    <v-icon v-if="item.icon">{{ iconMap[item.icon] || item.icon }}</v-icon>
                </template>
            </v-list-item>
        </template>

        <NavItems v-for="subItem in item.sub_menus" :key="subItem.rank || subItem.title" :item="subItem"
            :icon-map="iconMap" :parentLink="fullLink" />
    </v-list-group>

    <v-list-item v-else :data-testid="item.title" :key="item.rank || item.title" :title="item.title" :to="fullLink"
        active-class="active_nav_item">
        <template #prepend>
            <v-icon v-if="item.icon">{{ iconMap[item.icon] || item.icon }}</v-icon>
        </template>
    </v-list-item>
</template>

<script setup lang="ts">
import { toRefs, computed } from 'vue';

const props = defineProps({
    item: { type: Object, required: true },
    parentLink: { type: String, default: '' },
    iconMap: { type: Object, default: () => ({}) },
});
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
