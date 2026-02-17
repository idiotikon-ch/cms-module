<template>
  <v-app>

    <v-app-bar color="primary" :extended="!smAndUp && shrinkAppBar ? false : true" class="pr-4" density="compact">
      <v-app-bar-nav-icon @click="showDrawer = !showDrawer" :class="xs ? 'mt-2' : 'mt-8'">
      </v-app-bar-nav-icon>
      <v-app-bar-title @click="router.push({ name: 'index' })" class="align-self-start mt-2"
        :class="xs ? 'ml-0' : 'ml-2'">Und wieder ein CMS vom Idiotikon
      </v-app-bar-title>

      <a href="https://www.idiotikon.ch/" target="_blank">
        <v-img src="/static/img/si_logo_rund_neg_rgb.svg" class="hidden-xs" width="90" height="90" style="top:20px;"
          v-show="!shrinkAppBar"></v-img>
      </a>

    </v-app-bar>

    <IdiCmsNavDrawer :items="menuItems" :open="showDrawer" :icon-map="iconMap" @toggle="handleToggle"
      @select="handleSelect" />

    <v-main v-scroll="onScroll" class="d-flex align-center flex-column">
      <v-container fluid class="my-10" :style="{ width: mdAndUp && !showDrawer ? '70%' : '90%', maxWidth: '1150px' }">
        <NuxtPage />
      </v-container>


      <v-container class="footer pb-0 pl-0 pr-0 mt-auto">
        <div class="d-flex w-100 align-center flex-column upper_footer">
          <v-card class="align-top" :style="{ width: mdAndUp && !showDrawer ? '70%' : '90%', maxWidth: '1150px' }" flat>
            <v-row class="ma-0">
              <v-col class="px-0" cols="6">
                <p class="header">Adresse</p>
                <idiCmsContactInfo address="Schweizerisches Idiotikon\nAuf der Mauer 5\n8001 Zürich"
                  email="info@idiotikon.ch" phone="+41 (0) 44 251 36 76" />
              </v-col>
              <v-col class="sagw px-0" cols="2">
                <v-img height="60" :src="'/static/img/SAGW_Logo_addition_supported_sw_pos.svg'"></v-img>
              </v-col>
            </v-row>
          </v-card>
        </div>
        <div class="px-4 py-2 w-100 lower_footer">
          <p>
            Copyright © {{ new Date().getFullYear() }} | <NuxtLink to="/datenschutz">Datenschutzerklärung</NuxtLink>
            |
            <NuxtLink to="/impressum">Impressum</NuxtLink>
          </p>
        </div>
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
import { mdiMagnify, mdiChevronUp, mdiHome, mdiTextBox, mdiViewGrid } from '@mdi/js'
import { useStrapi } from '#imports'
const { find } = useStrapi()

const iconMap = {
  magnify: mdiMagnify,
  'chevron-up': mdiChevronUp,
  home: mdiHome,
  text: mdiTextBox,
  tiles: mdiViewGrid,
}

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
    // shrinkAppBar.value = true;
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

// const menuItems = ref([
//   { title: 'Start', link: { name: 'index' }, icon: 'mdi-home-outline' },
//   { title: 'Tiles! Tiles! Tiles!', link: { name: 'tiles' }, icon: 'mdi-school' },
//   { title: 'Accordions', link: { name: 'accordions' }, icon: 'mdi-accordion' },
// ]);


const menuItemsData = (await find("menus", {
  populate: [
    'sub_menus',
    'sub_menus.sub_menus',
    'sub_menus.sub_menus.sub_menus' // menu has 3 levels
  ],
  filters: { title: { $eq: 'root' } },
})).data[0].sub_menus;

// Add icons to the fetched menu items
if (menuItemsData && menuItemsData.length) {
  // Assuming the order is Start, Text, Tiles
  if (menuItemsData[0]) menuItemsData[0].icon = 'home';
  if (menuItemsData[1]) menuItemsData[1].icon = 'text';
  if (menuItemsData[2]) menuItemsData[2].icon = 'tiles';
}

const menuItems = menuItemsData;

</script>

<style scoped>
.v-container.footer {
  max-width: none !important;
}

.v-container.footer a {
  color: inherit;
}

.upper_footer,
.upper_footer .v-card {
  background-color: #272c31;
  color: #C4CED0;
}

.lower_footer {
  background-color: #1c1d1f;
  color: #C4CED0;
  text-align: center;
}

.upper_footer .v-card div {
  font-size: 0.9rem;
  line-height: 1.1rem;
  margin-bottom: 1rem;
  padding-bottom: 0;
}

.upper_footer .v-card .header {
  font-size: 1rem;
  font-weight: bold;
}






:deep(.v-toolbar__content) {
  overflow: visible;
}

.v-toolbar {
  padding-top: 0 !important;
}
</style>
