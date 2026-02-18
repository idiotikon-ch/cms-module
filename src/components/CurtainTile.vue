<template>
  <v-hover v-slot="{ isHovering, props: hoverProps }">
    <v-card ref="cardRef" class="flex w-100 tile-card tile-card-fill" v-bind="hoverProps" external @click="handleClick"
      :style="props.height ? { height: typeof props.height === 'number' ? props.height + 'px' : props.height } : { height: '100%' }">
      <v-img cover :src="imgUrl" class="tile-image tile-image--fill tile-img-fill"
        :gradient="props.tile && props.tile.tile_category ? '' : 'rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)'"
        height="100%">
        <div class="curtain curtain-absolute text-wrap" :class="isHovering || inViewport ? 'bg-primary' : ''" :style="{
          transform: isHovering || inViewport ? '' : 'translateY(45%)',
          opacity: isHovering || inViewport ? 0.8 : 1,
        }">
          <MarkdownRenderer v-if="props.tile" :content="props.tile.title"
            class="text-center text-h5 font-weight-bold" />
          <MarkdownRenderer v-if="props.tile" :content="props.tile.content" class="text-body-2"
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
import { useDevice, navigateTo } from '#imports'

const { isDesktop } = useDevice()
const props = defineProps({
  tile: Object,
  eventBus: {
    type: Object,
    required: false,
    default: () => null,
  },
  height: {
    type: [String, Number],
    required: false,
    default: null,
  },
  newTab: {
    type: Boolean,
    required: false,
    default: undefined,
  },
});

// Extract the absolute image URL from the tile (no construction)
const imgUrl = computed(() => {
  const pic = Array.isArray(props.tile?.picture) ? props.tile.picture[0] : props.tile?.picture;
  return pic?.url || '';
})

const linkTarget = computed(() => {
  // if newTab is explicitly true, open in new tab
  if (props.newTab === true) {
    return '_blank';
  }
  // if newTab is explicitly false, open in same tab
  if (props.newTab === false) {
    return '_self';
  }
  // if newTab is undefined, check the CMS data
  if (props.tile.link_target_type === 'new-tab') {
    return '_blank';
  }
  if (props.tile.link_target_type === 'same-tab') {
    return '_self';
  }
  // Fallback to '_self' if nothing is specified
  return '_self';
});

function handleClick() {
  const link = props.tile?.link;
  const cmsTarget = props.tile?.link_target_type;
  const finalTarget = linkTarget.value;

  if (link) {
    navigateTo(link, { open: { target: finalTarget } });
  }
}

const cardRef = ref()
const inViewport = ref(false)
const { height } = useDisplay()

// Use provided event bus or create a local instance
const eventBus = props.eventBus || mitt();

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
/* Overlay content absolutely centered over the image */
.curtain {
  color: white;
  justify-content: center;
  transition: all 0.5s ease;
}

.curtain-absolute {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  padding: 0 1.5rem;
}

.tile-card-fill {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.tile-img-fill {
  height: 100% !important;
  min-height: 0 !important;
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
