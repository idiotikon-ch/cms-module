<template>
  <v-app>

    <v-app-bar color="primary" :extended="!smAndUp && shrinkAppBar ? false : true" class="pr-4" density="compact">
      <v-app-bar-nav-icon @click="showDrawer = !showDrawer" :class="xs ? 'mt-2' : 'mt-8'">
      </v-app-bar-nav-icon>
      <v-app-bar-title @click="router.push({ name: 'index' })" class="align-self-start"
        :class="xs ? 'ml-0' : 'ml-2 mt-5'">
        <!-- <a href="/">
          <v-img v-if="xs && !shrinkAppBar" to="/" :src="'/static/img/si_logo_standard_neg_rgb.svg'" class="mt-n2 ml-n2"
            position="left top" height="90px"></v-img>
          <v-img v-else-if="xs && shrinkAppBar" to="/" :src="'/static/img/si_logo_neg_rgb.svg'" class="mt-2 ml-2"
            position="left top" height="31px"></v-img>
          <v-img v-else to="/" :src="'/static/img/si_logo_1z_neg_rgb.svg'" class="mt-1" position="left top"
            height="70px"></v-img>
        </a> -->
        <h2>Kleiner Sprachatlas der deutschen Schweiz</h2>
      </v-app-bar-title>
    </v-app-bar>

    <IdiCmsNavDrawer :items="menuItems" :open="showDrawer" @toggle="handleToggle" @select="handleSelect" />

    <v-main v-scroll="onScroll" class="d-flex align-center flex-column">
      <v-container fluid class="my-10" :style="{ width: mdAndUp && !showDrawer ? '70%' : '90%', maxWidth: '1150px' }">
        <NuxtPage />
      </v-container>
      <v-tooltip v-model="show" location="left">nach oben
        <template v-slot:activator="{ props }">
          <v-btn v-show="showScrollUp" @click="scrollTop" :icon="mdiChevronUp" v-bind="props" density="comfortable"
            style="z-index: 1; position: fixed"
            :style="{ bottom: lgAndUp ? '50px' : '20px', right: lgAndUp ? '50px' : '20px' }" color="primary"></v-btn>
        </template>
      </v-tooltip>
    </v-main>


  </v-app>
</template>

<script setup>
import { useRouter } from '#app'
import { useDisplay } from 'vuetify'
import { ref, onMounted } from 'vue'
import { mdiMagnify, mdiChevronUp } from '@mdi/js'

// optional: try to use the project's Strapi composable if available
let useStrapiAvailable = false
try {
  // dynamic require can fail in the playground; guard it
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const maybe = require('~/src/composables/useStrapi')
  if (maybe) useStrapiAvailable = true
} catch (e) {
  useStrapiAvailable = false
}

const router = useRouter()
const { xs, smAndUp, mdAndUp, lgAndUp } = useDisplay() // Destructure `mdAndUp`

const shrinkAppBar = ref(false) // Define `shrinkAppBar` as a reactive variable
const showScrollUp = ref(false) // Define `showScrollUp` as a reactive variable
const show = ref(false)

const onScroll = (event) => {
  const target = event.target?.documentElement;
  if (target.scrollTop >= 10) {
    shrinkAppBar.value = true;
    showScrollUp.value = true;
  }
  else {
    shrinkAppBar.value = false;
    showScrollUp.value = false;
  }
  // useEmit("scrollY", target.scrollTop)
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

const showDrawer = ref(lgAndUp.value);

const menuItems = ref([
  { title: 'Start', link: { name: 'index' }, icon: 'mdi-home-outline' },
  { title: 'Sprachatlas', link: { name: 'tiles' }, icon: 'mdi-view-module' },
  { title: 'Karten', link: { name: 'maps' }, icon: 'mdi-map' },
  { title: 'Für Schulen', link: { name: 'schools' }, icon: 'mdi-school' },
  { title: 'Downloads', link: { name: 'downloads' }, icon: 'mdi-download' },
  { title: 'Kontakt', link: { name: 'contact' }, icon: 'mdi-contact-mail' }
]);

function handleToggle(val) {
  showDrawer.value = val;
}

function handleSelect(payload) {
  // payload: { item, link }
  const link = payload?.link || payload?.item?.link || payload?.item?.path;
  if (link) {
    // prefer named routes when possible
    try {
      router.push(link)
    } catch (e) {
      // fallback: ignore
    }
  }
}

onMounted(async () => {
  if (!useStrapiAvailable) return;
  try {
    // import the composable dynamically
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { useStrapi } = require('~/src/composables/useStrapi')
    const { find } = useStrapi()
    const res = await find('menus', {
      populate: ['sub_menus', 'sub_menus.sub_menus', 'sub_menus.sub_menus.sub_menus'],
      filters: { title: { $eq: 'root' } },
    })
    const items = res?.data?.[0]?.sub_menus || menuItems.value
    menuItems.value = items
  } catch (e) {
    // ignore fetch errors and keep fallback
  }
})

</script>
