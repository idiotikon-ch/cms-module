<template>
    <v-navigation-drawer width="310" :temporary="mdAndDown" :scrim="mdAndDown" :style="{ padding: 0 }"
        :model-value="open" :location="location" @update:model-value="onToggle">
        <v-list class="pa-0" v-model:opened="openedGroups">
            <NavItems v-for="item in items" :key="item.rank || item.title" :item="item" :icon-map="iconMap" />
        </v-list>
    </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { toRef, computed, ref, watch } from 'vue';
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

// Import route composable for checking current path
let useRoute: any;
let localePath: any;
try {
    const imports = await import('#imports');
    useRoute = imports.useRoute;
    localePath = imports.useLocalePath();
} catch (e) {
    // Fallback for non-Nuxt environments
    useRoute = null;
    localePath = null;
}

// Maintain opened groups as a ref so user can manually toggle
const openedGroups = ref<string[]>([]);

// Compute which groups should be auto-opened based on current route
const autoOpenedGroups = computed(() => {
    if (!useRoute || !localePath) return [];

    const route = useRoute();
    const currentPath = route.path;
    const opened: string[] = [];

    // Helper to resolve a menu item's link to its full path
    function resolveLink(link: string): string | null {
        if (!link) return null;
        if (link.startsWith('http')) return link;

        // Sanitize for i18n route names (e.g., 'data/general' -> 'data-general')
        const sanitized = link.replace(/\//g, '-');
        try {
            const resolved = localePath(sanitized);
            // localePath returns the input if it can't resolve
            if (resolved === sanitized) return null;
            return resolved;
        } catch {
            return null;
        }
    }

    // Helper to recursively check if any descendant matches current route
    function hasActiveDescendant(item: any): boolean {
        if (!item.sub_menus || !item.sub_menus.length) return false;

        for (const child of item.sub_menus) {
            const childLink = child.link ?? child.path;
            if (childLink && typeof childLink === 'string') {
                const resolvedPath = resolveLink(childLink);

                // Check if current path matches at a path boundary
                const isExactMatch = currentPath === resolvedPath;
                const isChildPath = resolvedPath && currentPath.startsWith(resolvedPath + '/');
                const matches = isExactMatch || isChildPath;

                if (matches) {
                    return true;
                }
            }

            // Recursively check descendants
            if (hasActiveDescendant(child)) {
                return true;
            }
        }

        return false;
    }

    // Recursively process items and build group IDs matching NavItems logic
    function processItem(item: any, parentGroupId: string = ''): void {
        if (!item.sub_menus || !item.sub_menus.length) return;

        // Build groupId the same way as NavItems
        const segment = item.link ?? item.path ?? item.title;
        const sanitized = typeof segment === 'string' ? segment.replace(/\//g, '-') : segment;
        const groupId = parentGroupId ? `${parentGroupId}/${sanitized}` : sanitized;

        // If this group has an active descendant, add it to opened list
        if (hasActiveDescendant(item)) {
            opened.push(groupId);

            // Recursively process nested groups
            item.sub_menus.forEach((child: any) => {
                if (child.sub_menus && child.sub_menus.length) {
                    processItem(child, groupId);
                }
            });
        }
    }

    // Process all top-level items
    props.items.forEach(item => processItem(item as any));

    return opened;
});

// Watch route changes and merge auto-opened with currently opened
watch(autoOpenedGroups, (newAutoOpened) => {
    // Merge auto-opened groups with any manually opened groups
    const combined = new Set([...openedGroups.value, ...newAutoOpened]);
    openedGroups.value = Array.from(combined);
}, { immediate: true });

function onToggle(val: boolean) {
    emit('toggle', val);
}
</script>
