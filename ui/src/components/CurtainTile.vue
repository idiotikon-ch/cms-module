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
        </div>
      </v-img>
    </v-card>
  </v-hover>
</template>

<script lang="ts" setup>
import VueMarkdown from "vue-markdown-render"
import { useDisplay } from "vuetify"
import mitt from "mitt"; // Import mitt for event bus functionality
import { ref, onMounted, onUnmounted } from "vue"; // Import Vue composition API functions

const { isDesktop } = useDevice()
const runtimeConfig = useRuntimeConfig()
const cmsImagesUrl = runtimeConfig.public.strapi.url
const { tile, eventBus: providedEventBus } = defineProps({
  tile: Object,
  eventBus: {
    type: Object,
    required: false,
    default: () => null,
  },
});

const imgUrl = ref(`${cmsImagesUrl}${tile.picture.url}`)
const cardRef = ref()
const inViewport = ref(false)
const { height } = useDisplay()

// Use provided event bus or create a local instance
const eventBus = providedEventBus || mitt();

onMounted(function () {
  if (!isDesktop) {
    // Emit scrollY events using the event bus
    window.addEventListener("scroll", () => {
      eventBus.emit("scrollY", window.scrollY);
    });

    eventBus.on("scrollY", function () {
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
    });
  }
})

onUnmounted(() => {
  // Clean up event listeners
  eventBus.off("scrollY");
  window.removeEventListener("scroll", () => {
    eventBus.emit("scrollY", window.scrollY);
  });
})
</script>
<style scoped>
.curtain {
  color: white;
  justify-content: center;

  transition: all 0.5s ease;
}
</style>
