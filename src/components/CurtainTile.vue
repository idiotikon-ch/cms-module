<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card ref="cardRef" class="flex w-100 tile-card" v-bind="props" external @click="
      navigateTo(tile.link, {
        open: {
          target: tile.link_target_type,
        },
      })
      ">
      <v-img cover :src="imgUrl" class="tile-image tile-image--fill" :gradient="tile.tile_category ? '' : 'rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)'
        ">
        <div class="px-5 pt-5 curtain text-wrap h-100" :class="isHovering || inViewport ? 'bg-primary' : ''" :style="{
          transform: isHovering || inViewport ? '' : 'translateY(45%)',
          opacity: isHovering || inViewport ? 0.8 : 1,
        }">

          <MarkdownRenderer v-if="tile" :content="tile.title" class="text-center text-h5 font-weight-bold" />
          <MarkdownRenderer v-if="tile" :content="tile.content" class="text-body-2"
            :style="{ opacity: isHovering || inViewport ? 1 : 0 }" />
        </div>
      </v-img>
    </v-card>
  </v-hover>
</template>

<script lang="ts" setup>
import { useDisplay } from "vuetify"
import mitt from "mitt"; // Import mitt for event bus functionality
import { ref, onMounted, onUnmounted, computed } from "vue"; // Import Vue composition API functions
import MarkdownRenderer from '../components/MarkdownRenderer.vue'
import { useDevice } from '#imports'

const { isDesktop } = useDevice()
const { tile, eventBus: providedEventBus } = defineProps({
  tile: Object,
  eventBus: {
    type: Object,
    required: false,
    default: () => null,
  },
});

// Extract the absolute image URL from the tile (no construction)
const imgUrl = computed(() => {
  const pic = Array.isArray(tile.picture) ? tile.picture[0] : tile.picture;
  return pic?.url || '';
})
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
<style scoped>
/* Force all text inside .curtain to be white, overriding Vuetify and global styles */
.curtain,
.curtain :deep(h1),
.curtain :deep(h2),
.curtain :deep(h3),
.curtain :deep(h4),
.curtain :deep(h5),
.curtain :deep(h6),
.curtain :deep(p),
.curtain :deep(strong),
.curtain :deep(em),
.curtain :deep(span),
.curtain :deep(li),
.curtain :deep(ul),
.curtain :deep(ol),
.curtain :deep(a),
.curtain :deep(.text-h5),
.curtain :deep(.font-weight-bold),
.curtain :deep(.text-body-2) {
  color: white !important;
}
</style>
