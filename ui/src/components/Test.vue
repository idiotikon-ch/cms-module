<template>
  <div>le test</div>
  <span v-if="article">
    {{ article.title }}
  </span>
</template>
<script setup lang="ts">
const { findOne } = useStrapi()
const article = ref()
const response = await findOne("articles", "zgvkx2itjz59h320n2p36d3g")
article.value = response.data
</script>
