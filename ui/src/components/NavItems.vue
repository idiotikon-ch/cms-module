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

// Synchronously determine which path resolver to use.
// This avoids the race condition of using onBeforeMount.
let pathResolver: (path: any) => any;
let isI18n: boolean;

try {
    const { useLocalePath } = await import('#imports');
    const localePath = useLocalePath();
    pathResolver = (linkName: any) => {
        if (linkName === '/') return localePath('home');
        const resolved = localePath(linkName);
        // Handle the homepage case where localePath resolves to an empty string for the root.
        if (linkName === 'home' && resolved === '') {
            return '/';
        }
        // If localePath can't find a route, it returns the input.
        // In that case, we treat it as an invalid link.
        if (resolved === linkName && typeof linkName === 'string') return undefined;
        return resolved;
    };
    isI18n = true;
} catch (e) {
    // Fallback for non-i18n projects.
    pathResolver = (path: any) => {
        if (typeof path === 'object' && path.name) return path;
        if (typeof path === 'string') {
            if (path === 'home') return '/';
            // Ensure the path is root-relative.
            return path.startsWith('/') ? path : `/${path}`;
        }
        return undefined;
    };
    isI18n = false;
}


const props = defineProps({
    item: { type: Object, required: true },
    parentLink: { type: String, default: '' },
    iconMap: { type: Object, default: () => ({}) },
});
const { item, parentLink } = toRefs(props);

// compute full link from parent + provided link (if present)
const fullLink = computed(() => {
    const segment = item.value.link ?? item.value.path ?? null;

    // Case 1: This is a v-list-group with no link of its own.
    // Its fullLink is just the parent's link, to be passed to children.
    if (!segment) {
        return parentLink.value;
    }

    // Case 2: This is an item with an absolute external link.
    if (typeof segment === 'string' && segment.startsWith('http')) {
        return segment;
    }

    // Case 3: This is a link that needs to be resolved.
    // Sanitize for i18n page names (e.g., 'data/general' -> 'data-general')
    const sanitizedSegment = typeof segment === 'string' ? segment.replace(/\//g, '-') : segment;
    const resolvedSegment = pathResolver(sanitizedSegment);

    // If the segment couldn't be resolved, it might be a structural-only parent.
    if (!resolvedSegment) {
        return parentLink.value;
    }

    // For the non-i18n playground, we must manually construct the path.
    if (!isI18n) {
        const combined = `${parentLink.value || ''}${resolvedSegment}`;
        // Avoid double slashes
        return combined.replace(/\/\//g, '/');
    }

    // For the i18n app, localePath provides the full, correct path.
    return resolvedSegment;
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
