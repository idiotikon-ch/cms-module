<template>
    <div>
        <template v-for="(block, i) in content" :key="i">
            <p v-if="block.type === 'paragraph'">
                <template v-for="(child, j) in block.children" :key="j">
                    {{ child.text }}
                </template>
            </p>
            <h2 v-else-if="block.type === 'heading'">
                <template v-for="(child, j) in block.children" :key="j">
                    {{ child.text }}
                </template>
            </h2>
            <!-- Add more block types as needed -->
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
    content: {
        type: Array,
        required: true
    }
})
</script>
