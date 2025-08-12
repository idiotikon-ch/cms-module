<template>
  <div>le test</div>
  {{ article.title }}
</template>
<script setup lang="ts">
const { findOne } = useStrapi()
const response = await findOne("articles", "zgvkx2itjz59h320n2p36d3g")
const article = response.data
</script>
