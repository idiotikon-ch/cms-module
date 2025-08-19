<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card ref="cardRef" class="flex w-100" v-bind="props" external @click="
      navigateTo(tile.link, {
        open: {
          target: tile.link_target_type,
        },
      })
      ">
      <v-img cover :src="imgUrl" class="h-100" :gradient="tile.tile_category ? '' : 'rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)'
        ">
        <div class="px-5 pt-5 curtain text-wrap h-100" :class="isHovering || inViewport ? 'bg-primary' : ''" :style="{
          transform: isHovering || inViewport ? '' : 'translateY(45%)',
          opacity: isHovering || inViewport ? 0.8 : 1,
        }">
          <vue-markdown :source="tile.title" class="text-center text-h5 font-weight-bold" />
          <vue-markdown class="text-body-2" :style="{ opacity: isHovering || inViewport ? 1 : 0 }"
            :source="tile.content" />
          <vue-markdown v-if="!tile.tile_category" source="Zum Projekt" class="font-weight-bold"
            :style="{ fontSize: '0.875rem' }" />
        </div>
      </v-img>
    </v-card>
  </v-hover>
</template>

<script lang="ts" setup>
import VueMarkdown from "vue-markdown-render"

const { isDesktop } = useDevice()
const runtimeConfig = useRuntimeConfig()
const cmsImagesUrl = runtimeConfig.public.strapi.url
const { tile } = defineProps(["tile"])
const imgUrl = ref(`${cmsImagesUrl}${tile.picture.url}`)
const cardRef = ref()
const inViewport = ref(false)
const { height } = useDisplay()
onMounted(function () {
  if (!isDesktop) {
    useListen("scrollY", function () {
      const bounds = cardRef.value.$el.getBoundingClientRect()
      if (bounds.top > height.value / 2) {
        // upper bound of card under display middle: hidden
        inViewport.value = false
      }
      if (bounds.top <= height.value / 2) {
        // upper bound of card over display middle: show
        inViewport.value = true
      }
      if (bounds.bottom < height.value / 2) {
        // lower bound over display middle: hide
        inViewport.value = false
      }
    })
  }
})
onUnmounted(() => stopListen("scrollY"))
</script>
<style scoped>
.curtain {
  color: white;
  justify-content: center;

  transition: all 0.5s ease;
}
</style>
