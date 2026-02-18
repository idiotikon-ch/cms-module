<template>
  <div>le test</div>
  <span v-if="article">
    {{ article.title }}
  </span>
  <span v-else>
    Article not found.
  </span>

  <div v-if="tile">
    <h2>{{ tile.title }}</h2>
    <div v-html="renderMarkdown(tile.content)"></div>
    <img v-if="tile.picture" :src="`${cms_images_url}${tile.picture.url}`" alt="Tile Image" />
  </div>
  <div v-else>
    Tile not found.
  </div>
</template>
<script setup lang="ts">
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

const { findOne } = useStrapi()
const article = ref()
try {
  const response = await findOne("articles", "zgvkx2itjz59h320n2p36d3g")
  article.value = response.data
} catch (error) {
  console.error("Error fetching article:", error)
  article.value = null // Handle the case where the article does not exist
}

const tile = ref()
try {
  const response = await findOne("tiles", "cbycpkv1yhgqznt7i56rxxym")
  tile.value = response.data
} catch (error) {
  console.error("Error fetching tile:", error)
  tile.value = null // Handle the error
}

// Function to render Markdown
const renderMarkdown = (content: string) => {
  return md.render(content || '')
}
</script>
