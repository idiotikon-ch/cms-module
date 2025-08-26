<template>
    <div>
        <p>Is Desktop: {{ isDesktop }}</p>
    </div>
</template>

<script setup>
const { isDesktop } = useDevice();
</script>