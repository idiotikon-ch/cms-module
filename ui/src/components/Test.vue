<template>
  <div>le test s</div>
  <span v-if="article">
    {{ article.title }}
  </span>
  <span v-else>
    Article not found.
  </span>
</template>
<script setup lang="ts">
const { findOne } = useStrapi()
const article = ref()
try {
  const response = await findOne("articles", "zgvkx2itjz59h320n2p36d3g")
  article.value = response.data
} catch (error) {
  console.error("Error fetching article:", error)
  article.value = null // Handle the case where the article does not exist
}
</script>
